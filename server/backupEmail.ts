import nodemailer from "nodemailer";
import { createBackupDocument } from "./routers/backup";

const recipient = "prettyreward@gmail.com";

function getMailer() {
  const username = process.env.GMAIL_USERNAME;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!username || !password) throw new Error("إعدادات Gmail غير مكتملة");
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: username, pass: password.replace(/\s/g, "") },
  });
}

export async function sendDailyBackupEmail() {
  const document = await createBackupDocument();
  const filename = `erp-backup-${document.generatedAt.replace(/[:.]/g, "-")}.json`;
  const transporter = getMailer();
  await transporter.sendMail({
    from: process.env.GMAIL_USERNAME,
    to: recipient,
    subject: `نسخة احتياطية يومية لنظام ERP — ${document.generatedAt.slice(0, 10)}`,
    text: "مرفق النسخة الاحتياطية اليومية لبيانات نظام ERP. لا تحتوي النسخة على كلمات المرور أو مفاتيح الأسرار.",
    attachments: [{ filename, content: Buffer.from(JSON.stringify(document, null, 2), "utf8"), contentType: "application/json" }],
  });
  return { filename, generatedAt: document.generatedAt, recipient };
}
