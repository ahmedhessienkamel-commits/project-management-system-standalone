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

export async function sendPasswordResetEmail(input: { to: string; recipientName?: string | null; resetUrl: string; expiresAt: Date }) {
  const from = process.env.GMAIL_USERNAME;
  const transporter = getMailer();
  return transporter.sendMail({
    from: `نظام إدارة المشاريع <${from}>`,
    to: input.to,
    subject: "استعادة كلمة المرور — نظام إدارة المشاريع",
    text: `مرحبًا ${input.recipientName || ""}\n\nتم طلب استعادة كلمة المرور لحسابك. افتح الرابط التالي لإنشاء كلمة مرور جديدة:\n${input.resetUrl}\n\nالرابط صالح حتى: ${input.expiresAt.toLocaleString("ar-SA")}، وإذا لم تطلب ذلك فتجاهل الرسالة.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9;color:#18324b"><h2>استعادة كلمة المرور</h2><p>مرحبًا ${input.recipientName || ""}</p><p>تم طلب استعادة كلمة المرور لحسابك. استخدم الزر التالي لإنشاء كلمة مرور جديدة:</p><p><a href="${input.resetUrl}" style="display:inline-block;background:#18324b;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">إنشاء كلمة مرور جديدة</a></p><p style="font-size:13px;color:#64748b">الرابط صالح حتى ${input.expiresAt.toLocaleString("ar-SA")} ولمرة واحدة فقط.</p></div>`,
  });
}

export async function sendOverdueTaskEmail(input: { to: string; recipientName?: string | null; taskTitle: string; dueDate: string }) {
  const from = process.env.GMAIL_USERNAME;
  const transporter = getMailer();
  return transporter.sendMail({
    from: `نظام إدارة المشاريع <${from}>`,
    to: input.to,
    subject: `تنبيه: مهمة متأخرة — ${input.taskTitle}`,
    text: `مرحبًا ${input.recipientName || ""}\n\nالمهمة «${input.taskTitle}» متأخرة عن موعدها المحدد في ${input.dueDate}. يرجى تحديث حالتها من النظام.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9;color:#18324b"><h2 style="color:#b45309">تنبيه مهمة متأخرة</h2><p>مرحبًا ${input.recipientName || ""}</p><p>المهمة <b>«${input.taskTitle}»</b> تجاوزت موعد الاستحقاق المحدد في <b>${input.dueDate}</b>.</p><p>يرجى فتح لوحة المهام وتحديث الحالة أو إضافة ملاحظة.</p></div>`,
  });
}

export async function sendExecutiveDigestEmail(input: { to: string; recipientName?: string | null; subject: string; snapshot: any }) {
  const from = process.env.GMAIL_USERNAME;
  const transporter = getMailer();
  const { workload = [], overdueTasks = [], pendingApprovals = [], overdueApprovals = [], pendingLeaves = [], pendingAdvances = [], averageApprovalHours = 0 } = input.snapshot || {};
  const workloadRows = workload.map((item: any) => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.fullName}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.open + item.inProgress}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#b45309">${item.overdue}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${item.done}</td></tr>`).join("");
  const summary = `مهام متأخرة: ${overdueTasks.length} · موافقات معلقة: ${pendingApprovals.length} · موافقات متأخرة: ${overdueApprovals.length} · إجازات معلقة: ${pendingLeaves.length} · سلف معلقة: ${pendingAdvances.length} · متوسط عمر الموافقة المعلقة: ${Number(averageApprovalHours).toFixed(1)} ساعة`;
  return transporter.sendMail({
    from: `نظام إدارة المشاريع <${from}>`,
    to: input.to,
    subject: input.subject,
    text: `مرحبًا ${input.recipientName || ""}\n\n${summary}\n\nهذا ملخص تنفيذي يومي من نظام إدارة المشاريع.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9;color:#18324b;max-width:760px"><div style="background:#18324b;color:#fff;padding:22px;border-radius:12px"><div style="color:#f5e9c8;font-size:12px">نظام إدارة المشاريع</div><h2 style="margin:5px 0">الملخص التنفيذي اليومي</h2><p style="margin:0;color:#dbeafe">مرحبًا ${input.recipientName || ""}، هذه أهم مؤشرات المتابعة.</p></div><div style="margin-top:18px;padding:16px;background:#f8fafc;border-radius:10px"><b>${summary}</b></div><h3>عبء العمل حسب الموظف</h3><table style="width:100%;border-collapse:collapse;text-align:right"><thead><tr style="background:#f5f0e5"><th style="padding:8px">الموظف</th><th style="padding:8px">المفتوحة</th><th style="padding:8px">المتأخرة</th><th style="padding:8px">المكتملة</th></tr></thead><tbody>${workloadRows || `<tr><td colspan="4" style="padding:14px;text-align:center;color:#64748b">لا توجد مهام مسندة حاليًا.</td></tr>`}</tbody></table><p style="margin-top:20px;color:#64748b;font-size:13px">افتح النظام لمراجعة التفاصيل واتخاذ الإجراءات المطلوبة.</p></div>`,
  });
}

export async function sendTaskReminderEmail(input: { to: string; recipientName?: string | null; ownerName?: string | null; taskTitle: string; description?: string | null; startDate?: string | null; endDate?: string | null; progress?: number; priority?: string | null }) {
  const from = process.env.GMAIL_USERNAME;
  const transporter = getMailer();
  const priority = input.priority === "high" ? "عالية" : input.priority === "low" ? "منخفضة" : "عادية";
  return transporter.sendMail({
    from: `${input.ownerName || "صاحب العمل"} — نظام إدارة المشاريع <${from}>`,
    to: input.to,
    subject: `تذكير من ${input.ownerName || "صاحب العمل"}: ${input.taskTitle}`,
    text: `مرحبًا ${input.recipientName || ""}\n\nيرجى متابعة المهمة «${input.taskTitle}».\n${input.description || ""}\nالبداية: ${input.startDate || "غير محددة"}\nالنهاية: ${input.endDate || "غير محددة"}\nنسبة الإنجاز الحالية: ${input.progress || 0}%\nالأولوية: ${priority}\n\nهذه رسالة تذكير من ${input.ownerName || "صاحب العمل"}.`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;line-height:1.9;color:#18324b;max-width:680px"><div style="background:#18324b;color:#fff;padding:22px;border-radius:12px"><div style="font-size:12px;color:#f5e9c8">من ${input.ownerName || "صاحب العمل"}</div><h2 style="margin:5px 0">تذكير بمتابعة مهمة</h2></div><div style="padding:20px"><p>مرحبًا ${input.recipientName || ""}،</p><p>يرجى متابعة المهمة <b>«${input.taskTitle}»</b>.</p><p style="color:#64748b">${input.description || "لا يوجد وصف إضافي."}</p><div style="background:#f8fafc;border-radius:10px;padding:14px"><p>البداية: <b>${input.startDate || "غير محددة"}</b></p><p>النهاية: <b>${input.endDate || "غير محددة"}</b></p><p>نسبة الإنجاز الحالية: <b>${input.progress || 0}%</b></p><p>الأولوية: <b>${priority}</b></p></div><p style="color:#64748b;font-size:13px">هذه رسالة تذكير من ${input.ownerName || "صاحب العمل"} عبر نظام إدارة المشاريع.</p></div></div>`,
  });
}
