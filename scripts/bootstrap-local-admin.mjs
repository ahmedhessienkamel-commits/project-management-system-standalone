import "dotenv/config";
import { randomUUID, scryptSync } from "node:crypto";
import mysql from "mysql2/promise";

const [, , emailArg, passwordArg, nameArg = "مالك النظام"] = process.argv;
const email = emailArg?.trim().toLowerCase();
const password = passwordArg;

if (!email || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 12) {
  console.error("Usage: pnpm local:bootstrap-admin <email> <password-min-12> [display-name]");
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const salt = randomUUID().replace(/-/g, "");
const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
const connection = await mysql.createConnection(process.env.DATABASE_URL);

try {
  const [rows] = await connection.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);
  const existing = rows[0];
  if (existing?.id) {
    await connection.execute(
      "UPDATE users SET passwordHash = ?, loginMethod = 'password', role = 'admin', lastSignedIn = NOW() WHERE id = ?",
      [passwordHash, existing.id],
    );
    console.log(`Local administrator password updated for ${email}`);
  } else {
    await connection.execute(
      "INSERT INTO users (openId, name, email, loginMethod, role, passwordHash, lastSignedIn) VALUES (?, ?, ?, 'password', 'admin', ?, NOW())",
      [`local-${randomUUID()}`, nameArg.trim(), email, passwordHash],
    );
    console.log(`Local administrator created for ${email}`);
  }
} finally {
  await connection.end();
}
