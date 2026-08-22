import { and, eq } from "drizzle-orm";
import { approvalRequests, certificates, materialRequisitions, payroll, users, vendors } from "../drizzle/schema";
import { getDb } from "../server/db";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

const QA_TAG = "[QA-APPROVAL-20260822]";
const PROJECT_ID = 120001;
const MOSTAFA_ID = 13170001;

type UserRow = { id: number; openId: string; name: string | null; email: string | null; loginMethod: string | null; role: "user" | "admin" | "general_manager" | "project_manager" | "procurement_manager" | "site_worker"; jobTitle: string | null; defaultProjectId: number | null; createdAt: Date; updatedAt: Date; lastSignedIn: Date; passwordHash: string | null };

function context(user: UserRow): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {}, cookies: { active_company_id: "1" } } as TrpcContext["req"],
    res: { cookie: () => undefined } as TrpcContext["res"],
  };
}

async function main() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");

  const lookup = async (email: string) => {
    const row = (await db.select().from(users).where(eq(users.email, email)).limit(1))[0];
    if (!row) throw new Error(`حساب الاختبار غير موجود: ${email}`);
    return row as UserRow;
  };
  const [owner, mostafa, generalManager, projectManager, siteWorker, vendor] = await Promise.all([
    db.select().from(users).where(eq(users.id, 1)).limit(1).then((rows) => rows[0] as UserRow),
    db.select().from(users).where(eq(users.id, MOSTAFA_ID)).limit(1).then((rows) => rows[0] as UserRow),
    lookup("qa.general.manager@example.invalid"),
    lookup("qa.project.manager@example.invalid"),
    lookup("qa.site.worker@example.invalid"),
    db.select().from(vendors).where(eq(vendors.name, `${QA_TAG} مورد اختبار`)).limit(1).then((rows) => rows[0]),
  ]);
  if (!owner || !mostafa || !vendor) throw new Error("الحسابات الأساسية أو مورد الاختبار غير موجود");

  const ownerCaller = appRouter.createCaller(context(owner));
  const mostafaCaller = appRouter.createCaller(context(mostafa));
  const generalManagerCaller = appRouter.createCaller(context(generalManager));
  const projectManagerCaller = appRouter.createCaller(context(projectManager));
  const siteWorkerCaller = appRouter.createCaller(context(siteWorker));
  const runId = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

  const findPending = async (entityType: string, entityId: number) => {
    const row = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, entityType), eq(approvalRequests.entityId, entityId), eq(approvalRequests.status, "pending"))).limit(1))[0];
    if (!row) throw new Error(`لا توجد مرحلة معلقة لـ ${entityType} #${entityId}`);
    return row;
  };

  const material = await siteWorkerCaller.erp.procurement.requisitions.create({
    projectId: PROJECT_ID,
    description: `${QA_TAG} طلب مواد دورة كاملة ${runId}`,
    requiredBy: "2026-08-30",
    items: [{ description: "خرسانة اختبار", unit: "م3", quantity: 5, estimatedUnitCost: 250, notes: QA_TAG }],
  });
  const materialStages: string[] = [];
  let pending = await findPending("materialRequisition", material.id);
  materialStages.push(pending.approvalStage || "");
  await mostafaCaller.erp.procurement.requisitions.decide({ id: material.id, decision: "approved", note: `${QA_TAG} اعتماد مصطفى` });
  pending = await findPending("materialRequisition", material.id);
  materialStages.push(pending.approvalStage || "");
  await ownerCaller.erp.procurement.requisitions.decide({ id: material.id, decision: "approved", note: `${QA_TAG} اعتماد المالك` });
  pending = await findPending("materialRequisition", material.id);
  materialStages.push(pending.approvalStage || "");
  await projectManagerCaller.erp.procurement.requisitions.decide({ id: material.id, decision: "approved", note: `${QA_TAG} اعتماد مدير المشاريع` });
  pending = await findPending("materialRequisition", material.id);
  materialStages.push(pending.approvalStage || "");
  await generalManagerCaller.erp.procurement.requisitions.decide({ id: material.id, decision: "approved", note: `${QA_TAG} اعتماد المدير العام` });
  const materialRow = (await db.select().from(materialRequisitions).where(eq(materialRequisitions.id, material.id)).limit(1))[0];

  const payrollEntry = await mostafaCaller.erp.payroll.create({
    projectId: PROJECT_ID,
    employeeName: `${QA_TAG} راتب اختبار`,
    employeeCode: `QA-${runId}`,
    month: 8,
    year: 2026,
    classification: "project",
    amount: 1250,
    paidAmount: 0,
    absenceDays: 0,
    deductionAmount: 0,
    allocationRatio: 100,
  });
  const payrollStages: string[] = [];
  pending = await findPending("payroll", payrollEntry.id);
  payrollStages.push(pending.approvalStage || "");
  await ownerCaller.erp.approvals.decide({ id: pending.id, decision: "approved", note: `${QA_TAG} اعتماد مالك الرواتب` });
  pending = await findPending("payroll", payrollEntry.id);
  payrollStages.push(pending.approvalStage || "");
  await generalManagerCaller.erp.approvals.decide({ id: pending.id, decision: "approved", note: `${QA_TAG} اعتماد نهائي للرواتب` });
  const payrollRow = (await db.select().from(payroll).where(eq(payroll.id, payrollEntry.id)).limit(1))[0];

  const certificate = await mostafaCaller.erp.certificates.create({
    projectId: PROJECT_ID,
    vendorId: vendor.id,
    certificateNumber: `QA-CERT-${runId}`,
    description: `${QA_TAG} مستخلص دورة كاملة`,
    technicalSpecifications: "اختبار انتقال اعتماد المستخلص دون أثر تشغيلي",
    certificateItems: [],
    preTaxAmount: 2000,
    taxRate: 15,
    paidAmount: 0,
    certificateDate: "2026-08-22",
  });
  const certificateStages: string[] = [];
  pending = await findPending("certificate", certificate.id);
  certificateStages.push(pending.approvalStage || "");
  await ownerCaller.erp.approvals.decide({ id: pending.id, decision: "approved", note: `${QA_TAG} اعتماد مالك المستخلص` });
  pending = await findPending("certificate", certificate.id);
  certificateStages.push(pending.approvalStage || "");
  await projectManagerCaller.erp.approvals.decide({ id: pending.id, decision: "approved", note: `${QA_TAG} اعتماد مدير المشاريع للمستخلص` });
  pending = await findPending("certificate", certificate.id);
  certificateStages.push(pending.approvalStage || "");
  await generalManagerCaller.erp.approvals.decide({ id: pending.id, decision: "approved", note: `${QA_TAG} اعتماد المدير العام للمستخلص` });
  const certificateRow = (await db.select().from(certificates).where(eq(certificates.id, certificate.id)).limit(1))[0];

  const result = {
    qaTag: QA_TAG,
    material: { id: material.id, stages: materialStages, finalStatus: materialRow?.status },
    payroll: { id: payrollEntry.id, stages: payrollStages, finalStatus: payrollRow?.status },
    certificate: { id: certificate.id, stages: certificateStages, finalStatus: certificateRow?.status, totalAmount: certificateRow?.totalAmount },
  };
  const expected = {
    material: ["mostafa", "owner", "project_manager", "general_manager"],
    payroll: ["owner", "general_manager"],
    certificate: ["owner", "project_manager", "general_manager"],
  };
  if (JSON.stringify(result.material.stages) !== JSON.stringify(expected.material) || result.material.finalStatus !== "approved") throw new Error(`فشل مسار المواد: ${JSON.stringify(result.material)}`);
  if (JSON.stringify(result.payroll.stages) !== JSON.stringify(expected.payroll) || result.payroll.finalStatus !== "approved") throw new Error(`فشل مسار الرواتب: ${JSON.stringify(result.payroll)}`);
  if (JSON.stringify(result.certificate.stages) !== JSON.stringify(expected.certificate) || result.certificate.finalStatus !== "approved") throw new Error(`فشل مسار المستخلص: ${JSON.stringify(result.certificate)}`);
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
