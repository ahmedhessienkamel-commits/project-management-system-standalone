import mysql from 'mysql2/promise';

const pool = mysql.createPool(process.env.DATABASE_URL);
const [rows] = await pool.query('SHOW FULL PROCESSLIST');
for (const row of rows) {
  console.log(JSON.stringify({ id: row.Id, user: row.User, host: row.Host, db: row.db, command: row.Command, time: row.Time, state: row.State, info: row.Info }));
}
await pool.end();
