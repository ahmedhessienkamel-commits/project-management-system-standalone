import { createBackupDocument } from "./routers/backup";
import { getMailFrom, getMailer } from "./emailTransport";

function getBackupRecipient() {
  const recipient = process.env.BACKUP_EMAIL_RECIPIENT?.trim();
  if (!recipient) throw new Error("BACKUP_EMAIL_RECIPIENT غير مهيأ للنسخ الاحتياطي بالبريد.");
  return recipient;
}

export async function sendDailyBackupEmail() {
  const document = await createBackupDocument();
  const filename = `erp-backup-${document.generatedAt.replace(/[:.]/g, "-")}.json`;
  const transporter = getMailer();
  const recipient = getBackupRecipient();
  await transporter.sendMail({
    from: getMailFrom(),
    to: recipient,
    subject: `نسخة احتياطية يومية لنظام ERP — ${document.generatedAt.slice(0, 10)}`,
    text: "مرفق النسخة الاحتياطية اليومية لبيانات نظام ERP. لا تحتوي النسخة على كلمات المرور أو مفاتيح الأسرار.",
    attachments: [{ filename, content: Buffer.from(JSON.stringify(document, null, 2), "utf8"), contentType: "application/json" }],
  });
  return { filename, generatedAt: document.generatedAt, recipient };
}
