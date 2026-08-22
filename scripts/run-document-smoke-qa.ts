import { eq } from "drizzle-orm";
import { accountingDocuments, certificates, contractorContracts, materialRequisitions, projects, users } from "../drizzle/schema";
import { getDb } from "../server/db";
import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

const QA_TAG = "[QA-DOCUMENTS-20260822]";
const PROJECT_ID = 120001;

type AppUser = NonNullable<TrpcContext["user"]>;
function context(user: AppUser): TrpcContext {
  return { user, req: { protocol: "https", headers: {}, cookies: { active_company_id: "1" } } as TrpcContext["req"], res: { cookie: () => undefined } as TrpcContext["res"] };
}

async function main() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const owner = (await db.select().from(users).where(eq(users.id, 1)).limit(1))[0] as AppUser;
  const worker = (await db.select().from(users).where(eq(users.email, "qa.site.worker@example.invalid")).limit(1))[0] as AppUser;
  const generalManager = (await db.select().from(users).where(eq(users.email, "qa.general.manager@example.invalid")).limit(1))[0] as AppUser;
  const mostafa = (await db.select().from(users).where(eq(users.id, 13170001)).limit(1))[0] as AppUser;
  const projectManager = (await db.select().from(users).where(eq(users.email, "qa.project.manager@example.invalid")).limit(1))[0] as AppUser;
  const vendor = (await db.select().from((await import("../drizzle/schema")).vendors).where(eq((await import("../drizzle/schema")).vendors.name, "[QA-APPROVAL-20260822] مورد اختبار")).limit(1))[0];
  if (!owner || !worker || !generalManager || !vendor) throw new Error("بيئة الاختبار غير مكتملة");
  const ownerCaller = appRouter.createCaller(context(owner));
  const workerCaller = appRouter.createCaller(context(worker));
  const generalManagerCaller = appRouter.createCaller(context(generalManager));
  const mostafaCaller = appRouter.createCaller(context(mostafa));
  const projectManagerCaller = appRouter.createCaller(context(projectManager));
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  const checks: Record<string, unknown> = {};

  const stage = await ownerCaller.erp.stages.create({ projectId: PROJECT_ID, code: `QA-${stamp}`, name: `${QA_TAG} مرحلة`, plannedBudget: 50000, plannedStart: "2026-08-22", plannedEnd: "2026-09-30" });
  checks.stage = stage.id;
  const contract = await ownerCaller.erp.contractorContracts.create({ projectId: PROJECT_ID, stageId: stage.id, vendorId: vendor.id, contractNumber: `QA-CON-${stamp}`, description: `${QA_TAG} عقد مرحلة بناء`, contractType: "building_stage", contractItems: [], preTaxAmount: 10000, taxRate: 15, contractDate: "2026-08-22" });
  checks.contract = contract;
  const certificate = await ownerCaller.erp.certificates.create({ projectId: PROJECT_ID, stageId: stage.id, contractId: contract.id, vendorId: vendor.id, certificateNumber: `QA-CERT-${stamp}`, description: `${QA_TAG} مستخلص بقيمة فعلية`, certificateItems: [], preTaxAmount: 1000, taxRate: 15, paidAmount: 0, certificateDate: "2026-08-22" });
  const certificateRow = (await db.select().from(certificates).where(eq(certificates.id, certificate.id)).limit(1))[0];
  if (Number(certificateRow?.totalAmount || 0) !== 1150 || certificateRow?.companyId !== 1) throw new Error(`فشل حفظ قيمة أو شركة المستخلص: ${JSON.stringify(certificateRow)}`);
  checks.certificate = { id: certificate.id, total: certificateRow.totalAmount, companyId: certificateRow.companyId };

  const unit = await ownerCaller.erp.units.create({ projectId: PROJECT_ID, code: `QA-U-${stamp}`, name: `${QA_TAG} وحدة`, type: "وحدة اختبار", listPrice: 10000 });
  const sale = await ownerCaller.erp.sales.create({ projectId: PROJECT_ID, stageId: stage.id, unitId: unit.id, customerName: `${QA_TAG} عميل`, customerPhone: "0500000000", saleDate: "2026-08-22", preTaxAmount: 1000, taxRate: 15 });
  const collection = await ownerCaller.erp.collections.create({ projectId: PROJECT_ID, saleId: sale.id, amount: 500, collectionDestination: "cash", cashAccountId: 2, receiptReference: `QA-RC-${stamp}`, collectionDate: "2026-08-22" });
  checks.salesAndCollection = { saleId: sale.id, collectionId: collection.id };

  const requisition = await workerCaller.erp.procurement.requisitions.create({ projectId: PROJECT_ID, stageId: stage.id, description: `${QA_TAG} طلب شراء`, requiredBy: "2026-08-30", items: [{ description: "خامة اختبار", unit: "قطعة", quantity: 2, estimatedUnitCost: 100 }] });
  const reqRows = await ownerCaller.erp.procurement.requisitions.list({ projectId: PROJECT_ID });
  const req = reqRows.find((row) => row.id === requisition.id);
  if (!req) throw new Error("طلب المواد التجريبي لم يظهر في القائمة");
  await mostafaCaller.erp.procurement.requisitions.decide({ id: requisition.id, decision: "approved", note: QA_TAG });
  await ownerCaller.erp.procurement.requisitions.decide({ id: requisition.id, decision: "approved", note: QA_TAG });
  await projectManagerCaller.erp.procurement.requisitions.decide({ id: requisition.id, decision: "approved", note: QA_TAG });
  await generalManagerCaller.erp.procurement.requisitions.decide({ id: requisition.id, decision: "approved", note: QA_TAG });
  const purchaseOrder = await ownerCaller.erp.procurement.purchaseOrders.create({ requisitionId: requisition.id, vendorId: vendor.id, orderDate: "2026-08-22", expectedDate: "2026-08-30", items: [{ description: "خامة اختبار", unit: "قطعة", quantity: 2, unitCost: 100 }] });
  await ownerCaller.erp.procurement.purchaseOrders.decide({ id: purchaseOrder.id, decision: "approved", note: QA_TAG });
  const purchaseOrderRows = await ownerCaller.erp.procurement.purchaseOrders.list({ projectId: PROJECT_ID });
  const purchaseOrderRow = purchaseOrderRows.find((row) => row.id === purchaseOrder.id);
  if (!purchaseOrderRow?.items?.[0]) throw new Error("بند أمر الشراء التجريبي لم يظهر");
  const receipt = await ownerCaller.erp.procurement.purchaseOrders.receive({ purchaseOrderId: purchaseOrder.id, receivedDate: "2026-08-22", notes: QA_TAG, items: [{ purchaseOrderItemId: purchaseOrderRow.items[0].id, quantity: 2 }] });
  const receivedOrder = (await ownerCaller.erp.procurement.purchaseOrders.list({ projectId: PROJECT_ID })).find((row) => row.id === purchaseOrder.id);
  if (receivedOrder?.status !== "received") throw new Error(`حالة الاستلام الكامل غير صحيحة: ${receivedOrder?.status}`);
  checks.requisition = { id: requisition.id, purchaseOrderId: purchaseOrder.id, receiptId: receipt.id, status: receivedOrder.status };

  const accounting = ownerCaller.erp.accounting.documents;
  const salesInvoice = await accounting.create({ projectId: PROJECT_ID, documentType: "sales_invoice", partyName: `${QA_TAG} عميل فاتورة`, partyTaxNumber: "300000000000003", documentDate: "2026-08-22", amount: 1000, taxAmount: 150, totalAmount: 1150, status: "posted", lines: [{ accountId: 12, projectId: PROJECT_ID, description: `${QA_TAG} إيراد`, debit: 0, credit: 1000 }] });
  const receiptVoucher = await accounting.settleSales({ salesInvoiceId: salesInvoice.id, cashAccountId: 2, amount: 500, paymentDate: "2026-08-22", notes: QA_TAG });
  const creditNote = await accounting.create({ projectId: PROJECT_ID, documentType: "credit_note", originalDocumentId: salesInvoice.id, returnType: "partial", partyName: `${QA_TAG} عميل فاتورة`, documentDate: "2026-08-22", amount: 100, taxAmount: 15, totalAmount: 115, status: "posted", lines: [{ accountId: 12, projectId: PROJECT_ID, description: `${QA_TAG} إشعار دائن`, debit: 115, credit: 0 }] });
  const purchaseInvoice = await accounting.create({ projectId: PROJECT_ID, documentType: "purchase_invoice", partyName: vendor.name, documentDate: "2026-08-22", amount: 200, taxAmount: 0, totalAmount: 200, status: "posted", lines: [{ accountId: 15, projectId: PROJECT_ID, description: `${QA_TAG} تكلفة خامات`, debit: 200, credit: 0 }, { accountId: 8, projectId: PROJECT_ID, description: `${QA_TAG} مورد`, debit: 0, credit: 200 }] });
  const purchasePayment = await accounting.settlePurchase({ purchaseInvoiceId: purchaseInvoice.id, cashAccountId: 2, amount: 100, paymentDate: "2026-08-22", notes: QA_TAG });
  const paymentVoucher = await accounting.create({ projectId: PROJECT_ID, documentType: "payment_voucher", voucherCategory: "operating", partyName: `${QA_TAG} مستفيد`, sourceAccountId: 30002, paymentMethod: "cash", documentDate: "2026-08-22", amount: 100, taxAmount: 0, totalAmount: 100, status: "posted", lines: [{ accountId: 14, projectId: PROJECT_ID, description: `${QA_TAG} مصروف`, debit: 100, credit: 0 }, { accountId: 30002, projectId: PROJECT_ID, description: `${QA_TAG} خزينة`, debit: 0, credit: 100 }] });
  const journalEntry = await accounting.create({ projectId: PROJECT_ID, documentType: "journal_entry", documentDate: "2026-08-22", amount: 50, taxAmount: 0, totalAmount: 50, status: "posted", notes: QA_TAG, lines: [{ accountId: 14, projectId: PROJECT_ID, description: `${QA_TAG} قيد`, debit: 50, credit: 0 }, { accountId: 30002, projectId: PROJECT_ID, description: `${QA_TAG} قيد مقابل`, debit: 0, credit: 50 }] });
  const quotation = await accounting.create({ projectId: PROJECT_ID, documentType: "quotation", partyName: `${QA_TAG} عميل عرض`, documentDate: "2026-08-22", amount: 300, taxAmount: 45, totalAmount: 345, status: "draft", lines: [{ accountId: 6, projectId: PROJECT_ID, description: `${QA_TAG} عميل عرض`, debit: 300, credit: 0 }, { accountId: 12, projectId: PROJECT_ID, description: `${QA_TAG} عرض سعر`, debit: 0, credit: 300 }] });
  checks.accounting = { salesInvoice: salesInvoice.id, receiptVoucher: receiptVoucher.paymentId, creditNote: creditNote.id, purchaseInvoice: purchaseInvoice.id, purchasePayment: purchasePayment.paymentId, paymentVoucher: paymentVoucher.id, journalEntry: journalEntry.id, quotation: quotation.id };

  const expense = await ownerCaller.erp.expenses.create({ projectId: PROJECT_ID, stageId: stage.id, vendorId: vendor.id, description: `${QA_TAG} مصروف تشغيلي`, unit: "خدمة", quantity: 1, expenseType: "operating", classification: "project", allocationRatio: 1, preTaxAmount: 150, taxRate: 15, paidAmount: 0, expenseDate: "2026-08-22" });
  const leave = await workerCaller.erp.leaveRequests.create({ leaveType: "annual", startDate: "2026-09-01", endDate: "2026-09-02", reason: `${QA_TAG} اختبار طلب إجازة` });
  await generalManagerCaller.erp.leaveRequests.decide({ id: leave.id, decision: "approved" });
  const advance = await workerCaller.erp.advanceRequests.create({ amount: 300, reason: `${QA_TAG} اختبار طلب سلفة`, repaymentDate: "2026-10-01" });
  await generalManagerCaller.erp.advanceRequests.decide({ id: advance.id, decision: "approved" });
  checks.requests = { expense: expense.id, leave: leave.id, advance: advance.id };

  const savedDocuments = await db.select().from(accountingDocuments).where(eq(accountingDocuments.companyId, 1));
  const expectedDocumentIds = [salesInvoice.id, creditNote.id, purchaseInvoice.id, paymentVoucher.id, journalEntry.id, quotation.id];
  if (!expectedDocumentIds.every((id) => savedDocuments.some((document) => document.id === id))) throw new Error("بعض المستندات المحاسبية التجريبية لم تُحفظ");
  const savedContract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, contract.id)).limit(1))[0];
  if (savedContract?.companyId !== 1) throw new Error("العقد التجريبي لم يُربط بالشركة");
  console.log(JSON.stringify({ qaTag: QA_TAG, passed: true, checks }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
