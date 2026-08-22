import { and, eq } from "drizzle-orm";
import { approvalRequests, payroll, users } from "../drizzle/schema";
import { getDb } from "../server/db";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

const QA_PROJECT_ID = 120001;
const QA_TAG = "[QA-MANUAL-WORKER-PAYROLL-20260822]";
type AppUser = NonNullable<TrpcContext["user"]>;
const context = (user: AppUser): TrpcContext => ({ user, req: { protocol: "https", headers: {}, cookies: { active_company_id: "1" } } as TrpcContext["req"], res: { cookie: () => undefined } as TrpcContext["res"] });

async function main() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const [mostafa, owner, generalManager] = await Promise.all([
    db.select().from(users).where(eq(users.id, 13170001)).limit(1),
    db.select().from(users).where(eq(users.id, 1)).limit(1),
    db.select().from(users).where(eq(users.email, "qa.general.manager@example.invalid")).limit(1),
  ]);
  if (!mostafa[0] || !owner[0] || !generalManager[0]) throw new Error("حسابات اختبار دورة الراتب غير مكتملة");
  const mostafaCaller = appRouter.createCaller(context(mostafa[0] as AppUser));
  const ownerCaller = appRouter.createCaller(context(owner[0] as AppUser));
  const generalManagerCaller = appRouter.createCaller(context(generalManager[0] as AppUser));
  const created = await mostafaCaller.erp.payroll.create({ projectId: QA_PROJECT_ID, employeeName: `${QA_TAG} أجير`, employeeCode: "QA-W-001", month: 8, year: 2026, classification: "project", allocationRatio: 100, amount: 900, paidAmount: 0, absenceDays: 1, deductionAmount: 30 });
  const ownerApproval = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "payroll"), eq(approvalRequests.entityId, created.id), eq(approvalRequests.status, "pending"))).limit(1))[0];
  if (!ownerApproval || ownerApproval.approvalStage !== "owner") throw new Error("راتب الأجير اليدوي لم يصل إلى المالك");
  await ownerCaller.erp.approvals.decide({ id: ownerApproval.id, decision: "approved", note: QA_TAG });
  const generalManagerApproval = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "payroll"), eq(approvalRequests.entityId, created.id), eq(approvalRequests.status, "pending"))).limit(1))[0];
  if (!generalManagerApproval || generalManagerApproval.approvalStage !== "general_manager") throw new Error("راتب الأجير اليدوي لم ينتقل إلى المدير العام");
  await generalManagerCaller.erp.approvals.decide({ id: generalManagerApproval.id, decision: "approved", note: QA_TAG });
  const result = (await db.select().from(payroll).where(eq(payroll.id, created.id)).limit(1))[0];
  if (!result || result.employeeId !== null || result.status !== "approved" || Number(result.totalAmount) !== 870) throw new Error(`نتيجة راتب الأجير غير صحيحة: ${JSON.stringify(result)}`);
  console.log(JSON.stringify({ passed: true, payrollId: result.id, employeeName: result.employeeName, totalAmount: result.totalAmount, status: result.status }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
