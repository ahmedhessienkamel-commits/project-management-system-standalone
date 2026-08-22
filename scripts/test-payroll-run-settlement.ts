import { and, eq } from "drizzle-orm";
import { accountingDocumentLines, accountingDocuments, approvalRequests, auditLogs, cashAccounts, payroll, payrollRuns, payrollSettlements, users } from "../drizzle/schema";
import { getDb } from "../server/db";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

const QA_TAG = "[QA-PAYROLL-RUN-20260822]";
type AppUser = NonNullable<TrpcContext["user"]>;
const context = (user: AppUser): TrpcContext => ({ user, req: { protocol: "https", headers: {}, cookies: { active_company_id: "1" } } as TrpcContext["req"], res: { cookie: () => undefined } as TrpcContext["res"] });

async function main() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const [mostafaRows, ownerRows, managerRows, cashRows] = await Promise.all([
    db.select().from(users).where(eq(users.id, 13170001)).limit(1),
    db.select().from(users).where(eq(users.id, 1)).limit(1),
    db.select().from(users).where(eq(users.email, "qa.general.manager@example.invalid")).limit(1),
    db.select().from(cashAccounts).where(eq(cashAccounts.companyId, 1)).limit(1),
  ]);
  const mostafa = mostafaRows[0]; const owner = ownerRows[0]; const manager = managerRows[0]; const cash = cashRows.find((item) => item.accountId && item.isActive === 1);
  if (!mostafa || !owner || !manager || !cash?.accountId) throw new Error("بيانات اختبار مسير الرواتب أو البنك غير مكتملة");
  const mostafaCaller = appRouter.createCaller(context(mostafa as AppUser));
  const ownerCaller = appRouter.createCaller(context(owner as AppUser));
  const managerCaller = appRouter.createCaller(context(manager as AppUser));
  let runId: number | undefined;
  let documentIds: number[] = [];
  try {
    const draft = await mostafaCaller.erp.payroll.runs.createDraft({ month: 8, year: 2026, rows: [{ employeeName: `${QA_TAG} موظف إداري`, employeeCode: "QA-PR-001", classification: "administrative", allocationRatio: 100, amount: 1200, absenceDays: 1, deductionAmount: 40 }] });
    runId = draft.id;
    await mostafaCaller.erp.payroll.runs.addManual({ payrollRunId: runId, month: 8, year: 2026, employeeName: `${QA_TAG} أجير`, employeeCode: "QA-PR-002", classification: "administrative", allocationRatio: 100, amount: 800, absenceDays: 0, deductionAmount: 0 });
    await mostafaCaller.erp.payroll.runs.submit({ id: runId });
    const ownerApproval = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "payroll_run"), eq(approvalRequests.entityId, runId), eq(approvalRequests.status, "pending"))).limit(1))[0];
    if (!ownerApproval || ownerApproval.approvalStage !== "owner") throw new Error("لم يصل المسير المجمع إلى المالك");
    await ownerCaller.erp.approvals.decide({ id: ownerApproval.id, decision: "approved", note: QA_TAG });
    const managerApproval = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "payroll_run"), eq(approvalRequests.entityId, runId), eq(approvalRequests.status, "pending"))).limit(1))[0];
    if (!managerApproval || managerApproval.approvalStage !== "general_manager") throw new Error("لم ينتقل المسير المجمع إلى المدير العام");
    await managerCaller.erp.approvals.decide({ id: managerApproval.id, decision: "approved", note: QA_TAG });
    const approvedRun = (await db.select().from(payrollRuns).where(eq(payrollRuns.id, runId)).limit(1))[0];
    if (!approvedRun?.accrualDocumentId || approvedRun.status !== "approved" || Number(approvedRun.totalAmount) !== 1960) throw new Error(`قيد الاستحقاق لم ينشأ بصورة صحيحة: ${JSON.stringify(approvedRun)}`);
    documentIds.push(approvedRun.accrualDocumentId);
    const outstanding = await ownerCaller.erp.payroll.runs.outstanding();
    const expectedRun = outstanding.find((item) => item.id === runId);
    if (!expectedRun || expectedRun.rows.length !== 2) throw new Error("المسير المعتمد لم يظهر في قائمة الرواتب المستحقة");
    const settlement = await ownerCaller.erp.payroll.runs.settle({ payrollRunId: runId, cashAccountId: cash.id, paymentDate: "2026-08-22", notes: QA_TAG });
    documentIds.push(settlement.documentId);
    const paidRun = (await db.select().from(payrollRuns).where(eq(payrollRuns.id, runId)).limit(1))[0];
    const paidRows = await db.select().from(payroll).where(eq(payroll.payrollRunId, runId));
    if (paidRun?.status !== "paid" || paidRows.some((row) => row.status !== "paid" || Number(row.paidAmount) !== Number(row.totalAmount))) throw new Error("لم تُغلق تسوية الرواتب بصورة صحيحة");
    console.log(JSON.stringify({ passed: true, runId, accrualDocumentId: approvedRun.accrualDocumentId, settlementDocumentId: settlement.documentId, total: paidRun.totalAmount, status: paidRun.status }, null, 2));
  } finally {
    if (runId) {
      const settlementRows = await db.select().from(payrollSettlements).where(eq(payrollSettlements.payrollRunId, runId));
      documentIds = [...new Set([...documentIds, ...settlementRows.map((row) => row.accountingDocumentId)])];
      for (const documentId of documentIds) await db.delete(accountingDocumentLines).where(eq(accountingDocumentLines.documentId, documentId));
      for (const documentId of documentIds) await db.delete(accountingDocuments).where(eq(accountingDocuments.id, documentId));
      await db.delete(payrollSettlements).where(eq(payrollSettlements.payrollRunId, runId));
      await db.delete(approvalRequests).where(and(eq(approvalRequests.entityType, "payroll_run"), eq(approvalRequests.entityId, runId)));
      await db.delete(auditLogs).where(and(eq(auditLogs.entityType, "payroll_run"), eq(auditLogs.entityId, runId)));
      await db.delete(payroll).where(eq(payroll.payrollRunId, runId));
      await db.delete(payrollRuns).where(eq(payrollRuns.id, runId));
    }
  }
}

main().then(() => process.exit(0)).catch((error) => { console.error(error); process.exit(1); });
