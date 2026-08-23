import "dotenv/config";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import mysql from "mysql2/promise";
import { importableTableEntries, isPortableDataDocument, normalizeMysqlValue } from "./portable-data-helpers.mjs";

const input = resolve(process.argv[2] || "exports/erp-portable-data.json.gz");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const raw = await readFile(input);
const document = JSON.parse(gunzipSync(raw).toString("utf8"));
if (!isPortableDataDocument(document)) {
  console.error("The input is not a supported ERP portable data document");
  process.exit(1);
}

const sourceTables = importableTableEntries(document.tables);
const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [credentialRows] = await connection.query(
    "SELECT email, passwordHash, loginMethod FROM users WHERE email IS NOT NULL AND passwordHash IS NOT NULL",
  );
  const localCredentials = credentialRows.filter((row) => row.email && row.passwordHash);

  await connection.beginTransaction();
  await connection.query("SET FOREIGN_KEY_CHECKS = 0");

  for (const [table] of sourceTables) {
    await connection.query("DELETE FROM ??", [table]);
  }

  const importedCounts = {};
  for (const [table, rows] of sourceTables) {
    if (!rows.length) {
      importedCounts[table] = 0;
      continue;
    }

    const [columnRows] = await connection.query("SHOW COLUMNS FROM ??", [table]);
    const columnTypes = new Map(columnRows.map((column) => [column.Field, column.Type]));
    const columns = Object.keys(rows[0]).filter((column) => columnTypes.has(column));
    if (!columns.length) {
      throw new Error(`No compatible columns found for ${table}`);
    }

    for (let offset = 0; offset < rows.length; offset += 100) {
      const batch = rows.slice(offset, offset + 100).map((row) =>
        columns.map((column) => normalizeMysqlValue(row[column], columnTypes.get(column))),
      );
      await connection.query("INSERT INTO ?? (??) VALUES ?", [table, columns, batch]);
    }
    importedCounts[table] = rows.length;
  }

  const restoredLocalAccounts = [];
  for (const credential of localCredentials) {
    const [result] = await connection.query(
      "UPDATE users SET passwordHash = ?, loginMethod = ? WHERE email = ?",
      [credential.passwordHash, credential.loginMethod || "password", credential.email],
    );
    if (result.affectedRows) restoredLocalAccounts.push(credential.email);
  }

  await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  await connection.commit();
  console.log(JSON.stringify({ importedCounts, restoredLocalAccounts, excludedTables: document.omitted || {} }, null, 2));
} catch (error) {
  await connection.rollback();
  try {
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
  } catch {
    // Best-effort cleanup after a connection-level failure.
  }
  throw error;
} finally {
  await connection.end();
}
