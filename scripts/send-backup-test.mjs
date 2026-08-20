import { sendDailyBackupEmail } from "../server/backupEmail.ts";

const result = await sendDailyBackupEmail();
console.log(JSON.stringify({ ok: true, filename: result.filename, generatedAt: result.generatedAt, recipient: result.recipient }));
