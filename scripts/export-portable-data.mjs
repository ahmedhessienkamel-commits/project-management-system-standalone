import "dotenv/config";
import { gzipSync } from "node:zlib";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import mysql from "mysql2/promise";

const output = resolve(process.argv[2] || "exports/erp-portable-data.json.gz");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const excludedTables = new Set(["passwordResetTokens", "userInvitations", "__drizzle_migrations"]);
const excludedColumns = new Set(["passwordHash", "tokenHash", "token"]);
const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [tableRows] = await connection.query("SHOW TABLES");
  const tables = {};
  const omitted = {};

  for (const tableRow of tableRows) {
    const table = Object.values(tableRow)[0];
    if (typeof table !== "string") continue;
    if (excludedTables.has(table)) {
      omitted[table] = "contains password-reset secrets";
      continue;
    }

    const [columnRows] = await connection.query("SHOW COLUMNS FROM ??", [table]);
    const columns = columnRows.map((column) => column.Field).filter((column) => !excludedColumns.has(column));
    const removed = columnRows.map((column) => column.Field).filter((column) => excludedColumns.has(column));
    if (removed.length) omitted[table] = `excluded sensitive columns: ${removed.join(", ")}`;
    const [rows] = columns.length ? await connection.query("SELECT ?? FROM ??", [columns, table]) : [[]];
    tables[table] = rows;
  }

  const document = {
    format: "erp-portable-data",
    version: 1,
    generatedAt: new Date().toISOString(),
    note: "Portable data snapshot. Password hashes, reset tokens, invitation records, migration history and other secret tokens are not included.",
    omitted,
    tables,
  };
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, gzipSync(JSON.stringify(document)));
  console.log(`Portable data snapshot written to ${output}`);
} finally {
  await connection.end();
}
