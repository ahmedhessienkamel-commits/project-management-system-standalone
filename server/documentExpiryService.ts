import { eq } from "drizzle-orm";
import { complianceDocuments, employees, notifications, users } from "../drizzle/schema";
import { getDb } from "./db";
import { sendApprovalEmail } from "./email";
import { getAppUrl } from "./appUrl";
import { documentAlertKey, documentExpiryLabel, documentExpiryStage, daysUntilExpiry } from "../shared/documentExpiry";

export async function runDocumentExpiryAlertScan(now = new Date()) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable for document expiry scan");
  const [documents, employeeRows, recipientRows] = await Promise.all([
    db.select().from(complianceDocuments),
    db.select({ id: employees.id, fullName: employees.fullName, employeeCode: employees.employeeCode }).from(employees),
    db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users),
  ]);
  const employeesById = new Map(employeeRows.map((employee) => [employee.id, employee]));
  const recipients = recipientRows.filter((user) => user.role === "admin" || user.role === "general_manager");
  let alerted = 0;
  let emailsSent = 0;
  let skipped = 0;

  for (const document of documents.filter((row) => row.status === "active")) {
    const alertKey = documentAlertKey(document.expiryDate, document.reminderDays, now);
    if (!alertKey || alertKey === document.lastAlertKey) { skipped += 1; continue; }
    const remainingDays = daysUntilExpiry(document.expiryDate, now);
    const stage = documentExpiryStage(document.expiryDate, document.reminderDays, now);
    const owner = document.employeeId ? employeesById.get(document.employeeId) : null;
    const subject = `${stage === "expired" ? "تنبيه وثيقة منتهية" : "تنبيه قرب انتهاء وثيقة"} — ${document.title}`;
    const message = `${document.documentScope === "employee" ? `وثيقة الموظف ${owner?.fullName || "غير محدد"}` : "وثيقة الشركة"}: ${document.documentType}. ${documentExpiryLabel(stage, remainingDays)}. تاريخ الانتهاء: ${String(document.expiryDate).slice(0, 10)}.`;
    for (const recipient of recipients) {
      await db.insert(notifications).values({ userId: recipient.id, type: "document_expiry", title: subject, message });
      if (recipient.email) {
        try {
          await sendApprovalEmail({ to: recipient.email, recipientName: recipient.name, title: subject, message, approvalUrl: `${getAppUrl()}/compliance-documents` });
          emailsSent += 1;
        } catch (error) {
          console.warn("[DocumentExpiry] email delivery failed", { documentId: document.id, recipientId: recipient.id, error: error instanceof Error ? error.message : "unknown" });
        }
      }
    }
    if (recipients.length) {
      await db.update(complianceDocuments).set({ lastAlertKey: alertKey, lastAlertAt: now }).where(eq(complianceDocuments.id, document.id));
      alerted += 1;
    }
  }
  return { scanned: documents.length, alerted, emailsSent, skipped };
}
