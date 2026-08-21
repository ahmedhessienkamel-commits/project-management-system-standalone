import nodemailer from "nodemailer";

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

export async function sendApprovalEmail(input: { to: string; recipientName?: string | null; title: string; message: string; approvalUrl: string }) {
  const from = process.env.GMAIL_USERNAME;
  const transporter = getMailer();
  return transporter.sendMail({
    from: `نظام إدارة المشاريع <${from}>`,
    to: input.to,
    subject: `طلب موافقة جديد — ${input.title}`,
    text: `مرحبًا ${input.recipientName || ""}\n\n${input.message}\n\nفتح شاشة الموافقات:\n${input.approvalUrl}`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9;color:#18324b"><h2>${input.title}</h2><p>مرحبًا ${input.recipientName || ""}</p><p>${input.message}</p><p><a href="${input.approvalUrl}" style="display:inline-block;background:#18324b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">فتح شاشة الموافقات</a></p></div>`,
  });
}

export async function sendInvitationEmail(input: { to: string; recipientName?: string | null; jobTitle: string; role: string; invitationUrl: string; expiresAt: Date }) {
  const from = process.env.GMAIL_USERNAME;
  const roleLabel = input.role === "general_manager" ? "مدير عام" : input.role === "project_manager" ? "مدير مشاريع" : input.role === "procurement_manager" ? "مدير مشتريات" : "مستخدم";
  const transporter = getMailer();
  return transporter.sendMail({
    from: `نظام إدارة المشاريع <${from}>`,
    to: input.to,
    subject: "دعوة الدخول إلى نظام إدارة المشاريع",
    text: `مرحبًا ${input.recipientName || ""}\n\nتمت دعوتك للدخول إلى نظام إدارة المشاريع بصفتك ${roleLabel} (${input.jobTitle}).\n\nرابط الدعوة:\n${input.invitationUrl}\n\nصلاحية الرابط حتى: ${input.expiresAt.toLocaleString("ar-SA")}\n\nإذا لم تطلب هذه الدعوة فتجاهل الرسالة.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9;color:#18324b"><h2>دعوة الدخول إلى نظام إدارة المشاريع</h2><p>مرحبًا ${input.recipientName || ""}</p><p>تمت دعوتك للدخول إلى النظام بصفتك <strong>${roleLabel}</strong> — ${input.jobTitle}.</p><p><a href="${input.invitationUrl}" style="display:inline-block;background:#18324b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">فتح رابط الدعوة</a></p><p style="font-size:13px;color:#64748b">الرابط صالح حتى ${input.expiresAt.toLocaleString("ar-SA")}، وإذا لم تطلب هذه الدعوة فتجاهل الرسالة.</p></div>`,
  });
}
