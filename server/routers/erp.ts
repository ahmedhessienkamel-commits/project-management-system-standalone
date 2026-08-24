import { and, desc, eq, inArray, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { approvalPolicies, approvalRequests, auditLogs, attendance, attachments, certificates, collections, custody, custodyMovements, dailyTasks, leaveRequests, advanceRequests, advanceRepayments, employees, employeeWorkStarts, expenses, notifications, complianceDocuments, payroll, payrollRuns, payrollSettlements, administrativePayroll, payrollAllocations, periodLocks, projectMembers, projects, projectBudgets, projectBudgetLines, sales, stages, units, users, userInvitations, vendors, materialRequisitions, materialRequisitionItems, purchaseOrders, purchaseOrderItems, purchaseReceipts, purchaseReceiptItems, inventoryItems, inventoryMovements, accounts, accountingDocuments, accountingDocumentLines, costItems, fixedAssets, fixedAssetDepreciation, companies, companyMembers, companyProfiles, cashAccounts, contractorContracts, estimates, estimateLines, serviceContractEntries, userOperationPermissions, projectWorkLocations } from "../../drizzle/schema";
import { getDb } from "../db";
import { calculateEstimateLine } from "../../shared/estimateMath";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { distanceMetersBetween } from "../../shared/geo";
import { getSessionCookieOptions } from "../_core/cookies";
import { calculateCertificateProgress, calculateDocumentCompleteness, calculateExpenseTotals, calculateFinancialSummaryTotals, calculatePayrollTotals, calculatePayrollTotalsWithDeduction, calculatePurchaseInvoiceStatus, calculateStraightLineDepreciation, calculateParentBudgetMetrics, allocateAdministrativeAmount, canAccessProject, canWriteProject, projectHealthReasons, projectHealthStatus, projectNotificationTriggers } from "../erpCalculations";
import { accountingTotals } from "../accountingCalculations";
import { calculateStageTimeVariance } from "../../shared/stageTiming";
import { allocateAdministrativeExpense, normalizeExpenseTaxRate, validateExpenseAllocation } from "../../shared/expenseAllocation";
import { calculateInventoryBalance, canReceiveContractQuantity, canReviewInventoryStage, nextInventoryApprovalStage, remainingContractQuantity, selectPurchaseInvoiceForIssue, calculateServiceEntryTotal, remainingServiceContractAmount, calculateMaterialReceiptCost, materialReceiptExpenseReference, materialIssueExpenseReference, isMaterialContractType, isInventoryBelowMinimum, resolveMaterialCostAccount, requiresSupplierInvoicePaymentApproval } from "../../shared/inventory";
import { canReviewCertificateApproval, getApprovalWorkflowStages, getCertificateInitialApproval, nextCertificateApproval, nextMaterialRequisitionApproval } from "../../shared/approvalWorkflows";
import { payrollRunPaymentStatus } from "../../shared/payrollRun";
import { advanceOutstandingAmount, buildAdvanceSchedule, calculateAdvanceDeduction, calculatePayrollAdvanceAccrualAmounts, isRepaymentDue } from "../../shared/advanceRepayment";
import { calculateWipBalance, buildWipClosingLines } from "../../shared/wip";
import { canAssignTeamTasks } from "../../shared/taskPermissions";
import { calculateMaterialPlanning } from "../../shared/materialPlanning";
import { sendApprovalEmail, sendInvitationEmail, sendTaskReminderEmail } from "../email";
import { buildExecutiveSnapshot } from "../executiveDigest";
import { getAppUrl } from "../appUrl";
import { documentExpiryLabel, documentExpiryStage, daysUntilExpiry } from "../../shared/documentExpiry";

const projectStatus = z.enum(["planning", "active", "paused", "completed", "archived"]);
const operationKey = z.enum(["payment_voucher", "receipt_voucher", "expense", "certificate", "payroll", "custody", "purchase_invoice", "sales_invoice", "purchase_request", "inventory_item", "inventory_receipt", "inventory_issue", "task_assignment", "edit", "delete", "approve"]);
const operationCatalog = [
  { key: "payment_voucher", label: "سند صرف" }, { key: "receipt_voucher", label: "سند قبض" }, { key: "expense", label: "المصروفات" },
  { key: "certificate", label: "المستخلصات" }, { key: "payroll", label: "الرواتب" }, { key: "custody", label: "العهد" },
  { key: "purchase_invoice", label: "فاتورة شراء" }, { key: "sales_invoice", label: "فاتورة بيع" }, { key: "purchase_request", label: "طلب شراء" },
  { key: "inventory_item", label: "بطاقات الخامات" }, { key: "inventory_receipt", label: "استلام خامات" }, { key: "inventory_issue", label: "سحب خامات" }, { key: "task_assignment", label: "إسناد مهام الفريق" },
  { key: "edit", label: "التعديل" }, { key: "delete", label: "الحذف" }, { key: "approve", label: "الاعتماد" },
] as const;
const projectClassification = z.enum(["operational", "administrative"]);
const projectType = z.enum(["real_estate_developer", "real_estate_development", "off_plan_sales", "main_contractor", "subcontractor", "general"]);
const employeeProfileSchema = z.object({
  employeeCode: z.string().trim().min(1).max(64), employmentType: z.enum(["employee", "worker"]).default("employee"), fullName: z.string().trim().min(1).max(255), jobTitle: z.string().max(255).optional(), department: z.string().max(255).optional(), managerName: z.string().max(255).optional(), managerUserId: z.number().int().positive().nullable().optional(), generalManagerUserId: z.number().int().positive().nullable().optional(), phone: z.string().max(64).optional(), email: z.string().email().optional().or(z.literal("")), nationalId: z.string().max(64).optional(), nationality: z.string().max(128).optional(), birthDate: z.string().optional(), hireDate: z.string().optional(), workLocation: z.string().max(255).optional(), address: z.string().max(2000).optional(), nationalAddress: z.string().max(2000).optional(), bankName: z.string().max(255).optional(), iban: z.string().max(128).optional(), insuranceNumber: z.string().max(128).optional(), basicSalary: z.number().nonnegative().default(0), housingAllowance: z.number().nonnegative().default(0), transportAllowance: z.number().nonnegative().default(0), otherAllowances: z.number().nonnegative().default(0), standardDeduction: z.number().nonnegative().default(0), notes: z.string().max(4000).optional(), defaultProjectId: z.number().int().positive().nullable().optional(),
});
const materialRequisitionLineSchema = z.object({ inventoryItemId: z.number().int().positive().optional(), costItemId: z.number().int().positive().optional(), description: z.string().min(1).max(255), unit: z.string().max(64).optional(), quantity: z.number().positive(), estimatedUnitCost: z.number().nonnegative(), notes: z.string().max(500).optional() });

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "قاعدة البيانات غير متاحة حاليًا" });
  return db;
}

type UserRole = "user" | "admin" | "general_manager" | "project_manager" | "procurement_manager" | "site_worker";
async function notifyTaskAssignee(db: ErpDb, input: { employeeId?: number | null; title: string; message: string; taskId: number }) {
  if (!input.employeeId) return;
  const employee = (await db.select({ email: employees.email, fullName: employees.fullName }).from(employees).where(eq(employees.id, input.employeeId)).limit(1))[0];
  if (!employee?.email) return;
  try {
    await sendApprovalEmail({ to: employee.email, recipientName: employee.fullName, title: input.title, message: input.message, approvalUrl: `${getAppUrl()}/tasks` });
  } catch (error) {
    console.warn("[TaskEmail] delivery failed", { taskId: input.taskId, error: error instanceof Error ? error.message : "unknown" });
  }
}

async function notifyApprovalUsers(db: ErpDb, input: { type: string; title: string; message: string; approvalUrl?: string; roles?: UserRole[]; userIds?: number[] }) {
  const roles: UserRole[] = input.roles ?? ["admin", "general_manager"];
  const recipients = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users);
  const selectedRecipients = recipients.filter((recipient) => (input.userIds || []).includes(recipient.id) || roles.includes(recipient.role as UserRole));
  const approvalUrl = input.approvalUrl || `${getAppUrl()}/approvals`;
  await Promise.all(selectedRecipients.map(async (recipient) => {
    await db.insert(notifications).values({ userId: recipient.id, type: input.type, title: input.title, message: input.message });
    if (!recipient.email) return;
    try {
      await sendApprovalEmail({ to: recipient.email, recipientName: recipient.name, title: input.title, message: input.message, approvalUrl });
    } catch (error) {
      console.warn("[ApprovalEmail] delivery failed", { recipientId: recipient.id, type: input.type, error: error instanceof Error ? error.message : "unknown" });
    }
  }));
}

type ErpDb = NonNullable<Awaited<ReturnType<typeof getDb>>>;

async function resolveActiveCompanyId(db: ErpDb, ctx: { user: { id: number; role: string }; req: { cookies?: Record<string, string> } }) {
  const requestedId = Number(ctx.req.cookies?.active_company_id || 0);
  if (ctx.user.role === "admin" || ctx.user.role === "general_manager") {
    const rows = await db.select({ id: companies.id }).from(companies).where(eq(companies.isActive, 1));
    return rows.find((row) => row.id === requestedId)?.id || rows[0]?.id || null;
  }
  const memberships = await db.select({ companyId: companyMembers.companyId }).from(companyMembers).where(and(eq(companyMembers.userId, ctx.user.id), eq(companyMembers.status, "active")));
  if (!memberships.length) return null;
  return memberships.find((membership) => membership.companyId === requestedId)?.companyId || memberships[0].companyId;
}

async function ensureProjectWipAccount(db: ErpDb, project: { id: number; code: string; name: string }, actorId: number) {
  const parent = (await db.select().from(accounts).where(and(eq(accounts.code, "1400"), eq(accounts.accountType, "asset"), eq(accounts.isActive, 1))).limit(1))[0];
  if (!parent) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "حساب مشاريع تحت التنفيذ 1400 غير موجود في الشجرة المحاسبية" });
  const existingProject = (await db.select({ wipAccountId: projects.wipAccountId }).from(projects).where(eq(projects.id, project.id)).limit(1))[0];
  if (existingProject?.wipAccountId) return existingProject.wipAccountId;
  const code = `1400-${project.code}`.slice(0, 32);
  const existingAccount = (await db.select().from(accounts).where(eq(accounts.code, code)).limit(1))[0];
  const accountId = existingAccount?.id ?? Number((await db.insert(accounts).values({ code, name: `مشاريع تحت التنفيذ — ${project.name}`, accountType: "asset", parentId: parent.id, isPostable: 1, isActive: 1 }).then((result) => result[0].insertId)));
  await db.update(projects).set({ wipAccountId: accountId }).where(eq(projects.id, project.id));
  await db.insert(auditLogs).values({ entityType: "project", entityId: project.id, action: "wip_account_linked", actorId, afterJson: JSON.stringify({ wipAccountId: accountId, accountCode: code }) });
  return accountId;
}

async function ensureEmployeeAdvanceAccount(db: ErpDb, companyId: number, actorId: number) {
  const candidates = await db.select().from(accounts).where(and(eq(accounts.companyId, companyId), or(eq(accounts.code, "1203"), eq(accounts.name, "سلف الموظفين"))));
  const existing = candidates.find((account) => account.accountType === "asset" && account.isActive === 1 && account.isPostable === 1);
  if (existing) return existing.id;
  if (candidates.length) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "راجع إعداد حساب سلف الموظفين في شجرة الحسابات قبل اعتماد المسير" });
  const parent = (await db.select().from(accounts).where(and(eq(accounts.companyId, companyId), eq(accounts.code, "1200"), eq(accounts.accountType, "asset"), eq(accounts.isActive, 1))).limit(1))[0];
  if (!parent) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "حساب العملاء والذمم المدينة (1200) غير موجود لإنشاء حساب سلف الموظفين" });
  const result = await db.insert(accounts).values({ companyId, code: "1203", name: "سلف الموظفين", accountType: "asset", parentId: parent.id, isPostable: 1, isActive: 1 });
  const id = Number(result[0].insertId);
  await db.insert(auditLogs).values({ entityType: "account", entityId: id, action: "employee_advance_account_created", actorId, afterJson: JSON.stringify({ code: "1203", name: "سلف الموظفين", parentId: parent.id }) });
  return id;
}

async function releaseAdvanceRepaymentReservationsForRun(db: ErpDb, run: { id: number; month: number; year: number }) {
  const linked = await db.select().from(advanceRepayments).where(eq(advanceRepayments.payrollRunId, run.id));
  for (const repayment of linked) {
    if (repayment.status === "reserved") {
      await db.update(advanceRepayments).set({ status: "scheduled", appliedAmount: "0.00", payrollRunId: null, payrollId: null }).where(eq(advanceRepayments.id, repayment.id));
    }
    if (repayment.status === "deferred") {
      await db.update(advanceRepayments).set({ status: "scheduled", scheduledMonth: run.month, scheduledYear: run.year, deferredAt: null, payrollRunId: null, payrollId: null }).where(eq(advanceRepayments.id, repayment.id));
    }
  }
}

async function createInventoryPurchaseDocuments(db: ErpDb, ctx: { user: { id: number } }, input: { movementId: number; projectId: number; stageId?: number | null; itemId: number; vendorId?: number | null; quantity: number; unitCost: number; movementDate?: string; description?: string | null; contractId?: number | null; contractItemIndex?: number | null }) {
  const [item, vendor] = await Promise.all([
    db.select().from(inventoryItems).where(eq(inventoryItems.id, input.itemId)).limit(1),
    input.vendorId ? db.select().from(vendors).where(eq(vendors.id, input.vendorId)).limit(1) : Promise.resolve([]),
  ]);
  const itemRow = item[0];
  const vendorRow = vendor[0];
  if (!itemRow) throw new TRPCError({ code: "NOT_FOUND", message: "بطاقة الخامة غير موجودة" });
  const totalAmount = Number((input.quantity * input.unitCost).toFixed(2));
  const documentDate = input.movementDate ? new Date(input.movementDate) : new Date();
  const token = `${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;
  const receiptNumber = `GRN-${token}`;
  const invoiceNumber = `PI-INV-${token}`;
  const partyName = vendorRow?.name || "مورد غير محدد";
  const common = { projectId: input.projectId, supplierId: input.vendorId ?? null, partyName, partyTaxNumber: vendorRow?.taxNumber || null, voucherCategory: "materials" as const, documentDate, amount: totalAmount.toFixed(2), taxAmount: "0.00", totalAmount: totalAmount.toFixed(2), paidAmount: "0.00", paymentStatus: "unpaid" as const, status: "draft" as const, createdBy: ctx.user.id };
  const receiptResult = await db.insert(accountingDocuments).values({ ...common, documentType: "purchase_receipt", documentNumber: receiptNumber, relatedDocumentType: "inventory_movement", relatedDocumentId: input.movementId, notes: `سند استلام مورد تلقائي للخامة ${itemRow.name} — الكمية ${input.quantity} ${itemRow.unit}${input.contractId ? ` — العقد #${input.contractId} / البند ${Number(input.contractItemIndex ?? 0) + 1}` : ""}` });
  const receiptId = Number(receiptResult[0].insertId);
  const invoiceResult = await db.insert(accountingDocuments).values({ ...common, documentType: "purchase_invoice", documentNumber: invoiceNumber, relatedDocumentType: "purchase_receipt", relatedDocumentId: receiptId, notes: `فاتورة شراء تلقائية من سند الاستلام ${receiptNumber}. ${input.contractId ? `مرتبطة بالعقد #${input.contractId} والبند ${Number(input.contractItemIndex ?? 0) + 1}. ` : ""}${input.description || ""}`.trim() });
  const invoiceId = Number(invoiceResult[0].insertId);
  const accountRows = await db.select().from(accounts);
  const project = (await db.select({ id: projects.id, code: projects.code, name: projects.name }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0];
  if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود لإنشاء قيد مشاريع تحت التنفيذ" });
  const wipAccountId = await ensureProjectWipAccount(db, project, ctx.user.id);
  const linkedContract = input.contractId ? (await db.select().from(contractorContracts).where(eq(contractorContracts.id, input.contractId)).limit(1))[0] : null;
  const linkedLine = linkedContract && input.contractItemIndex !== null && input.contractItemIndex !== undefined ? (linkedContract.contractItems ?? [])[input.contractItemIndex] : null;
  const payableAccount = accountRows.find((account) => account.code === "2101" || account.name.includes("مورد")) ?? null;
  if (wipAccountId && payableAccount) {
    await db.insert(accountingDocumentLines).values([
      { documentId: invoiceId, accountId: wipAccountId, costItemId: linkedLine?.costItemId ?? null, projectId: input.projectId, stageId: input.stageId ?? null, description: `تكلفة خامة محمّلة على مشاريع تحت التنفيذ — ${itemRow.name}`, debit: totalAmount.toFixed(2), credit: "0.00" },
      { documentId: invoiceId, accountId: payableAccount.id, projectId: input.projectId, stageId: input.stageId ?? null, description: `مصروف مستحق للمورد — ${partyName}`, debit: "0.00", credit: totalAmount.toFixed(2) },
    ]);
  }
  await db.update(inventoryMovements).set({ sourceDocumentId: receiptId, purchaseInvoiceId: invoiceId, reference: input.description || receiptNumber }).where(eq(inventoryMovements.id, input.movementId));
  await db.insert(auditLogs).values({ entityType: "inventoryMovement", entityId: input.movementId, action: "auto_documents_created", actorId: ctx.user.id, afterJson: JSON.stringify({ receiptId, receiptNumber, purchaseInvoiceId: invoiceId, invoiceNumber, itemId: input.itemId, quantity: input.quantity, totalAmount }) });
  return { receiptId, receiptNumber, purchaseInvoiceId: invoiceId, invoiceNumber };
}

async function postInventoryLinkedDocuments(db: ErpDb, movement: { id?: number; projectId?: number; stageId?: number | null; costItemId?: number | null; itemId?: number; vendorId?: number | null; movementType?: string; unitCost?: string | number | null; movementDate?: Date | string | null; description?: string | null; sourceDocumentId?: number | null; purchaseInvoiceId?: number | null; contractId?: number | null; contractItemIndex?: number | null; quantity?: string | number | null }) {
  if (movement.sourceDocumentId) await db.update(accountingDocuments).set({ status: "posted" }).where(eq(accountingDocuments.id, movement.sourceDocumentId));
  if (movement.purchaseInvoiceId) await db.update(accountingDocuments).set({ status: "posted" }).where(eq(accountingDocuments.id, movement.purchaseInvoiceId));
  if (movement.movementType === "receipt" && movement.id && movement.projectId && movement.itemId) {
    const expenseReference = materialReceiptExpenseReference(movement.id);
    const existingExpense = (await db.select({ id: expenses.id }).from(expenses).where(eq(expenses.reference, expenseReference)).limit(1))[0];
    if (!existingExpense) {
      const [itemRow] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, movement.itemId)).limit(1);
      const contract = movement.contractId ? (await db.select().from(contractorContracts).where(eq(contractorContracts.id, movement.contractId)).limit(1))[0] : null;
      const line = contract && movement.contractItemIndex !== null && movement.contractItemIndex !== undefined ? (contract.contractItems ?? [])[movement.contractItemIndex] : null;
      const totalAmount = calculateMaterialReceiptCost(movement.quantity, movement.unitCost);
      await db.insert(expenses).values({ projectId: movement.projectId, stageId: movement.stageId ?? null, vendorId: movement.vendorId ?? null, costItemId: movement.costItemId ?? line?.costItemId ?? null, reference: expenseReference, description: `تكلفة خامة مستلمة${itemRow ? `: ${itemRow.name}` : ""}${movement.contractId ? ` — عقد #${movement.contractId}` : ""}`, unit: itemRow?.unit || "وحدة", quantity: Number(movement.quantity || 0).toFixed(3), expenseType: "materials_receipt", classification: "project", allocationRatio: "1", preTaxAmount: totalAmount.toFixed(2), taxRate: "0", taxAmount: "0", totalAmount: totalAmount.toFixed(2), paidAmount: "0", status: "posted", expenseDate: movement.movementDate ? new Date(movement.movementDate) : new Date() });
    }
  }
  if (movement.movementType === "issue" && movement.id && movement.projectId && movement.itemId) {
    const expenseReference = materialIssueExpenseReference(movement.id);
    const existingExpense = (await db.select({ id: expenses.id }).from(expenses).where(eq(expenses.reference, expenseReference)).limit(1))[0];
    if (!existingExpense) {
      const [itemRow] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, movement.itemId)).limit(1);
      const receiptRows = await db.select().from(inventoryMovements).where(and(eq(inventoryMovements.projectId, movement.projectId), eq(inventoryMovements.itemId, movement.itemId), eq(inventoryMovements.movementType, "receipt"), eq(inventoryMovements.status, "posted")));
      const receivedQuantity = receiptRows.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
      const receivedValue = receiptRows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const averageUnitCost = receivedQuantity > 0 ? receivedValue / receivedQuantity : Number(movement.unitCost || 0);
      const totalAmount = calculateMaterialReceiptCost(movement.quantity, Number(movement.unitCost || 0) > 0 ? movement.unitCost : averageUnitCost);
      await db.insert(expenses).values({ projectId: movement.projectId, stageId: movement.stageId ?? null, vendorId: movement.vendorId ?? null, costItemId: movement.costItemId ?? null, reference: expenseReference, description: `تكلفة خامة منصرفة${itemRow ? `: ${itemRow.name}` : ""}`, unit: itemRow?.unit || "وحدة", quantity: Number(movement.quantity || 0).toFixed(3), expenseType: "materials_issue", classification: "project", allocationRatio: "1", preTaxAmount: totalAmount.toFixed(2), taxRate: "0", taxAmount: "0", totalAmount: totalAmount.toFixed(2), paidAmount: "0", status: "posted", expenseDate: movement.movementDate ? new Date(movement.movementDate) : new Date() });
    }
  }
  if (movement.contractId !== null && movement.contractId !== undefined && movement.contractItemIndex !== null && movement.contractItemIndex !== undefined) {
    const contract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, movement.contractId)).limit(1))[0];
    if (contract) {
      const contractItems = [...(contract.contractItems ?? [])];
      const line = contractItems[movement.contractItemIndex];
      if (line) {
        contractItems[movement.contractItemIndex] = { ...line, suppliedQty: Number(line.suppliedQty || 0) + Number(movement.quantity || 0) };
        await db.update(contractorContracts).set({ contractItems }).where(eq(contractorContracts.id, movement.contractId));
      }
    }
  }
}

function canManagePartners(user: { role: string; id: number }) {
  return user.role === "admin" || Number(user.id) === 13170001;
}

function canReviewApproval(user: { role: string; id: number }, request: { entityType: string; approvalStage?: string | null }) {
  if (request.entityType === "certificate") return canReviewCertificateApproval(request.approvalStage, user);
  if (user.role === "admin") return request.entityType !== "payroll" && request.entityType !== "payroll_run" || request.approvalStage === "owner";
  if (user.role === "general_manager") return ((request.entityType === "payroll" || request.entityType === "payroll_run") && request.approvalStage === "general_manager") || (request.entityType === "purchase_payment" && request.approvalStage === "general_manager") || (request.entityType === "certificate" && request.approvalStage === "general_manager");
  if (user.role === "project_manager") return (request.entityType === "certificate" && request.approvalStage === "project_manager") || request.approvalStage === "project_manager";
  return false;
}

async function getAllowedProjectIds(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, role: string) {
  // General managers have read access across the active company; write access
  // remains blocked by assertProjectWrite and operation permissions.
  if (role === "admin" || role === "general_manager") return null;
  const rows = await db.select({ projectId: projectMembers.projectId }).from(projectMembers).where(eq(projectMembers.userId, userId));
  return new Set(rows.map((row) => row.projectId));
}

async function assertProjectAccess(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ctx: { user: { id: number; role: string }; req?: any }, projectId: number) {
  const activeCompanyId = await resolveActiveCompanyId(db, ctx as any);
  const project = (await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, projectId)).limit(1))[0];
  if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
  if (activeCompanyId && project.companyId !== activeCompanyId) throw new TRPCError({ code: "FORBIDDEN", message: "المشروع لا يتبع الشركة النشطة" });
  const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
  if (!canAccessProject(ctx.user.role, allowed, projectId)) throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية على هذا المشروع" });
}

async function assertProjectWrite(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ctx: { user: { id: number; role: string }; req?: any }, projectId: number) {
  await assertProjectAccess(db, ctx, projectId);
  if (ctx.user.role === "admin") return;
  const member = (await db.select({ projectRole: projectMembers.projectRole }).from(projectMembers).where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, ctx.user.id))).limit(1))[0];
  if (!member || !canWriteProject(ctx.user.role, member.projectRole)) throw new TRPCError({ code: "FORBIDDEN", message: "دور المستخدم لا يسمح بتسجيل حركة جديدة في هذا المشروع" });
}

function resolveAdvancePlan(input: { repaymentMode?: "single" | "installments"; repaymentStartMonth?: number; repaymentStartYear?: number; installmentCount?: number; repaymentDate?: string }) {
  const repaymentDate = input.repaymentDate ? new Date(`${input.repaymentDate}T00:00:00Z`) : null;
  const now = new Date();
  const repaymentStartMonth = input.repaymentStartMonth ?? (repaymentDate ? repaymentDate.getUTCMonth() + 1 : now.getUTCMonth() + 1);
  const repaymentStartYear = input.repaymentStartYear ?? (repaymentDate ? repaymentDate.getUTCFullYear() : now.getUTCFullYear());
  const installmentCount = input.repaymentMode === "installments" ? Math.max(2, input.installmentCount || 2) : 1;
  if (repaymentStartMonth < 1 || repaymentStartMonth > 12 || repaymentStartYear < 2000 || repaymentStartYear > 2100) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد شهر وسنة بدء خصم السلفة بصورة صحيحة" });
  return { repaymentMode: input.repaymentMode ?? "single", repaymentStartMonth, repaymentStartYear, installmentCount } as const;
}

function nextPayrollPeriod(month: number, year: number) {
  return month === 12 ? { month: 1, year: year + 1 } : { month: month + 1, year };
}

async function resolveMaterialPlanning(db: ErpDb, input: { projectId: number; stageId?: number; inventoryItemId: number; costItemId?: number; quantity: number; excludingRequisitionId?: number }) {
  const material = (await db.select().from(inventoryItems).where(eq(inventoryItems.id, input.inventoryItemId)).limit(1))[0];
  if (!material || !material.isActive || (material.projectId && material.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "بطاقة الخامة غير متاحة للمشروع المحدد" });
  if (input.costItemId) {
    const costItem = (await db.select().from(costItems).where(eq(costItems.id, input.costItemId)).limit(1))[0];
    if (!costItem || (costItem.projectId && costItem.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "بند التكلفة غير متاح للمشروع المحدد" });
  }
  const contracts = await db.select().from(contractorContracts).where(eq(contractorContracts.projectId, input.projectId));
  const candidate = contracts.filter((contract) => contract.status === "active" && (!input.stageId || !contract.stageId || contract.stageId === input.stageId)).flatMap((contract) => (contract.contractItems || []).map((line, index) => ({ contract, line, index }))).find(({ line }) => Number(line.inventoryItemId || 0) === input.inventoryItemId && (!input.costItemId || Number(line.costItemId || 0) === input.costItemId));
  const requisitions = await db.select().from(materialRequisitions).where(eq(materialRequisitions.projectId, input.projectId));
  const liveRequestIds = new Set(requisitions.filter((request) => request.id !== input.excludingRequisitionId && request.status !== "cancelled" && request.status !== "rejected" && (!input.stageId || request.stageId === input.stageId)).map((request) => request.id));
  const existingLines = await db.select().from(materialRequisitionItems);
  const requestedBeforeQuantity = existingLines.filter((line) => liveRequestIds.has(line.requisitionId) && line.inventoryItemId === input.inventoryItemId && (!input.costItemId || line.costItemId === input.costItemId)).reduce((sum, line) => sum + Number(line.quantity || 0), 0);
  const plan = calculateMaterialPlanning({ plannedQuantity: candidate?.line.contractedQty, suppliedQuantity: candidate?.line.suppliedQty, requestedBeforeQuantity, requestedQuantity: input.quantity });
  return { material, contractId: candidate?.contract.id ?? null, contractItemIndex: candidate?.index ?? null, costItemId: input.costItemId || candidate?.line.costItemId || null, ...plan };
}

async function assertOperationPermission(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ctx: { user: { id: number; role: string } }, key: z.infer<typeof operationKey>) {
  if (ctx.user.role === "admin") return "allow" as const;
  const restrictedRoleRules: Record<string, Set<string>> = {
    general_manager: new Set(["approve", "task_assignment"]),
    project_manager: new Set(["certificate", "approve"]),
    procurement_manager: new Set(["purchase_request", "inventory_item", "inventory_receipt", "inventory_issue"]),
    site_worker: new Set(["purchase_request", "inventory_receipt", "inventory_issue"]),
  };
  const allowedForRole = restrictedRoleRules[ctx.user.role];
  if (key === "task_assignment" && !canAssignTeamTasks(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN", message: "إسناد مهام الفريق متاح للمدير العام والمالك فقط" });
  if (allowedForRole && !allowedForRole.has(key)) throw new TRPCError({ code: "FORBIDDEN", message: "هذا الدور مخصص للاعتمادات أو عمليات الموقع المحددة فقط" });
  const row = (await db.select({ mode: userOperationPermissions.mode }).from(userOperationPermissions).where(and(eq(userOperationPermissions.userId, ctx.user.id), eq(userOperationPermissions.operationKey, key))).limit(1))[0];
  const fullAccessExceptApproval = new Set(["payroll", "certificate"]);
  const mode = row?.mode ?? (Number(ctx.user.id) === 13170001 ? "allow" : (fullAccessExceptApproval.has(key) ? "approval" : "allow"));
  if (mode === "deny") throw new TRPCError({ code: "FORBIDDEN", message: `ليس لديك صلاحية لتنفيذ عملية ${key}` });
  return mode;
}
async function assertPeriodOpen(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ctx: { user: { role: string } }, projectId: number, date: Date) {
  if (ctx.user.role === "admin") return;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const matching = await db.select().from(periodLocks).where(eq(periodLocks.projectId, projectId));
  if (matching.some((lock) => lock.periodYear === year && lock.periodMonth === month)) throw new TRPCError({ code: "FORBIDDEN", message: "الفترة مقفلة ولا يمكن تسجيل حركة جديدة" });
}

async function notifyOnce(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, type: string, title: string, message: string) {
  const existing = await db.select().from(notifications).where(eq(notifications.userId, userId));
  if (existing.some((note) => note.type === type && note.title === title && note.message === message && !note.readAt)) return;
  await db.insert(notifications).values({ userId, type, title, message });
}

async function findApprovalPolicy(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, projectId: number, entityType: "expense" | "payroll" | "certificate" | "collection" | "sale") {
  const rows = await db.select().from(approvalPolicies).where(eq(approvalPolicies.projectId, projectId));
  return rows.find((row) => row.projectId === projectId && row.entityType === entityType) ?? null;
}

async function resolveApprovalStatus(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, projectId: number, entityType: "expense" | "payroll" | "certificate" | "collection" | "sale", amount: number) {
  const policy = await findApprovalPolicy(db, projectId, entityType);
  return policy && amount <= Number(policy.thresholdAmount) ? "approved" as const : "pending" as const;
}

async function loadAccountingLedger(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, input: { projectId?: number; from?: string; to?: string }, companyId?: number | null) {
  const [documentRows, lineRows, accountRows, costItemRows] = await Promise.all([db.select().from(accountingDocuments), db.select().from(accountingDocumentLines), db.select().from(accounts), db.select().from(costItems)]);
  const from = input.from ? new Date(input.from).getTime() : Number.NEGATIVE_INFINITY;
  const to = input.to ? new Date(input.to).getTime() + 86400000 : Number.POSITIVE_INFINITY;
  const accountMap = new Map(accountRows.map((account) => [account.id, account]));
  const costItemMap = new Map(costItemRows.map((item) => [item.id, item]));
      const documentMap = new Map(documentRows.filter((document) => (!companyId || document.companyId === companyId) && (!input.projectId || document.projectId === input.projectId) && (!document.documentDate || (new Date(document.documentDate).getTime() >= from && new Date(document.documentDate).getTime() <= to))).map((document) => [document.id, document]));
  return lineRows.filter((line) => documentMap.has(line.documentId)).map((line) => ({ ...line, document: documentMap.get(line.documentId)!, account: accountMap.get(line.accountId) || null, costItem: line.costItemId ? costItemMap.get(line.costItemId) || null : null }));
}

export const erpRouter = router({
  estimates: router({
    list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), status: z.enum(["draft", "submitted", "approved", "archived"]).optional(), search: z.string().trim().max(255).optional() }).optional()).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = companyId ? await db.select().from(estimates).where(eq(estimates.companyId, companyId)).orderBy(desc(estimates.updatedAt)) : await db.select().from(estimates).orderBy(desc(estimates.updatedAt));
      const search = input?.search?.toLowerCase() || "";
      return rows.filter((row) => (!input?.projectId || row.projectId === input.projectId) && (!input?.status || row.status === input.status) && (!search || `${row.code} ${row.name} ${row.clientName || ""} ${row.siteLocation || ""}`.toLowerCase().includes(search)));
    }),
    linkedRecords: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ input }) => {
      const db = requireDb(await getDb());
      const contracts = await db.select({ id: contractorContracts.id, projectId: contractorContracts.projectId, contractNumber: contractorContracts.contractNumber, description: contractorContracts.description, status: contractorContracts.status }).from(contractorContracts).orderBy(desc(contractorContracts.createdAt));
      const certificatesRows = await db.select({ id: certificates.id, projectId: certificates.projectId, certificateNumber: certificates.certificateNumber, description: certificates.description, status: certificates.status }).from(certificates).orderBy(desc(certificates.createdAt));
      return { contracts: input?.projectId ? contracts.filter((row) => row.projectId === input.projectId) : contracts, certificates: input?.projectId ? certificatesRows.filter((row) => row.projectId === input.projectId) : certificatesRows };
    }),
    get: protectedProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const estimate = (await db.select().from(estimates).where(and(eq(estimates.id, input.id), companyId ? eq(estimates.companyId, companyId) : eq(estimates.id, input.id))).limit(1))[0];
      if (!estimate) throw new TRPCError({ code: "NOT_FOUND", message: "المقايسة غير موجودة" });
      if (estimate.projectId) await assertProjectAccess(db, ctx, estimate.projectId);
      const lines = await db.select().from(estimateLines).where(eq(estimateLines.estimateId, estimate.id)).orderBy(estimateLines.id);
      return { estimate, lines };
    }),
    create: protectedProcedure.input(z.object({ code: z.string().trim().min(2).max(64), name: z.string().trim().min(2).max(255), projectId: z.number().int().positive().nullable().optional(), contractId: z.number().int().positive().nullable().optional(), certificateId: z.number().int().positive().nullable().optional(), estimateType: z.enum(["contracting", "development", "general"]).default("contracting"), status: z.enum(["draft", "submitted"]).default("draft"), version: z.number().int().positive().default(1), clientName: z.string().trim().max(255).optional(), siteLocation: z.string().trim().max(255).optional(), notes: z.string().max(4000).optional(), lines: z.array(z.object({ parentId: z.number().int().positive().nullable().optional(), costItemId: z.number().int().positive().nullable().optional(), itemCode: z.string().trim().max(64).optional(), category: z.string().trim().max(128).default("أعمال عامة"), description: z.string().trim().min(2).max(2000), unit: z.string().trim().min(1).max(64), quantity: z.number().nonnegative(), materialCost: z.number().nonnegative().default(0), laborCost: z.number().nonnegative().default(0), equipmentCost: z.number().nonnegative().default(0), otherCost: z.number().nonnegative().default(0), unitRate: z.number().nonnegative().default(0), alternativeGroup: z.string().trim().max(128).optional(), isAlternative: z.boolean().default(false), notes: z.string().max(2000).optional() })).max(1000).default([]) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      if (input.projectId) await assertProjectAccess(db, ctx, input.projectId);
      const duplicate = await db.select({ id: estimates.id }).from(estimates).where(eq(estimates.code, input.code)).limit(1);
      if (duplicate.length) throw new TRPCError({ code: "CONFLICT", message: "كود المقايسة مستخدم بالفعل" });
      const result = await db.insert(estimates).values({ companyId: companyId || null, projectId: input.projectId ?? null, contractId: input.contractId ?? null, certificateId: input.certificateId ?? null, code: input.code, name: input.name, estimateType: input.estimateType, status: input.status, version: input.version, clientName: input.clientName || null, siteLocation: input.siteLocation || null, notes: input.notes || null, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      if (input.lines.length) await db.insert(estimateLines).values(input.lines.map((line) => { const { unitRate, totalCost } = calculateEstimateLine(line); return { estimateId: id, parentId: line.parentId ?? null, costItemId: line.costItemId ?? null, itemCode: line.itemCode || null, category: line.category, description: line.description, unit: line.unit, quantity: line.quantity.toFixed(3), materialCost: line.materialCost.toFixed(2), laborCost: line.laborCost.toFixed(2), equipmentCost: line.equipmentCost.toFixed(2), otherCost: line.otherCost.toFixed(2), unitRate: unitRate.toFixed(2), totalCost: totalCost.toFixed(2), alternativeGroup: line.alternativeGroup || null, isAlternative: line.isAlternative ? 1 : 0, notes: line.notes || null }; }));
      await db.insert(auditLogs).values({ entityType: "estimate", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, lines: input.lines.length }) });
      return { id };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), code: z.string().trim().min(2).max(64), name: z.string().trim().min(2).max(255), projectId: z.number().int().positive().nullable().optional(), contractId: z.number().int().positive().nullable().optional(), certificateId: z.number().int().positive().nullable().optional(), estimateType: z.enum(["contracting", "development", "general"]), status: z.enum(["draft", "submitted", "approved", "archived"]), version: z.number().int().positive(), clientName: z.string().trim().max(255).optional(), siteLocation: z.string().trim().max(255).optional(), notes: z.string().max(4000).optional(), lines: z.array(z.object({ parentId: z.number().int().positive().nullable().optional(), costItemId: z.number().int().positive().nullable().optional(), itemCode: z.string().trim().max(64).optional(), category: z.string().trim().max(128).default("أعمال عامة"), description: z.string().trim().min(2).max(2000), unit: z.string().trim().min(1).max(64), quantity: z.number().nonnegative(), materialCost: z.number().nonnegative().default(0), laborCost: z.number().nonnegative().default(0), equipmentCost: z.number().nonnegative().default(0), otherCost: z.number().nonnegative().default(0), unitRate: z.number().nonnegative().default(0), alternativeGroup: z.string().trim().max(128).optional(), isAlternative: z.boolean().default(false), notes: z.string().max(2000).optional() })).max(1000) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const existing = (await db.select().from(estimates).where(and(eq(estimates.id, input.id), companyId ? eq(estimates.companyId, companyId) : eq(estimates.id, input.id))).limit(1))[0];
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "المقايسة غير موجودة" });
      if (input.projectId) await assertProjectAccess(db, ctx, input.projectId);
      await db.update(estimates).set({ code: input.code, name: input.name, projectId: input.projectId ?? null, contractId: input.contractId ?? null, certificateId: input.certificateId ?? null, estimateType: input.estimateType, status: input.status, version: input.version, clientName: input.clientName || null, siteLocation: input.siteLocation || null, notes: input.notes || null }).where(eq(estimates.id, input.id));
      await db.delete(estimateLines).where(eq(estimateLines.estimateId, input.id));
      if (input.lines.length) await db.insert(estimateLines).values(input.lines.map((line) => { const { unitRate, totalCost } = calculateEstimateLine(line); return { estimateId: input.id, parentId: line.parentId ?? null, costItemId: line.costItemId ?? null, itemCode: line.itemCode || null, category: line.category, description: line.description, unit: line.unit, quantity: line.quantity.toFixed(3), materialCost: line.materialCost.toFixed(2), laborCost: line.laborCost.toFixed(2), equipmentCost: line.equipmentCost.toFixed(2), otherCost: line.otherCost.toFixed(2), unitRate: unitRate.toFixed(2), totalCost: totalCost.toFixed(2), alternativeGroup: line.alternativeGroup || null, isAlternative: line.isAlternative ? 1 : 0, notes: line.notes || null }; }));
      await db.insert(auditLogs).values({ entityType: "estimate", entityId: input.id, action: "updated", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, lines: input.lines.length }) });
      return { success: true } as const;
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const existing = (await db.select().from(estimates).where(and(eq(estimates.id, input.id), companyId ? eq(estimates.companyId, companyId) : eq(estimates.id, input.id))).limit(1))[0];
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "المقايسة غير موجودة" });
      await db.delete(estimateLines).where(eq(estimateLines.estimateId, input.id));
      await db.delete(estimates).where(eq(estimates.id, input.id));
      await db.insert(auditLogs).values({ entityType: "estimate", entityId: input.id, action: "deleted", actorId: ctx.user.id, beforeJson: JSON.stringify(existing) });
      return { success: true } as const;
    }),
  }),
  companies: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      if (ctx.user.role === "admin" || ctx.user.role === "general_manager") return db.select().from(companies).where(eq(companies.isActive, 1)).orderBy(companies.legalName);
      const memberships = await db.select({ companyId: companyMembers.companyId }).from(companyMembers).where(and(eq(companyMembers.userId, ctx.user.id), eq(companyMembers.status, "active")));
      const rows = await db.select().from(companies).where(eq(companies.isActive, 1));
      return rows.filter((row) => memberships.some((membership) => membership.companyId === row.id));
    }),
    current: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const requestedId = Number(ctx.req.cookies?.active_company_id || 0);
      const memberships = ctx.user.role === "admin" || ctx.user.role === "general_manager" ? [] : await db.select().from(companyMembers).where(and(eq(companyMembers.userId, ctx.user.id), eq(companyMembers.status, "active")));
      const permittedIds = ctx.user.role === "admin" || ctx.user.role === "general_manager" ? null : memberships.map((membership) => membership.companyId);
      const rows = await db.select().from(companies).where(eq(companies.isActive, 1));
      const company = rows.find((row) => row.id === requestedId && (!permittedIds || permittedIds.includes(row.id))) || rows.find((row) => !permittedIds || permittedIds.includes(row.id)) || null;
      const membership = company && permittedIds ? memberships.find((item) => item.companyId === company.id) || null : null;
      return { company, membership };
    }),
    switch: protectedProcedure.input(z.object({ companyId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const company = (await db.select().from(companies).where(and(eq(companies.id, input.companyId), eq(companies.isActive, 1))).limit(1))[0];
      if (!company) throw new TRPCError({ code: "NOT_FOUND", message: "الشركة غير موجودة أو غير نشطة" });
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") {
        const membership = (await db.select().from(companyMembers).where(and(eq(companyMembers.companyId, input.companyId), eq(companyMembers.userId, ctx.user.id), eq(companyMembers.status, "active"))).limit(1))[0];
        if (!membership) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية الدخول إلى هذه الشركة" });
      }
      ctx.res.cookie("active_company_id", String(input.companyId), { ...getSessionCookieOptions(ctx.req), maxAge: 60 * 60 * 24 * 30 });
      return { companyId: input.companyId };
    }),
    create: adminProcedure.input(z.object({ legalName: z.string().trim().min(1).max(255), businessType: z.enum(["real_estate_developer", "contractor"]).default("real_estate_developer"), tradeName: z.string().max(255).optional(), commercialRegistration: z.string().max(128).optional(), taxNumber: z.string().max(128).optional(), nationalAddress: z.string().max(4000).optional(), phone: z.string().max(64).optional(), email: z.string().email().optional().or(z.literal("")), logoUrl: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const result = await db.insert(companies).values({ ...input, email: input.email || null, tradeName: input.tradeName || null, commercialRegistration: input.commercialRegistration || null, taxNumber: input.taxNumber || null, nationalAddress: input.nationalAddress || null, phone: input.phone || null, logoUrl: input.logoUrl || null, createdBy: ctx.user.id });
      const companyId = Number(result[0].insertId);
      await db.insert(companyMembers).values({ companyId, userId: ctx.user.id, role: "owner", status: "active" });
      return { id: companyId };
    }),
    memberships: adminProcedure.query(async () => { const db = requireDb(await getDb()); const rows = await db.select().from(companyMembers); const companyRows = await db.select().from(companies); const userRows = await db.select().from(users); return rows.map((membership) => ({ ...membership, company: companyRows.find((company) => company.id === membership.companyId) || null, user: userRows.find((user) => user.id === membership.userId) || null })); }),
    assignUser: adminProcedure.input(z.object({ userId: z.number().int().positive(), companyId: z.number().int().positive(), role: z.enum(["admin", "general_manager", "project_manager", "procurement_manager", "user"]), status: z.enum(["active", "invited", "suspended"]).default("active") })).mutation(async ({ input }) => {
      const db = requireDb(await getDb());
      const company = (await db.select({ id: companies.id }).from(companies).where(eq(companies.id, input.companyId)).limit(1))[0];
      if (!company) throw new TRPCError({ code: "NOT_FOUND", message: "الشركة غير موجودة" });
      const existing = (await db.select({ id: companyMembers.id }).from(companyMembers).where(and(eq(companyMembers.userId, input.userId), eq(companyMembers.companyId, input.companyId))).limit(1))[0];
      if (existing) await db.update(companyMembers).set({ role: input.role, status: input.status }).where(eq(companyMembers.id, existing.id));
      else await db.insert(companyMembers).values({ userId: input.userId, companyId: input.companyId, role: input.role, status: input.status });
      return { userId: input.userId, companyId: input.companyId };
    }),
  }),
  company: router({
    get: protectedProcedure.query(async ({ ctx }) => { const db = requireDb(await getDb()); const companyId = await resolveActiveCompanyId(db, ctx); return (await db.select().from(companyProfiles).where(companyId ? eq(companyProfiles.companyId, companyId) : eq(companyProfiles.id, -1)).limit(1))[0] ?? null; }),
    save: adminProcedure.input(z.object({ legalName: z.string().trim().min(1).max(255), tradeName: z.string().max(255).optional(), commercialRegistration: z.string().max(128).optional(), taxNumber: z.string().max(128).optional(), nationalAddress: z.string().max(4000).optional(), phone: z.string().max(64).optional(), email: z.string().email().optional().or(z.literal("")), website: z.string().max(255).optional(), logoUrl: z.string().max(2000).optional(), notes: z.string().max(4000).optional() })).mutation(async ({ ctx, input }) => { const db = requireDb(await getDb()); const companyId = await resolveActiveCompanyId(db, ctx); if (!companyId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "اختر شركة نشطة قبل حفظ بيانات الهوية" }); const existing = (await db.select().from(companyProfiles).where(eq(companyProfiles.companyId, companyId)).limit(1))[0]; const values = { companyId, legalName: input.legalName, tradeName: input.tradeName || null, commercialRegistration: input.commercialRegistration || null, taxNumber: input.taxNumber || null, nationalAddress: input.nationalAddress || null, phone: input.phone || null, email: input.email || null, website: input.website || null, logoUrl: input.logoUrl || null, notes: input.notes || null, createdBy: ctx.user.id }; if (existing) { await db.update(companyProfiles).set(values).where(eq(companyProfiles.id, existing.id)); await db.insert(auditLogs).values({ entityType: "companyProfile", entityId: existing.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(existing), afterJson: JSON.stringify(input) }); return { id: existing.id }; } const result = await db.insert(companyProfiles).values(values); const id = Number(result[0].insertId); await db.insert(auditLogs).values({ entityType: "companyProfile", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) }); return { id }; }),
  }),
  cashAccounts: router({
    list: protectedProcedure.query(async ({ ctx }) => { const db = requireDb(await getDb()); const companyId = await resolveActiveCompanyId(db, ctx); return companyId ? db.select().from(cashAccounts).where(and(eq(cashAccounts.isActive, 1), eq(cashAccounts.companyId, companyId))).orderBy(cashAccounts.name) : []; }),
    create: protectedProcedure.input(z.object({ code: z.string().trim().min(1).max(32), name: z.string().trim().min(1).max(255), accountType: z.enum(["bank", "cash"]), bankName: z.string().max(255).optional(), accountNumber: z.string().max(128).optional(), iban: z.string().max(64).optional(), currency: z.string().max(8).default("SAR"), accountId: z.number().int().positive().optional(), openingBalance: z.number().default(0) })).mutation(async ({ ctx, input }) => { const db = requireDb(await getDb()); await assertOperationPermission(db, ctx, "edit"); const duplicate = await db.select({ id: cashAccounts.id }).from(cashAccounts).where(eq(cashAccounts.code, input.code)).limit(1); if (duplicate.length) throw new TRPCError({ code: "CONFLICT", message: "كود الحساب مستخدم بالفعل" }); const companyId = await resolveActiveCompanyId(db, ctx); if (!companyId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا توجد شركة نشطة" }); const result = await db.insert(cashAccounts).values({ ...input, companyId, bankName: input.bankName || null, accountNumber: input.accountNumber || null, iban: input.iban || null, accountId: input.accountId || null, openingBalance: input.openingBalance.toFixed(2), createdBy: ctx.user.id }); const id = Number(result[0].insertId); await db.insert(auditLogs).values({ entityType: "cashAccount", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) }); return { id }; }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), code: z.string().trim().min(1).max(32), name: z.string().trim().min(1).max(255), accountType: z.enum(["bank", "cash"]), bankName: z.string().max(255).optional(), accountNumber: z.string().max(128).optional(), iban: z.string().max(64).optional(), currency: z.string().max(8).default("SAR"), accountId: z.number().int().positive().optional(), openingBalance: z.number().default(0) })).mutation(async ({ ctx, input }) => { const db = requireDb(await getDb()); await assertOperationPermission(db, ctx, "edit"); const companyId = await resolveActiveCompanyId(db, ctx); const before = (await db.select().from(cashAccounts).where(and(eq(cashAccounts.id, input.id), companyId ? eq(cashAccounts.companyId, companyId) : eq(cashAccounts.id, -1))).limit(1))[0]; if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "الحساب النقدي غير موجود ضمن الشركة الحالية" }); await db.update(cashAccounts).set({ code: input.code, name: input.name, accountType: input.accountType, bankName: input.bankName || null, accountNumber: input.accountNumber || null, iban: input.iban || null, currency: input.currency, accountId: input.accountId || null, openingBalance: input.openingBalance.toFixed(2) }).where(and(eq(cashAccounts.id, input.id), companyId ? eq(cashAccounts.companyId, companyId) : eq(cashAccounts.id, -1))); await db.insert(auditLogs).values({ entityType: "cashAccount", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) }); return { id: input.id }; }),
    deactivate: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => { const db = requireDb(await getDb()); await assertOperationPermission(db, ctx, "edit"); const companyId = await resolveActiveCompanyId(db, ctx); await db.update(cashAccounts).set({ isActive: 0 }).where(and(eq(cashAccounts.id, input.id), companyId ? eq(cashAccounts.companyId, companyId) : eq(cashAccounts.id, -1))); await db.insert(auditLogs).values({ entityType: "cashAccount", entityId: input.id, action: "deactivated", actorId: ctx.user.id }); return { id: input.id }; }),
  }),
  employees: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(employees).orderBy(employees.fullName);
    }),
    managers: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users).orderBy(users.name);
    }),
    create: protectedProcedure.input(employeeProfileSchema).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && Number(ctx.user.id) !== 13170001) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إضافة موظف" });
      const db = requireDb(await getDb());
      const result = await db.insert(employees).values({ ...input, jobTitle: input.jobTitle || null, department: input.department || null, managerName: input.managerName || null, managerUserId: input.managerUserId ?? null, generalManagerUserId: input.generalManagerUserId ?? null, phone: input.phone || null, email: input.email || null, nationalId: input.nationalId || null, nationality: input.nationality || null, birthDate: input.birthDate ? new Date(input.birthDate) : null, hireDate: input.hireDate ? new Date(input.hireDate) : null, workLocation: input.workLocation || null, address: input.address || null, nationalAddress: input.nationalAddress || null, bankName: input.bankName || null, iban: input.iban || null, insuranceNumber: input.insuranceNumber || null, basicSalary: input.basicSalary.toFixed(2), housingAllowance: input.housingAllowance.toFixed(2), transportAllowance: input.transportAllowance.toFixed(2), otherAllowances: input.otherAllowances.toFixed(2), standardDeduction: input.standardDeduction.toFixed(2), notes: input.notes || null, defaultProjectId: input.defaultProjectId ?? null });
      await db.insert(auditLogs).values({ entityType: "employee", entityId: Number(result[0].insertId), action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id: Number(result[0].insertId) };
    }),
    createWorker: protectedProcedure.input(z.object({ fullName: z.string().trim().min(2).max(255), nationalId: z.string().trim().min(3).max(64), phone: z.string().max(64).optional(), jobTitle: z.string().max(255).optional(), nationality: z.string().max(128).optional(), basicSalary: z.number().nonnegative(), housingAllowance: z.number().nonnegative().default(0), transportAllowance: z.number().nonnegative().default(0), otherAllowances: z.number().nonnegative().default(0), standardDeduction: z.number().nonnegative().default(0), defaultProjectId: z.number().int().positive().nullable().optional(), notes: z.string().max(4000).optional() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && Number(ctx.user.id) !== 13170001) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية إضافة أجير" });
      const db = requireDb(await getDb());
      const existing = (await db.select({ id: employees.id }).from(employees).where(eq(employees.nationalId, input.nationalId)).limit(1))[0];
      if (existing) throw new TRPCError({ code: "CONFLICT", message: "رقم الإقامة أو الهوية مستخدم بالفعل" });
      const employeeCode = `AJR-${Date.now()}`;
      const result = await db.insert(employees).values({ employeeCode, employmentType: "worker", fullName: input.fullName, nationalId: input.nationalId, phone: input.phone || null, jobTitle: input.jobTitle || "أجير", nationality: input.nationality || null, basicSalary: input.basicSalary.toFixed(2), housingAllowance: input.housingAllowance.toFixed(2), transportAllowance: input.transportAllowance.toFixed(2), otherAllowances: input.otherAllowances.toFixed(2), standardDeduction: input.standardDeduction.toFixed(2), defaultProjectId: input.defaultProjectId ?? null, notes: input.notes || null, department: null, managerName: null, managerUserId: null, generalManagerUserId: null, email: null, birthDate: null, hireDate: null, workLocation: null, address: null, nationalAddress: null, bankName: null, iban: null, insuranceNumber: null });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "employee", entityId: id, action: "worker_created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, employeeCode }) });
      return { id, employeeCode };
    }),
    update: protectedProcedure.input(employeeProfileSchema.extend({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertOperationPermission(db, ctx, "edit");
      const before = (await db.select().from(employees).where(eq(employees.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "الموظف غير موجود" });
      await db.update(employees).set({ employeeCode: input.employeeCode, employmentType: input.employmentType, fullName: input.fullName, jobTitle: input.jobTitle || null, department: input.department || null, managerName: input.managerName || null, managerUserId: input.managerUserId ?? null, generalManagerUserId: input.generalManagerUserId ?? null, phone: input.phone || null, email: input.email || null, nationalId: input.nationalId || null, nationality: input.nationality || null, birthDate: input.birthDate ? new Date(input.birthDate) : null, hireDate: input.hireDate ? new Date(input.hireDate) : null, workLocation: input.workLocation || null, address: input.address || null, nationalAddress: input.nationalAddress || null, bankName: input.bankName || null, iban: input.iban || null, insuranceNumber: input.insuranceNumber || null, basicSalary: input.basicSalary.toFixed(2), housingAllowance: input.housingAllowance.toFixed(2), transportAllowance: input.transportAllowance.toFixed(2), otherAllowances: input.otherAllowances.toFixed(2), standardDeduction: input.standardDeduction.toFixed(2), notes: input.notes || null, defaultProjectId: input.defaultProjectId ?? null }).where(eq(employees.id, input.id));
      await db.insert(auditLogs).values({ entityType: "employee", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
    updateStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["active", "inactive"]) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertOperationPermission(db, ctx, "edit");
      await db.update(employees).set({ status: input.status }).where(eq(employees.id, input.id));
      await db.insert(auditLogs).values({ entityType: "employee", entityId: input.id, action: "status_updated", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
    archive: protectedProcedure.input(z.object({ employeeId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager" && Number(ctx.user.id) !== 13170001) throw new TRPCError({ code: "FORBIDDEN", message: "أرشيف الموظفين متاح للمسؤولين المخولين فقط" });
      const db = requireDb(await getDb());
      const [employee] = await db.select().from(employees).where(eq(employees.id, input.employeeId)).limit(1);
      if (!employee) throw new TRPCError({ code: "NOT_FOUND", message: "الموظف غير موجود" });
      const [workStarts, leaves, advances] = await Promise.all([
        db.select().from(employeeWorkStarts).where(eq(employeeWorkStarts.employeeId, input.employeeId)).orderBy(desc(employeeWorkStarts.createdAt)),
        db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, input.employeeId)).orderBy(desc(leaveRequests.createdAt)),
        db.select().from(advanceRequests).where(eq(advanceRequests.employeeId, input.employeeId)).orderBy(desc(advanceRequests.createdAt)),
      ]);
      return { employee, workStarts, leaves, advances };
    }),
    workStarts: router({
      list: protectedProcedure.input(z.object({ employeeId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager" && Number(ctx.user.id) !== 13170001) throw new TRPCError({ code: "FORBIDDEN", message: "مستندات الموظفين متاحة للمسؤولين المخولين فقط" });
        const db = requireDb(await getDb());
        return input?.employeeId ? db.select().from(employeeWorkStarts).where(eq(employeeWorkStarts.employeeId, input.employeeId)).orderBy(desc(employeeWorkStarts.createdAt)) : db.select().from(employeeWorkStarts).orderBy(desc(employeeWorkStarts.createdAt));
      }),
      create: protectedProcedure.input(z.object({ employeeId: z.number().int().positive(), projectId: z.number().int().positive().nullable().optional(), workStartDate: z.string().min(10), jobTitle: z.string().max(255).optional(), workLocation: z.string().max(255).optional(), notes: z.string().max(4000).optional(), employeeSignatureName: z.string().trim().min(2).max(255) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");
        const [employee] = await db.select().from(employees).where(eq(employees.id, input.employeeId)).limit(1);
        if (!employee) throw new TRPCError({ code: "NOT_FOUND", message: "الموظف غير موجود" });
        const result = await db.insert(employeeWorkStarts).values({ employeeId: input.employeeId, projectId: input.projectId ?? employee.defaultProjectId ?? null, workStartDate: new Date(`${input.workStartDate}T00:00:00Z`), jobTitle: input.jobTitle || employee.jobTitle || null, workLocation: input.workLocation || employee.workLocation || null, notes: input.notes || null, employeeSignatureName: input.employeeSignatureName, employeeSignedAt: new Date(), createdBy: ctx.user.id });
        const id = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "employeeWorkStart", entityId: id, action: "created_employee_signed", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        await notifyApprovalUsers(db, { type: "employee_work_start", title: "نموذج مباشرة عمل ينتظر توقيع المدير العام", message: `نموذج مباشرة عمل للموظف ${employee.fullName} بانتظار التوقيع النهائي.`, roles: ["general_manager"], userIds: [] });
        return { id, status: "pending_general_manager" as const };
      }),
      sign: protectedProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["signed", "rejected"]), note: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "توقيع مباشرة العمل النهائي متاح للمدير العام فقط" });
        if (input.decision === "rejected" && !input.note?.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب كتابة سبب الرفض" });
        const db = requireDb(await getDb());
        const [document] = await db.select().from(employeeWorkStarts).where(eq(employeeWorkStarts.id, input.id)).limit(1);
        if (!document) throw new TRPCError({ code: "NOT_FOUND", message: "نموذج مباشرة العمل غير موجود" });
        await db.update(employeeWorkStarts).set({ status: input.decision, generalManagerUserId: ctx.user.id, generalManagerSignedAt: new Date(), rejectionReason: input.decision === "rejected" ? input.note!.trim() : null }).where(eq(employeeWorkStarts.id, input.id));
        await db.insert(auditLogs).values({ entityType: "employeeWorkStart", entityId: input.id, action: input.decision === "signed" ? "general_manager_signed" : "general_manager_rejected", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { success: true } as const;
      }),
      update: protectedProcedure.input(z.object({ id: z.number().int().positive(), workStartDate: z.string().min(10), projectId: z.number().int().positive().nullable().optional(), jobTitle: z.string().max(255).optional(), workLocation: z.string().max(255).optional(), notes: z.string().max(4000).optional(), employeeSignatureName: z.string().trim().min(2).max(255) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");
        const [document] = await db.select().from(employeeWorkStarts).where(eq(employeeWorkStarts.id, input.id)).limit(1);
        if (!document) throw new TRPCError({ code: "NOT_FOUND", message: "نموذج مباشرة العمل غير موجود" });
        if (document.status === "signed") throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن تعديل نموذج مباشرة عمل موقع نهائيًا؛ أنشئ نموذجًا جديدًا عند الحاجة" });
        await db.update(employeeWorkStarts).set({ workStartDate: new Date(`${input.workStartDate}T00:00:00Z`), projectId: input.projectId ?? null, jobTitle: input.jobTitle || null, workLocation: input.workLocation || null, notes: input.notes || null, employeeSignatureName: input.employeeSignatureName, employeeSignedAt: new Date(), status: "pending_general_manager", generalManagerUserId: null, generalManagerSignedAt: null, rejectionReason: null }).where(eq(employeeWorkStarts.id, input.id));
        await db.insert(auditLogs).values({ entityType: "employeeWorkStart", entityId: input.id, action: "updated_resubmitted", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { success: true } as const;
      }),
      delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "حذف مستندات الموظفين متاح للمالك فقط" });
        const db = requireDb(await getDb());
        await db.delete(employeeWorkStarts).where(eq(employeeWorkStarts.id, input.id));
        await db.insert(auditLogs).values({ entityType: "employeeWorkStart", entityId: input.id, action: "deleted", actorId: ctx.user.id });
        return { success: true } as const;
      }),
    }),
  }),
  leaveRequests: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(leaveRequests).orderBy(desc(leaveRequests.createdAt));
      return ctx.user.role === "admin" || ctx.user.role === "general_manager" ? rows : rows.filter((row) => row.requestedBy === ctx.user.id);
    }),
    create: protectedProcedure.input(z.object({ employeeId: z.number().int().positive().nullable().optional(), leaveType: z.enum(["annual", "sick", "emergency", "unpaid", "official", "other"]), startDate: z.string().min(10), endDate: z.string().min(10), reason: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
      const start = new Date(`${input.startDate}T00:00:00Z`); const end = new Date(`${input.endDate}T00:00:00Z`);
      const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
      if (!Number.isFinite(days) || days <= 0) throw new TRPCError({ code: "BAD_REQUEST", message: "تاريخ نهاية الإجازة يجب أن يكون بعد تاريخ البداية" });
      const db = requireDb(await getDb());
      const result = await db.insert(leaveRequests).values({ requestedBy: ctx.user.id, employeeId: input.employeeId ?? null, leaveType: input.leaveType, startDate: start, endDate: end, days: days.toFixed(2), reason: input.reason || null });
      const requestId = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "leaveRequest", entityId: requestId, action: "created_pending", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      await notifyApprovalUsers(db, { type: "leave_approval", title: "طلب إجازة جديد يحتاج موافقة", message: `يوجد طلب إجازة جديد لمدة ${days} يومًا من المستخدم #${ctx.user.id}.`, approvalUrl: `${getAppUrl(ctx.req)}/approvals` });
      return { id: requestId };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), leaveType: z.enum(["annual", "sick", "emergency", "unpaid", "official", "other"]), startDate: z.string().min(10), endDate: z.string().min(10), reason: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
      const start = new Date(`${input.startDate}T00:00:00Z`); const end = new Date(`${input.endDate}T00:00:00Z`); const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
      if (!Number.isFinite(days) || days <= 0) throw new TRPCError({ code: "BAD_REQUEST", message: "تاريخ نهاية الإجازة يجب أن يكون بعد تاريخ البداية" });
      const db = requireDb(await getDb()); await assertOperationPermission(db, ctx, "edit");
      const [before] = await db.select().from(leaveRequests).where(eq(leaveRequests.id, input.id)).limit(1);
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "طلب الإجازة غير موجود" });
      await db.update(leaveRequests).set({ leaveType: input.leaveType, startDate: start, endDate: end, days: days.toFixed(2), reason: input.reason || null, status: "pending", reviewedBy: null, reviewedAt: null, rejectionReason: null }).where(eq(leaveRequests.id, input.id));
      await db.insert(auditLogs).values({ entityType: "leaveRequest", entityId: input.id, action: "updated_resubmitted", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "حذف مستندات الموظفين متاح للمالك فقط" });
      const db = requireDb(await getDb()); await db.delete(leaveRequests).where(eq(leaveRequests.id, input.id)); await db.insert(auditLogs).values({ entityType: "leaveRequest", entityId: input.id, action: "deleted", actorId: ctx.user.id }); return { success: true } as const;
    }),
    decide: protectedProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "اعتماد طلبات الإجازات متاح للمدير العام والمالك فقط" });
      if (input.decision === "rejected" && !input.note?.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب كتابة سبب الرفض" });
      const db = requireDb(await getDb());
      await db.update(leaveRequests).set({ status: input.decision, reviewedBy: ctx.user.id, reviewedAt: new Date(), rejectionReason: input.decision === "rejected" ? input.note!.trim() : null }).where(eq(leaveRequests.id, input.id));
      await db.insert(auditLogs).values({ entityType: "leaveRequest", entityId: input.id, action: input.decision, actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
  }),
  advanceRequests: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(advanceRequests).orderBy(desc(advanceRequests.createdAt));
      const repayments = await db.select().from(advanceRepayments);
      const visible = ctx.user.role === "admin" || ctx.user.role === "general_manager" ? rows : rows.filter((row) => row.requestedBy === ctx.user.id);
      return visible.map((row) => {
        const schedule = repayments.filter((repayment) => repayment.advanceRequestId === row.id);
        const applied = schedule.filter((repayment) => repayment.status === "applied");
        const appliedAmount = applied.reduce((total, repayment) => total + Number(repayment.appliedAmount || 0), 0);
        return { ...row, repayments: schedule, appliedAmount, outstandingAmount: advanceOutstandingAmount(Number(row.amount || 0), applied.map((repayment) => repayment.appliedAmount)) };
      });
    }),
    statement: protectedProcedure.input(z.object({ employeeId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager" && Number(ctx.user.id) !== 13170001) throw new TRPCError({ code: "FORBIDDEN", message: "كشف حساب السلف متاح للمسؤولين المخولين فقط" });
      const db = requireDb(await getDb());
      const [employee] = await db.select().from(employees).where(eq(employees.id, input.employeeId)).limit(1);
      if (!employee) throw new TRPCError({ code: "NOT_FOUND", message: "الموظف غير موجود" });
      const advances = await db.select().from(advanceRequests).where(eq(advanceRequests.employeeId, input.employeeId)).orderBy(desc(advanceRequests.createdAt));
      const repayments = await db.select().from(advanceRepayments).where(eq(advanceRepayments.employeeId, input.employeeId));
      const enriched = advances.map((advance) => {
        const schedule = repayments.filter((repayment) => repayment.advanceRequestId === advance.id);
        const applied = schedule.filter((repayment) => repayment.status === "applied");
        const appliedAmount = applied.reduce((total, repayment) => total + Number(repayment.appliedAmount || 0), 0);
        return { ...advance, repayments: schedule, appliedAmount, outstandingAmount: advanceOutstandingAmount(Number(advance.amount || 0), applied.map((repayment) => repayment.appliedAmount)) };
      });
      const approved = enriched.filter((advance) => advance.status === "approved");
      const grantedAmount = approved.reduce((total, advance) => total + Number(advance.amount || 0), 0);
      const appliedAmount = approved.reduce((total, advance) => total + advance.appliedAmount, 0);
      return { employee, advances: enriched, totals: { grantedAmount, appliedAmount, outstandingAmount: Math.max(grantedAmount - appliedAmount, 0) } };
    }),
    create: protectedProcedure.input(z.object({ employeeId: z.number().int().positive().nullable().optional(), amount: z.number().positive(), reason: z.string().trim().min(2).max(2000), repaymentDate: z.string().optional(), repaymentMode: z.enum(["single", "installments"]).default("single"), repaymentStartMonth: z.number().int().min(1).max(12).optional(), repaymentStartYear: z.number().int().min(2000).max(2100).optional(), installmentCount: z.number().int().min(1).max(120).default(1) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.employeeId && ctx.user.role !== "admin" && ctx.user.role !== "general_manager" && Number(ctx.user.id) !== 13170001) throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكن إنشاء سلفة لموظف آخر إلا من قبل مسؤول مخول" });
      const linkedEmployee = input.employeeId ? null : (ctx.user.email ? (await db.select({ id: employees.id }).from(employees).where(eq(employees.email, ctx.user.email)).limit(1))[0] : null);
      const plan = resolveAdvancePlan(input);
      const result = await db.insert(advanceRequests).values({ requestedBy: ctx.user.id, employeeId: input.employeeId ?? linkedEmployee?.id ?? null, amount: input.amount.toFixed(2), reason: input.reason, repaymentDate: input.repaymentDate ? new Date(input.repaymentDate) : null, ...plan });
      const requestId = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "advanceRequest", entityId: requestId, action: "created_pending", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      await notifyApprovalUsers(db, { type: "advance_approval", title: "طلب سلفة جديد يحتاج موافقة", message: `يوجد طلب سلفة بقيمة ${input.amount.toFixed(2)} ر.س من المستخدم #${ctx.user.id}.`, approvalUrl: `${getAppUrl(ctx.req)}/approvals` });
      return { id: requestId };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), amount: z.number().positive(), reason: z.string().trim().min(2).max(2000), repaymentDate: z.string().optional(), repaymentMode: z.enum(["single", "installments"]).default("single"), repaymentStartMonth: z.number().int().min(1).max(12).optional(), repaymentStartYear: z.number().int().min(2000).max(2100).optional(), installmentCount: z.number().int().min(1).max(120).default(1) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb()); await assertOperationPermission(db, ctx, "edit");
      const [before] = await db.select().from(advanceRequests).where(eq(advanceRequests.id, input.id)).limit(1);
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "طلب السلفة غير موجود" });
      if (before.status === "approved") throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا يمكن تعديل سلفة معتمدة؛ أنشئ معالجة أو سلفة جديدة للحفاظ على كشف الحساب" });
      const plan = resolveAdvancePlan(input);
      await db.update(advanceRepayments).set({ status: "cancelled" }).where(eq(advanceRepayments.advanceRequestId, input.id));
      await db.update(advanceRequests).set({ amount: input.amount.toFixed(2), reason: input.reason, repaymentDate: input.repaymentDate ? new Date(input.repaymentDate) : null, ...plan, status: "pending", reviewedBy: null, reviewedAt: null, rejectionReason: null }).where(eq(advanceRequests.id, input.id));
      await db.insert(auditLogs).values({ entityType: "advanceRequest", entityId: input.id, action: "updated_resubmitted", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "حذف مستندات الموظفين متاح للمالك فقط" });
      const db = requireDb(await getDb());
      const [advance] = await db.select().from(advanceRequests).where(eq(advanceRequests.id, input.id)).limit(1);
      if (!advance) throw new TRPCError({ code: "NOT_FOUND", message: "طلب السلفة غير موجود" });
      const repayments = await db.select({ id: advanceRepayments.id }).from(advanceRepayments).where(eq(advanceRepayments.advanceRequestId, input.id));
      if (advance.status === "approved" || repayments.length) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا يمكن حذف سلفة معتمدة أو مرتبطة بجدولة خصم؛ حافظ على سجل الموظف واستخدم إجراء تصحيحيًا" });
      await db.delete(advanceRequests).where(eq(advanceRequests.id, input.id)); await db.insert(auditLogs).values({ entityType: "advanceRequest", entityId: input.id, action: "deleted", actorId: ctx.user.id }); return { success: true } as const;
    }),
    decide: protectedProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "اعتماد طلبات السلف متاح للمدير العام والمالك فقط" });
      if (input.decision === "rejected" && !input.note?.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب كتابة سبب الرفض" });
      const db = requireDb(await getDb());
      const [advance] = await db.select().from(advanceRequests).where(eq(advanceRequests.id, input.id)).limit(1);
      if (!advance) throw new TRPCError({ code: "NOT_FOUND", message: "طلب السلفة غير موجود" });
      await db.update(advanceRequests).set({ status: input.decision, reviewedBy: ctx.user.id, reviewedAt: new Date(), rejectionReason: input.decision === "rejected" ? input.note!.trim() : null }).where(eq(advanceRequests.id, input.id));
      if (input.decision === "approved" && advance.employeeId) {
        const existing = await db.select({ id: advanceRepayments.id }).from(advanceRepayments).where(eq(advanceRepayments.advanceRequestId, advance.id));
        if (!existing.length) {
          const schedule = buildAdvanceSchedule(Number(advance.amount || 0), advance.repaymentStartMonth || new Date().getUTCMonth() + 1, advance.repaymentStartYear || new Date().getUTCFullYear(), advance.installmentCount || 1);
          await db.insert(advanceRepayments).values(schedule.map((entry) => ({ advanceRequestId: advance.id, employeeId: advance.employeeId!, scheduledMonth: entry.scheduledMonth, scheduledYear: entry.scheduledYear, scheduledAmount: entry.scheduledAmount.toFixed(2), createdBy: ctx.user.id })));
        }
      }
      await db.insert(auditLogs).values({ entityType: "advanceRequest", entityId: input.id, action: input.decision, actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
  }),
  tasks: router({
    list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(dailyTasks).orderBy(dailyTasks.dueDate, dailyTasks.createdAt);
      const visibleRows = ctx.user.role === "admin" || ctx.user.role === "general_manager" ? rows : (() => {
        const email = ctx.user.email?.toLowerCase();
        return email ? rows : rows;
      })();
      const assignedIds = ctx.user.role === "admin" || ctx.user.role === "general_manager" ? null : (ctx.user.email ? (await db.select({ id: employees.id }).from(employees).where(eq(employees.email, ctx.user.email))).map((row) => row.id) : []);
      const scopedRows = assignedIds ? visibleRows.filter((task) => { let teamIds: number[] = []; try { teamIds = task.assignedEmployeeIds ? JSON.parse(task.assignedEmployeeIds) : []; } catch { teamIds = []; } return task.createdBy === ctx.user.id || (task.assignedEmployeeId ? assignedIds.includes(task.assignedEmployeeId) : false) || teamIds.some((id) => assignedIds.includes(id)); }) : visibleRows;
      return input?.projectId ? scopedRows.filter((task) => task.projectId === input.projectId || task.projectId === null) : scopedRows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().nullable().optional(), assignedEmployeeId: z.number().int().positive().nullable().optional(), assignedEmployeeIds: z.array(z.number().int().positive()).max(20).default([]), title: z.string().min(1), description: z.string().optional(), startDate: z.string().optional(), endDate: z.string().optional(), dueDate: z.string().optional(), progress: z.number().int().min(0).max(100).default(0), priority: z.enum(["low", "normal", "high"]).default("normal") })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (!canAssignTeamTasks(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN", message: "إسناد مهام الفريق متاح للمالك والمدير العام فقط" });
      await assertOperationPermission(db, ctx, "task_assignment");
      if (input.projectId) await assertProjectAccess(db, ctx, input.projectId);
      const teamIds = Array.from(new Set(input.assignedEmployeeIds.length ? input.assignedEmployeeIds : (input.assignedEmployeeId ? [input.assignedEmployeeId] : [])));
      const result = await db.insert(dailyTasks).values({ projectId: input.projectId ?? null, assignedEmployeeId: teamIds[0] ?? null, assignedEmployeeIds: JSON.stringify(teamIds), title: input.title, description: input.description || null, startDate: input.startDate ? new Date(input.startDate) : null, endDate: input.endDate ? new Date(input.endDate) : null, dueDate: input.dueDate ? new Date(input.dueDate) : null, progress: input.progress, priority: input.priority, createdBy: ctx.user.id });
      const taskId = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "daily_task", entityId: taskId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      await Promise.all(teamIds.map((employeeId) => notifyTaskAssignee(db, { employeeId, taskId, title: `تم إسناد مهمة جديدة: ${input.title}`, message: `تم إسناد مهمة جديدة إليك: ${input.title}${input.endDate ? ` — نهاية المهمة ${input.endDate}` : ""}.` })));
      return { id: taskId };
    }),
    sendReminder: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (!canAssignTeamTasks(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN", message: "إرسال تذكير المهمة متاح للمالك والمدير العام فقط" });
      const task = (await db.select().from(dailyTasks).where(eq(dailyTasks.id, input.id)).limit(1))[0];
      if (!task) throw new TRPCError({ code: "NOT_FOUND", message: "المهمة غير موجودة" });
      let teamIds: number[] = []; try { teamIds = task.assignedEmployeeIds ? JSON.parse(task.assignedEmployeeIds) : []; } catch { teamIds = []; }
      if (!teamIds.length && task.assignedEmployeeId) teamIds = [task.assignedEmployeeId];
      const team = teamIds.length ? await db.select({ id: employees.id, email: employees.email, fullName: employees.fullName }).from(employees).where(inArray(employees.id, teamIds)) : [];
      const recipients = team.filter((employee) => employee.email);
      if (!recipients.length) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يوجد بريد إلكتروني لمسؤولي المهمة" });
      await Promise.all(recipients.map((employee) => sendTaskReminderEmail({ to: employee.email!, recipientName: employee.fullName, ownerName: ctx.user.name, taskTitle: task.title, description: task.description, startDate: task.startDate?.toISOString().slice(0, 10), endDate: task.endDate?.toISOString().slice(0, 10), progress: task.progress, priority: task.priority })));
      await db.insert(auditLogs).values({ entityType: "daily_task", entityId: input.id, action: "reminder_sent", actorId: ctx.user.id, afterJson: JSON.stringify({ recipients: recipients.map((employee) => employee.id) }) });
      return { success: true, recipients: recipients.length } as const;
    }),
    updateStatus: protectedProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["open", "planned", "in_progress", "blocked", "review", "done", "cancelled"]), progress: z.number().int().min(0).max(100).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const task = (await db.select().from(dailyTasks).where(eq(dailyTasks.id, input.id)).limit(1))[0];
      if (!task) throw new TRPCError({ code: "NOT_FOUND", message: "المهمة غير موجودة" });
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") {
        const employee = ctx.user.email ? (await db.select({ id: employees.id }).from(employees).where(eq(employees.email, ctx.user.email)).limit(1))[0] : undefined;
        let teamIds: number[] = []; try { teamIds = task.assignedEmployeeIds ? JSON.parse(task.assignedEmployeeIds) : []; } catch { teamIds = []; } if (!employee || (task.assignedEmployeeId !== employee.id && !teamIds.includes(employee.id))) throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكنك تحديث مهمة غير مسندة إليك" });
      }
      await db.update(dailyTasks).set({ status: input.status, progress: input.progress ?? (input.status === "done" ? 100 : undefined), completedAt: input.status === "done" ? new Date() : null }).where(eq(dailyTasks.id, input.id));
      await db.insert(auditLogs).values({ entityType: "daily_task", entityId: input.id, action: "status_updated", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      await notifyTaskAssignee(db, { employeeId: task.assignedEmployeeId, taskId: input.id, title: `تحديث حالة المهمة: ${task.title}`, message: `تم تحديث حالة المهمة «${task.title}» إلى: ${input.status}.` });
      return { success: true } as const;
    }),
  }),
  users: router({
    list: adminProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, jobTitle: users.jobTitle, defaultProjectId: users.defaultProjectId, lastSignedIn: users.lastSignedIn }).from(users).orderBy(users.name);
    }),
    invitations: adminProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(userInvitations).orderBy(userInvitations.createdAt);
    }),
    invite: adminProcedure.input(z.object({ email: z.string().email(), name: z.string().trim().max(255).optional(), jobTitle: z.string().trim().min(2).max(255), role: z.enum(["user", "general_manager", "project_manager", "procurement_manager", "site_worker"]), projectId: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const pending = (await db.select({ id: userInvitations.id }).from(userInvitations).where(and(eq(userInvitations.email, input.email), eq(userInvitations.status, "pending"))).limit(1))[0];
      if (pending) throw new TRPCError({ code: "CONFLICT", message: "توجد دعوة معلقة لهذا البريد بالفعل" });
      const token = randomUUID().replaceAll("-", "");
      const expiresAt = new Date(Date.now() + 7 * 86400000);
      const result = await db.insert(userInvitations).values({ email: input.email, name: input.name || null, jobTitle: input.jobTitle, role: input.role, projectId: input.projectId || null, token, invitedBy: ctx.user.id, expiresAt });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "userInvitation", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      const invitationUrl = `${getAppUrl(ctx.req)}/accept-invitation?token=${encodeURIComponent(token)}`;
      let emailSent = false;
      let emailError: string | null = null;
      try {
        await sendInvitationEmail({ to: input.email, recipientName: input.name, jobTitle: input.jobTitle, role: input.role, invitationUrl, expiresAt });
        emailSent = true;
        await db.insert(auditLogs).values({ entityType: "userInvitation", entityId: id, action: "email_sent", actorId: ctx.user.id, afterJson: JSON.stringify({ to: input.email }) });
      } catch (error) {
        emailError = error instanceof Error ? error.message : "تعذر إرسال البريد";
        await db.insert(auditLogs).values({ entityType: "userInvitation", entityId: id, action: "email_failed", actorId: ctx.user.id, afterJson: JSON.stringify({ to: input.email, error: emailError.slice(0, 500) }) });
      }
      return { id, token, email: input.email, expiresAt, invitationUrl, emailSent, emailError } as const;
    }),
    cancelInvitation: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await db.update(userInvitations).set({ status: "cancelled" }).where(eq(userInvitations.id, input.id));
      await db.insert(auditLogs).values({ entityType: "userInvitation", entityId: input.id, action: "cancelled", actorId: ctx.user.id });
      return { success: true } as const;
    }),
    updateProfile: adminProcedure.input(z.object({ userId: z.number().int().positive(), jobTitle: z.string().trim().max(255).optional(), defaultProjectId: z.number().int().positive().nullable().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const target = (await db.select({ id: users.id, jobTitle: users.jobTitle, defaultProjectId: users.defaultProjectId }).from(users).where(eq(users.id, input.userId)).limit(1))[0];
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
      await db.update(users).set({ jobTitle: input.jobTitle || null, defaultProjectId: input.defaultProjectId ?? null }).where(eq(users.id, input.userId));
      await db.insert(auditLogs).values({ entityType: "user", entityId: input.userId, action: "profile_updated", actorId: ctx.user.id, beforeJson: JSON.stringify(target), afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
    updateRole: adminProcedure.input(z.object({ userId: z.number().int().positive(), role: z.enum(["admin", "user", "general_manager", "project_manager", "procurement_manager", "site_worker"]) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const target = (await db.select({ id: users.id, role: users.role, name: users.name }).from(users).where(eq(users.id, input.userId)).limit(1))[0];
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
      if (Number(target.id) === Number(ctx.user.id) && input.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكن للمالك سحب صلاحية حسابه" });
      await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
      await db.insert(auditLogs).values({ entityType: "user", entityId: input.userId, action: "role_updated", actorId: ctx.user.id, beforeJson: JSON.stringify({ role: target.role }), afterJson: JSON.stringify({ role: input.role }) });
      return { success: true, userId: input.userId, role: input.role } as const;
    }),
    operationPermissions: adminProcedure.input(z.object({ userId: z.number().int().positive() })).query(async ({ input }) => {
      const db = requireDb(await getDb());
      const user = (await db.select({ id: users.id, role: users.role }).from(users).where(eq(users.id, input.userId)).limit(1))[0];
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
      const rows = await db.select().from(userOperationPermissions).where(eq(userOperationPermissions.userId, input.userId));
      return { user, operations: operationCatalog.map((item) => ({ ...item, mode: user.role === "admin" ? "allow" as const : rows.find((row) => row.operationKey === item.key)?.mode ?? "approval" as const })) };
    }),
    saveOperationPermissions: adminProcedure.input(z.object({ userId: z.number().int().positive(), permissions: z.array(z.object({ operationKey, mode: z.enum(["allow", "approval", "deny"]) })) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const target = (await db.select({ id: users.id, role: users.role }).from(users).where(eq(users.id, input.userId)).limit(1))[0];
      if (!target) throw new TRPCError({ code: "NOT_FOUND", message: "المستخدم غير موجود" });
      if (target.role === "admin") throw new TRPCError({ code: "BAD_REQUEST", message: "حساب المسؤول له صلاحيات كاملة ولا يحتاج مصفوفة تشغيل" });
      await db.delete(userOperationPermissions).where(eq(userOperationPermissions.userId, input.userId));
      if (input.permissions.length) await db.insert(userOperationPermissions).values(input.permissions.map((permission) => ({ userId: input.userId, operationKey: permission.operationKey, mode: permission.mode, updatedBy: ctx.user.id })));
      await db.insert(auditLogs).values({ entityType: "userOperationPermissions", entityId: input.userId, action: "updated", actorId: ctx.user.id, afterJson: JSON.stringify(input.permissions) });
      return { success: true } as const;
    }),
  }),

  members: router({
    mine: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      return db.select().from(projectMembers).where(eq(projectMembers.userId, ctx.user.id));
    }),
    list: adminProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(projectMembers).orderBy(projectMembers.createdAt);
    }),
    assign: adminProcedure.input(z.object({ projectId: z.number().int().positive(), userId: z.number().int().positive(), projectRole: z.enum(["manager", "finance", "input", "reviewer", "viewer"]) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const result = await db.insert(projectMembers).values(input);
      await db.insert(auditLogs).values({ entityType: "projectMember", entityId: Number(result[0].insertId), action: "assigned", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id: Number(result[0].insertId) };
    }),
  }),

  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = await db.select().from(projects).orderBy(projects.createdAt);
      const companyRows = companyId ? rows.filter((row) => row.companyId === companyId) : [];
      return allowed ? companyRows.filter((row) => allowed.has(row.id)) : companyRows;
    }),
    create: protectedProcedure
      .input(z.object({
        code: z.string().trim().min(2).max(64),
        name: z.string().trim().min(2).max(255),
        location: z.string().trim().max(255).optional(),
        status: projectStatus.default("planning"),
        classification: projectClassification.default("operational"),
        projectType: projectType.default("general"),
        escrowCashAccountId: z.number().int().positive().nullable().optional(),
        escrowTrusteeName: z.string().trim().max(255).optional(),
        escrowStatementReference: z.string().trim().max(128).optional(),
        contractValue: z.number().nonnegative().default(0),
        plannedStart: z.string().optional(),
        plannedEnd: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role === "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "المدير العام يملك صلاحية الاطلاع والتقارير فقط ولا يمكنه إنشاء مشروع" });
        const db = requireDb(await getDb());
        const result = await db.insert(projects).values({
          ...input,
          escrowCashAccountId: input.projectType === "off_plan_sales" ? input.escrowCashAccountId || null : null,
          escrowTrusteeName: input.projectType === "off_plan_sales" ? input.escrowTrusteeName || null : null,
          escrowStatementReference: input.projectType === "off_plan_sales" ? input.escrowStatementReference || null : null,
          contractValue: input.contractValue.toFixed(2),
          location: input.location || null,
          plannedStart: input.plannedStart ? new Date(input.plannedStart) : null,
          plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null,
          createdBy: ctx.user.id,
        });
        const projectId = Number(result[0].insertId);
        const wipAccountId = await ensureProjectWipAccount(db, { id: projectId, code: input.code, name: input.name }, ctx.user.id);
        await db.insert(auditLogs).values({
          entityType: "project",
          entityId: projectId,
          action: "created",
          actorId: ctx.user.id,
          afterJson: JSON.stringify({ ...input, wipAccountId }),
        });
        return { id: projectId, wipAccountId };
      }),
    update: protectedProcedure
      .input(z.object({ id: z.number().int().positive(), code: z.string().trim().min(2).max(64), name: z.string().trim().min(2).max(255), location: z.string().trim().max(255).optional(), status: projectStatus, classification: projectClassification, projectType: projectType, escrowCashAccountId: z.number().int().positive().nullable().optional(), escrowTrusteeName: z.string().trim().max(255).optional(), escrowStatementReference: z.string().trim().max(128).optional(), contractValue: z.number().nonnegative(), plannedStart: z.string().optional(), plannedEnd: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role === "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "المدير العام يملك صلاحية الاطلاع والتقارير فقط ولا يمكنه تعديل المشروع" });
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.id);
        if (input.plannedStart && input.plannedEnd && new Date(input.plannedEnd) < new Date(input.plannedStart)) throw new TRPCError({ code: "BAD_REQUEST", message: "نهاية المشروع لا يمكن أن تسبق بدايته" });
        const before = (await db.select().from(projects).where(eq(projects.id, input.id)).limit(1))[0];
        if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
        await ensureProjectWipAccount(db, { id: input.id, code: input.code, name: input.name }, ctx.user.id);
          await db.update(projects).set({ code: input.code, name: input.name, location: input.location || null, status: input.status, classification: input.classification, projectType: input.projectType, escrowCashAccountId: input.projectType === "off_plan_sales" ? input.escrowCashAccountId || null : null, escrowTrusteeName: input.projectType === "off_plan_sales" ? input.escrowTrusteeName || null : null, escrowStatementReference: input.projectType === "off_plan_sales" ? input.escrowStatementReference || null : null, contractValue: input.contractValue.toFixed(2), plannedStart: input.plannedStart ? new Date(input.plannedStart) : null, plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null }).where(eq(projects.id, input.id));
        await db.insert(auditLogs).values({ entityType: "project", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
        return { success: true } as const;
      }),
    wipSummary: protectedProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.id);
      const project = (await db.select().from(projects).where(eq(projects.id, input.id)).limit(1))[0];
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
      const wipAccountId = project.wipAccountId || await ensureProjectWipAccount(db, { id: project.id, code: project.code, name: project.name }, ctx.user.id);
      const wipAccount = (await db.select({ code: accounts.code, name: accounts.name }).from(accounts).where(eq(accounts.id, wipAccountId)).limit(1))[0];
      const [documents, lines] = await Promise.all([
        db.select({ id: accountingDocuments.id, status: accountingDocuments.status }).from(accountingDocuments),
        db.select().from(accountingDocumentLines).where(and(eq(accountingDocumentLines.projectId, project.id), eq(accountingDocumentLines.accountId, wipAccountId))),
      ]);
      const posted = new Set(documents.filter((document) => document.status === "posted").map((document) => document.id));
      const postedLines = lines.filter((line) => posted.has(line.documentId));
      const totals = calculateWipBalance(postedLines);
      return { projectId: project.id, wipAccountId, wipAccountCode: wipAccount?.code || null, wipAccountName: wipAccount?.name || null, ...totals, closed: Boolean(project.wipClosedAt), closedAt: project.wipClosedAt, closingDocumentId: project.wipClosingDocumentId };
    }),
    closeWip: protectedProcedure.input(z.object({ id: z.number().int().positive(), destinationAccountId: z.number().int().positive(), handoverDate: z.string().min(1), note: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.id);
      await assertOperationPermission(db, ctx, "edit");
      if (ctx.user.role !== "admin" && Number(ctx.user.id) !== 13170001) throw new TRPCError({ code: "FORBIDDEN", message: "إقفال مشاريع تحت التنفيذ متاح للمالك أو المدير المالي المعتمد فقط" });
      const project = (await db.select().from(projects).where(eq(projects.id, input.id)).limit(1))[0];
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
      if (project.status !== "completed") throw new TRPCError({ code: "BAD_REQUEST", message: "غيّر حالة المشروع إلى مكتمل بعد التسليم قبل تنفيذ الإقفال" });
      if (project.wipClosedAt || project.wipClosingDocumentId) throw new TRPCError({ code: "CONFLICT", message: "تم إقفال مشاريع تحت التنفيذ لهذا المشروع مسبقًا" });
      const wipAccountId = project.wipAccountId || await ensureProjectWipAccount(db, { id: project.id, code: project.code, name: project.name }, ctx.user.id);
      if (input.destinationAccountId === wipAccountId) throw new TRPCError({ code: "BAD_REQUEST", message: "حساب التحويل يجب أن يختلف عن حساب مشاريع تحت التنفيذ" });
      const destination = (await db.select().from(accounts).where(eq(accounts.id, input.destinationAccountId)).limit(1))[0];
      if (!destination || destination.isActive !== 1 || destination.isPostable !== 1 || !["asset", "expense"].includes(destination.accountType)) throw new TRPCError({ code: "BAD_REQUEST", message: "حساب التحويل يجب أن يكون أصلًا أو تكلفة قابلًا للترحيل" });
      const [documents, lines] = await Promise.all([
        db.select({ id: accountingDocuments.id, status: accountingDocuments.status }).from(accountingDocuments),
        db.select().from(accountingDocumentLines).where(and(eq(accountingDocumentLines.projectId, project.id), eq(accountingDocumentLines.accountId, wipAccountId))),
      ]);
      const posted = new Set(documents.filter((document) => document.status === "posted").map((document) => document.id));
      const postedLines = lines.filter((line) => posted.has(line.documentId));
      const balance = calculateWipBalance(postedLines).balance;
      if (balance <= 0) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يوجد رصيد مدين مرحّل في مشاريع تحت التنفيذ لإقفاله" });
      const closingLines = buildWipClosingLines(balance, wipAccountId, input.destinationAccountId);
      const documentNumber = `WIP-CLOSE-${project.code}-${Date.now()}`.slice(0, 128);
      const documentResult = await db.insert(accountingDocuments).values({ projectId: project.id, documentType: "journal_entry", documentNumber, documentDate: new Date(input.handoverDate), amount: balance.toFixed(2), taxAmount: "0.00", totalAmount: balance.toFixed(2), paidAmount: "0.00", status: "posted", notes: input.note || `إقفال مشاريع تحت التنفيذ عند تسليم مشروع ${project.name}`, createdBy: ctx.user.id });
      const documentId = Number(documentResult[0].insertId);
      await db.insert(accountingDocumentLines).values([
        { documentId, accountId: closingLines[0].accountId, projectId: project.id, description: `تحويل تكلفة مشروع مكتمل — ${project.name}`, debit: closingLines[0].debit.toFixed(2), credit: closingLines[0].credit.toFixed(2) },
        { documentId, accountId: closingLines[1].accountId, projectId: project.id, description: `إقفال مشاريع تحت التنفيذ — ${project.name}`, debit: closingLines[1].debit.toFixed(2), credit: closingLines[1].credit.toFixed(2) },
      ]);
      await db.update(projects).set({ wipAccountId, wipClosedAt: new Date(input.handoverDate), wipClosedBy: ctx.user.id, wipClosingDocumentId: documentId }).where(eq(projects.id, project.id));
      await db.insert(auditLogs).values({ entityType: "project", entityId: project.id, action: "wip_closed_on_handover", actorId: ctx.user.id, afterJson: JSON.stringify({ wipAccountId, destinationAccountId: input.destinationAccountId, balance, documentId, handoverDate: input.handoverDate }) });
      return { success: true, documentId, balance } as const;
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const before = (await db.select().from(projects).where(eq(projects.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
      const [stageRows, expenseRows, payrollRows, certificateRows, contractRows, salesRows, collectionRows, memberRows, approvalRows, attachmentRows] = await Promise.all([
        db.select({ id: stages.id }).from(stages).where(eq(stages.projectId, input.id)),
        db.select({ id: expenses.id }).from(expenses).where(eq(expenses.projectId, input.id)),
        db.select({ id: payroll.id }).from(payroll).where(eq(payroll.projectId, input.id)),
        db.select({ id: certificates.id }).from(certificates).where(eq(certificates.projectId, input.id)),
        db.select({ id: contractorContracts.id }).from(contractorContracts).where(eq(contractorContracts.projectId, input.id)),
        db.select({ id: sales.id }).from(sales).where(eq(sales.projectId, input.id)),
        db.select({ id: collections.id }).from(collections).where(eq(collections.projectId, input.id)),
        db.select({ id: projectMembers.id }).from(projectMembers).where(eq(projectMembers.projectId, input.id)),
        db.select({ id: approvalRequests.id }).from(approvalRequests).where(eq(approvalRequests.projectId, input.id)),
        db.select({ id: attachments.id }).from(attachments).where(eq(attachments.projectId, input.id)),
      ]);
      const relatedCount = stageRows.length + expenseRows.length + payrollRows.length + certificateRows.length + contractRows.length + salesRows.length + collectionRows.length + memberRows.length + approvalRows.length + attachmentRows.length;
      if (relatedCount > 0) throw new TRPCError({ code: "CONFLICT", message: "لا يمكن حذف مشروع مرتبط بمراحل أو حركات أو مستندات. استخدم الأرشفة بدلًا من الحذف." });
      await db.delete(projects).where(eq(projects.id, input.id));
      await db.insert(auditLogs).values({ entityType: "project", entityId: input.id, action: "deleted", actorId: ctx.user.id, beforeJson: JSON.stringify(before) });
      return { success: true } as const;
    }),
  }),

  units: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(units).orderBy(units.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), code: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), type: z.string().max(128).optional(), listPrice: z.number().nonnegative() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const result = await db.insert(units).values({ projectId: input.projectId, code: input.code, name: input.name, type: input.type || null, listPrice: input.listPrice.toFixed(2), status: "available" });
        const unitId = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "unit", entityId: unitId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id: unitId };
      }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive(), code: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), type: z.string().max(128).optional(), listPrice: z.number().nonnegative(), status: z.enum(["available", "reserved", "sold", "cancelled"]).default("available") })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertOperationPermission(db, ctx, "edit");
      const before = (await db.select().from(units).where(eq(units.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "الوحدة غير موجودة" });
      await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId);
      await db.update(units).set({ projectId: input.projectId, code: input.code, name: input.name, type: input.type || null, listPrice: input.listPrice.toFixed(2), status: input.status }).where(eq(units.id, input.id));
      await db.insert(auditLogs).values({ entityType: "unit", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
      return { id: input.id } as const;
    }),
  }),

  budgets: router({
    list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const budgetRows = await db.select().from(projectBudgets).orderBy(projectBudgets.createdAt);
      const lineRows = await db.select().from(projectBudgetLines).orderBy(projectBudgetLines.sortOrder, projectBudgetLines.id);
      return budgetRows.filter((budget) => (!input?.projectId || budget.projectId === input.projectId) && (!allowed || allowed.has(budget.projectId))).map((budget) => ({ ...budget, lines: lineRows.filter((line) => line.budgetId === budget.id) }));
    }),
    save: protectedProcedure.input(z.object({
      projectId: z.number().int().positive(), budgetCode: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255),
      plannedRevenue: z.number().nonnegative(), plannedCost: z.number().nonnegative(), plannedTax: z.number().nonnegative(), plannedZakat: z.number().nonnegative(), plannedProfit: z.number(), notes: z.string().optional(),
      lines: z.array(z.object({ lineType: z.enum(["revenue", "cost", "tax", "zakat", "profit"]), code: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), amount: z.number().nonnegative(), stageId: z.number().int().positive().nullable().optional(), costItemId: z.number().int().positive().nullable().optional(), accountId: z.number().int().positive().nullable().optional(), taxBasis: z.enum(["pre_tax", "inclusive", "not_applicable"]).default("pre_tax"), source: z.string().max(64).default("user_import"), sortOrder: z.number().int().default(0), notes: z.string().optional() })).min(1),
    })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const existing = (await db.select().from(projectBudgets).where(eq(projectBudgets.budgetCode, input.budgetCode)).limit(1))[0];
      if (existing && existing.projectId !== input.projectId) throw new TRPCError({ code: "CONFLICT", message: "كود الموازنة مستخدم في مشروع آخر" });
      const budgetValues = { companyId: await resolveActiveCompanyId(db, ctx), projectId: input.projectId, budgetCode: input.budgetCode, name: input.name, plannedRevenue: input.plannedRevenue.toFixed(2), plannedCost: input.plannedCost.toFixed(2), plannedTax: input.plannedTax.toFixed(2), plannedZakat: input.plannedZakat.toFixed(2), plannedProfit: input.plannedProfit.toFixed(2), notes: input.notes || null, createdBy: ctx.user.id };
      let budgetId: number;
      if (existing) { budgetId = existing.id; await db.update(projectBudgets).set(budgetValues).where(eq(projectBudgets.id, existing.id)); await db.delete(projectBudgetLines).where(eq(projectBudgetLines.budgetId, existing.id)); }
      else { const inserted = await db.insert(projectBudgets).values(budgetValues); budgetId = Number(inserted[0].insertId); }
      await db.insert(projectBudgetLines).values(input.lines.map((line) => ({ ...line, budgetId, projectId: input.projectId, stageId: line.stageId ?? null, costItemId: line.costItemId ?? null, accountId: line.accountId ?? null, amount: line.amount.toFixed(2), createdBy: ctx.user.id })));
      await db.insert(auditLogs).values({ entityType: "project_budget", entityId: budgetId, action: existing ? "updated" : "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id: budgetId } as const;
    }),
    detail: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const budget = (await db.select().from(projectBudgets).where(eq(projectBudgets.projectId, input.projectId)).orderBy(projectBudgets.createdAt).limit(1))[0] ?? null;
      if (!budget) return null;
      const lines = await db.select().from(projectBudgetLines).where(eq(projectBudgetLines.budgetId, budget.id)).orderBy(projectBudgetLines.sortOrder, projectBudgetLines.id);
      return { ...budget, lines };
    }),
  }),

  stages: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(stages).orderBy(stages.createdAt);
      const certificateRows = await db.select().from(certificates);
      const visibleRows = allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
      return visibleRows.map((row) => {
        const approvedCertificates = certificateRows.filter((certificate) => certificate.stageId === row.id && Boolean(certificate.vendorId || certificate.contractId) && ["approved", "paid"].includes(certificate.status));
        const progress = calculateCertificateProgress({ plannedBudget: Number(row.plannedBudget || 0), certifiedAmounts: approvedCertificates.map((certificate) => certificate.totalAmount) });
        return {
          ...row,
          certifiedAmount: progress.certifiedAmount,
          certificateCount: approvedCertificates.length,
          certificateProgressPct: progress.progressPct,
          progressSource: approvedCertificates.length > 0 ? "contractor_certificates" as const : "manual" as const,
        };
      });
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), code: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), plannedBudget: z.number().nonnegative(), plannedBudgetTaxBasis: z.enum(["pre_tax", "inclusive"]).default("pre_tax"), budgetParentCostItemId: z.number().int().positive().nullable().optional(), plannedStart: z.string().optional(), plannedEnd: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        if (input.budgetParentCostItemId) {
          const parent = (await db.select().from(costItems).where(eq(costItems.id, input.budgetParentCostItemId)).limit(1))[0];
          if (!parent || !parent.isActive || (parent.projectId && parent.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر حسابًا أبًا نشطًا ومتاحًا للمشروع" });
        }
        const result = await db.insert(stages).values({ projectId: input.projectId, code: input.code, name: input.name, plannedBudget: input.plannedBudget.toFixed(2), plannedBudgetTaxBasis: input.plannedBudgetTaxBasis, budgetParentCostItemId: input.budgetParentCostItemId ?? null, plannedStart: input.plannedStart ? new Date(input.plannedStart) : null, plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null, actualProgress: "0", status: "planned" });
        const stageId = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "stage", entityId: stageId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id: stageId };
      }),
    updateSchedule: protectedProcedure
      .input(z.object({ id: z.number().int().positive(), code: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), plannedBudget: z.number().nonnegative(), plannedBudgetTaxBasis: z.enum(["pre_tax", "inclusive"]).default("pre_tax"), budgetParentCostItemId: z.number().int().positive().nullable().optional(), plannedStart: z.string().optional(), plannedEnd: z.string().optional(), actualProgress: z.number().min(0).max(100), status: z.enum(["planned", "active", "completed", "delayed"]) }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const before = (await db.select().from(stages).where(eq(stages.id, input.id)).limit(1))[0];
        if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المرحلة غير موجودة" });
        await assertProjectAccess(db, ctx, before.projectId);
        if (input.plannedStart && input.plannedEnd && new Date(input.plannedEnd) < new Date(input.plannedStart)) throw new TRPCError({ code: "BAD_REQUEST", message: "نهاية المرحلة لا يمكن أن تسبق بدايتها" });
        if (input.budgetParentCostItemId) {
          const parent = (await db.select().from(costItems).where(eq(costItems.id, input.budgetParentCostItemId)).limit(1))[0];
          if (!parent || !parent.isActive || (parent.projectId && parent.projectId !== before.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر حسابًا أبًا نشطًا ومتاحًا للمشروع" });
        }
        await db.update(stages).set({ code: input.code, name: input.name, plannedBudget: input.plannedBudget.toFixed(2), plannedBudgetTaxBasis: input.plannedBudgetTaxBasis, budgetParentCostItemId: input.budgetParentCostItemId ?? null, plannedStart: input.plannedStart ? new Date(input.plannedStart) : null, plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null, actualProgress: input.actualProgress.toFixed(2), status: input.status }).where(eq(stages.id, input.id));
        await db.insert(auditLogs).values({ entityType: "stage", entityId: input.id, action: "schedule_updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
        return { success: true } as const;
      }),
    updateProgress: protectedProcedure
      .input(z.object({ id: z.number().int().positive(), actualProgress: z.number().min(0).max(100), status: z.enum(["planned", "active", "completed", "delayed"]).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const stage = (await db.select().from(stages).where(eq(stages.id, input.id)).limit(1))[0];
        if (!stage) throw new TRPCError({ code: "NOT_FOUND", message: "المرحلة غير موجودة" });
        await assertProjectAccess(db, ctx, stage.projectId);
        const status = input.status || (input.actualProgress >= 100 ? "completed" : input.actualProgress > 0 ? "active" : "planned");
        await db.update(stages).set({ actualProgress: input.actualProgress.toFixed(2), status }).where(eq(stages.id, input.id));
        await db.insert(auditLogs).values({ entityType: "stage", entityId: input.id, action: "progress_updated", actorId: ctx.user.id, afterJson: JSON.stringify({ actualProgress: input.actualProgress, status }) });
        return { success: true } as const;
      }),
  }),

  projectWorkLocations: router({
    list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), locationType: z.enum(["project", "administrative_office"]).optional() }).optional()).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const locationType = input?.locationType;
      if (input?.projectId) {
        await assertProjectAccess(db, ctx, input.projectId);
        return db.select().from(projectWorkLocations).where(and(eq(projectWorkLocations.projectId, input.projectId), ...(locationType ? [eq(projectWorkLocations.locationType, locationType)] : []))).orderBy(projectWorkLocations.createdAt);
      }
      if (locationType === "administrative_office") {
        const companyId = await resolveActiveCompanyId(db, ctx);
        return companyId ? db.select().from(projectWorkLocations).where(and(eq(projectWorkLocations.companyId, companyId), eq(projectWorkLocations.locationType, "administrative_office"))).orderBy(projectWorkLocations.createdAt) : [];
      }
      return [];
    }),
    create: protectedProcedure.input(z.object({ locationType: z.enum(["project", "administrative_office"]).default("project"), projectId: z.number().int().positive().optional(), companyId: z.number().int().positive().optional(), name: z.string().trim().min(2).max(255), latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), allowedRadiusMeters: z.number().positive().max(10000).default(150) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.locationType === "project") {
        if (!input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "موقع المشروع يتطلب اختيار المشروع" });
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
      }
      const companyId = input.companyId ?? await resolveActiveCompanyId(db, ctx);
      if (input.locationType === "administrative_office" && !companyId) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد شركة نشطة لربط المكتب الإداري" });
      const result = await db.insert(projectWorkLocations).values({ companyId: companyId ?? null, projectId: input.projectId ?? null, locationType: input.locationType, name: input.name, latitude: input.latitude.toFixed(7), longitude: input.longitude.toFixed(7), allowedRadiusMeters: input.allowedRadiusMeters.toFixed(2), isActive: true, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "projectWorkLocation", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), name: z.string().trim().min(2).max(255), latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), allowedRadiusMeters: z.number().positive().max(10000), isActive: z.boolean() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const current = (await db.select().from(projectWorkLocations).where(eq(projectWorkLocations.id, input.id)).limit(1))[0];
      if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "موقع العمل غير موجود" });
      if (current.projectId) { await assertProjectAccess(db, ctx, current.projectId); await assertProjectWrite(db, ctx, current.projectId); }
      else if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "تعديل موقع المكتب الإداري متاح للإدارة فقط" });
      await db.update(projectWorkLocations).set({ name: input.name, latitude: input.latitude.toFixed(7), longitude: input.longitude.toFixed(7), allowedRadiusMeters: input.allowedRadiusMeters.toFixed(2), isActive: input.isActive }).where(eq(projectWorkLocations.id, input.id));
      await db.insert(auditLogs).values({ entityType: "projectWorkLocation", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(current), afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const current = (await db.select().from(projectWorkLocations).where(eq(projectWorkLocations.id, input.id)).limit(1))[0];
      if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "موقع العمل غير موجود" });
      if (current.projectId) await assertProjectAccess(db, ctx, current.projectId);
      else if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "الوصول إلى موقع المكتب الإداري متاح للإدارة فقط" });
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "حذف موقع العمل متاح للمالك فقط" });
      await db.delete(projectWorkLocations).where(eq(projectWorkLocations.id, input.id));
      await db.insert(auditLogs).values({ entityType: "projectWorkLocation", entityId: input.id, action: "deleted", actorId: ctx.user.id, beforeJson: JSON.stringify(current) });
      return { success: true } as const;
    }),
  }),

  dashboard: router({
    summary: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const activeCompanyId = await resolveActiveCompanyId(db, ctx);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const [allProjectRows, stageRows, expenseRows, collectionRows, approvalRows, attachmentRows, salesRows, payrollRows, vendorRows, certificateRows, administrativePayrollRows, payrollAllocationRows, inventoryMovementRows, accountingDocumentRows, accountingLineRows, projectBudgetRows] = await Promise.all([
        db.select().from(projects),
        db.select().from(stages),
        db.select().from(expenses),
        db.select().from(collections),
        db.select().from(approvalRequests),
        db.select().from(attachments),
        db.select().from(sales),
        db.select().from(payroll),
        db.select().from(vendors),
        db.select().from(certificates),
        db.select().from(administrativePayroll),
        db.select().from(payrollAllocations),
        db.select().from(inventoryMovements),
        db.select({ id: accountingDocuments.id, status: accountingDocuments.status }).from(accountingDocuments),
        db.select().from(accountingDocumentLines),
        db.select().from(projectBudgets),
      ]);
      const postedAccountingDocumentIds = new Set(accountingDocumentRows.filter((document) => document.status === "posted").map((document) => document.id));
      const projectRows = allProjectRows.filter((row) => (!activeCompanyId || row.companyId === activeCompanyId) && (!allowed || allowed.has(row.id)));
      const summary = projectRows.map((project) => {
        const projectStages = stageRows.filter((stage) => stage.projectId === project.id);
        const wipLines = accountingLineRows.filter((line) => line.projectId === project.id && project.wipAccountId && line.accountId === project.wipAccountId && postedAccountingDocumentIds.has(line.documentId));
        const wipTotals = calculateWipBalance(wipLines);
        const projectExpenses = expenseRows.filter((expense) => expense.projectId === project.id && expense.classification !== "administrative" && ["approved", "posted"].includes(expense.status));
        const projectCollections = collectionRows.filter((collection) => collection.projectId === project.id && collection.status === "received");
        const projectSales = salesRows.filter((sale) => sale.projectId === project.id && sale.status === "confirmed");
        const projectPayroll = payrollRows.filter((row) => row.projectId === project.id && row.classification !== "administrative" && ["approved", "posted"].includes(row.status));
        const administrativePayrollIds = new Set(administrativePayrollRows.filter((row) => ["approved", "paid"].includes(row.status)).map((row) => row.id));
        const projectAdministrativePayroll = payrollAllocationRows.filter((row) => row.projectId === project.id && administrativePayrollIds.has(row.administrativePayrollId));
        const projectApprovals = approvalRows.filter((approval) => approval.projectId === project.id && approval.status === "pending");
        const projectVendors = vendorRows.filter((vendor) => vendor.projectId === null || vendor.projectId === project.id);
        const projectAttachments = attachmentRows.filter((attachment) => attachment.projectId === project.id);
        const documentCompleteness = calculateDocumentCompleteness({ vendors: projectVendors, attachments: projectAttachments });
        const projectCertificates = certificateRows.filter((certificate) => certificate.projectId === project.id && Boolean(certificate.vendorId || certificate.contractId) && certificate.status !== "rejected");
        const projectInventoryIssues = inventoryMovementRows.filter((movement) => movement.projectId === project.id && movement.status === "posted" && (movement.movementType === "issue" || movement.movementType === "adjustment_out"));
        const inventoryIssuedTotal = projectInventoryIssues.reduce((sum, movement) => sum + Number(movement.totalAmount || 0), 0);
        const subcontractorCostsTotal = projectCertificates.reduce((sum, certificate) => sum + Number(certificate.totalAmount || 0), 0);
        const subcontractorCostsPaid = projectCertificates.reduce((sum, certificate) => sum + Number(certificate.paidAmount || 0), 0);
        const subcontractorCostsOutstanding = Math.max(subcontractorCostsTotal - subcontractorCostsPaid, 0);
        const missingCertificateDocuments = projectCertificates.filter((certificate) => !certificate.vendorId || !projectAttachments.some((attachment) => attachment.entityType === "certificate" && attachment.entityId === certificate.id)).length;
        const paymentRequests = approvalRows.filter((approval) => approval.projectId === project.id && ["expense", "collection"].includes(approval.entityType));
        const missingPaymentDocuments = paymentRequests.filter((request) => !projectAttachments.some((attachment) => attachment.entityType === request.entityType && attachment.entityId === request.entityId)).length;
        const now = new Date();
        const approvalSlaMs = 3 * 24 * 60 * 60 * 1000;
        const overdueApprovals = projectApprovals.filter((approval) => approval.createdAt && now.getTime() - new Date(approval.createdAt).getTime() > approvalSlaMs).length;
        const overdueStages = projectStages.filter((stage) => stage.status !== "completed" && stage.plannedEnd && new Date(stage.plannedEnd) < now);
        const projectTime = calculateStageTimeVariance(project.plannedEnd, project.status, now);
        const projectDurationDays = project.plannedStart && project.plannedEnd ? Math.max(1, Math.ceil((new Date(project.plannedEnd).getTime() - new Date(project.plannedStart).getTime()) / 86400000)) : 0;
        const timeline = projectStages.reduce((acc, stage) => {
          const weight = Number(stage.plannedBudget || 0) || 1;
          const actualRatio = Math.min(1, Math.max(0, Number(stage.actualProgress || (stage.status === "completed" ? 100 : 0)) / 100));
          let expectedRatio = 0;
          if (stage.plannedStart && stage.plannedEnd) {
            const start = new Date(stage.plannedStart).getTime();
            const end = new Date(stage.plannedEnd).getTime();
            expectedRatio = end > start ? Math.min(1, Math.max(0, (now.getTime() - start) / (end - start))) : 0;
          }
          return { weight: acc.weight + weight, actual: acc.actual + actualRatio * weight, expected: acc.expected + expectedRatio * weight };
        }, { weight: 0, actual: 0, expected: 0 });
        const completedStageCount = projectStages.filter((stage) => stage.status === "completed" || Number(stage.actualProgress || 0) >= 100).length;
        const progress = projectStages.length ? Math.round((completedStageCount / projectStages.length) * 100) : 0;
        const expectedScheduleProgress = timeline.weight ? Math.round((timeline.expected / timeline.weight) * 100) : 0;
        const scheduleVariancePct = projectTime.timeVarianceDays > 0 && projectDurationDays > 0 ? Math.round((projectTime.timeVarianceDays / projectDurationDays) * 100) : 0;
        const projectBudget = projectBudgetRows.find((budget) => budget.projectId === project.id && budget.status !== "draft") ?? null;
        const planned = projectBudget ? Number(projectBudget.plannedCost || 0) : projectStages.reduce((sum, stage) => sum + Number(stage.plannedBudget || 0), 0);
        const activeStage = [...projectStages].sort((a, b) => (a.plannedStart ? new Date(a.plannedStart).getTime() : Number.MAX_SAFE_INTEGER) - (b.plannedStart ? new Date(b.plannedStart).getTime() : Number.MAX_SAFE_INTEGER)).find((stage) => stage.status !== "completed" && Number(stage.actualProgress || 0) < 100) ?? null;
        const administrativeExpenseRows = expenseRows.filter((expense) => expense.projectId === project.id && ["approved", "posted"].includes(expense.status) && (expense.classification === "administrative" || expense.expenseType === "administrative"));
        const materialsExpenseRows = projectExpenses.filter((expense) => expense.classification !== "administrative" && expense.expenseType === "materials");
        const operationalExpenseRows = projectExpenses.filter((expense) => expense.classification !== "administrative" && expense.expenseType !== "administrative" && expense.expenseType !== "materials");
        const materialsExpensesTotal = materialsExpenseRows.reduce((sum, expense) => sum + Number(expense.totalAmount || 0), 0);
        const operationalExpensesTotal = operationalExpenseRows.reduce((sum, expense) => sum + Number(expense.totalAmount || 0), 0);
        const administrativeExpensesTotal = administrativeExpenseRows.reduce((sum, expense) => sum + Number(expense.totalAmount || 0), 0);
        const projectExpensesPreTax = projectExpenses.reduce((sum, expense) => sum + Number(expense.preTaxAmount || 0), 0);
        const projectExpensesWithTax = projectExpenses.reduce((sum, expense) => sum + Number(expense.totalAmount || 0), 0);
        const administrativeExpensesPreTax = administrativeExpenseRows.reduce((sum, expense) => sum + Number(expense.preTaxAmount || 0), 0);
        const financialTotals = calculateFinancialSummaryTotals({ sales: projectSales, collections: projectCollections, expenses: projectExpenses, payroll: [...projectPayroll, ...projectAdministrativePayroll.map((row) => ({ preTaxAmount: row.allocatedAmount, totalAmount: row.allocatedAmount, paidAmount: "0", status: "approved" as const }))] });
        const actual = financialTotals.expensesTotal + financialTotals.payrollTotal + subcontractorCostsTotal + inventoryIssuedTotal;
        const paid = financialTotals.expensesPaid + financialTotals.payrollPaid + subcontractorCostsPaid;
        const collectionsReceived = financialTotals.collectionsReceived;
        const recognizedRevenue = financialTotals.revenue;
        const payrollOutstanding = financialTotals.payrollOutstanding;
        const cashGap = Math.max(paid - collectionsReceived, 0);
        const budgetUsage = planned ? Math.round((actual / planned) * 100) : 0;
        const delayedStages = projectStages.filter((stage) => stage.status === "delayed").length + overdueStages.length;
        const activeStagePlannedBudget = activeStage ? Number(activeStage.plannedBudget || 0) : 0;
        const activeStageActualCost = activeStage ? projectExpenses.filter((expense) => expense.stageId === activeStage.id).reduce((sum, expense) => sum + Number(expense.totalAmount || 0), 0) + projectPayroll.filter((row) => row.stageId === activeStage.id).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) + projectCertificates.filter((certificate) => certificate.stageId === activeStage.id && Boolean(certificate.vendorId || certificate.contractId)).reduce((sum, certificate) => sum + Number(certificate.totalAmount || 0), 0) + projectInventoryIssues.filter((movement) => movement.stageId === activeStage.id).reduce((sum, movement) => sum + Number(movement.totalAmount || 0), 0) : 0;
        const status = projectHealthStatus({ budgetUsage, progress, delayedStages, cashGapRatio: actual ? cashGap / actual : 0, pendingApprovals: projectApprovals.length, overdueApprovals, scheduleVariancePct });
        const reasons = projectHealthReasons({ budgetUsage, progress, delayedStages, cashGap, pendingApprovals: projectApprovals.length, overdueApprovals, scheduleVariancePct });
        return {
          project,
          wipDebit: wipTotals.debit,
          wipCredit: wipTotals.credit,
          wipBalance: wipTotals.balance,
          wipClosed: Boolean(project.wipClosedAt),
          plannedBudget: planned,
          plannedRevenue: projectBudget ? Number(projectBudget.plannedRevenue || 0) : 0,
          plannedZakat: projectBudget ? Number(projectBudget.plannedZakat || 0) : 0,
          plannedProfit: projectBudget ? Number(projectBudget.plannedProfit || 0) : 0,
          actualCost: actual,
          paidCost: paid,
          outstandingCost: Math.max(actual - paid, 0),
          collectionsReceived,
          recognizedRevenue,
           payrollOutstanding,
           subcontractorCostsTotal,
           subcontractorCostsPaid,
           subcontractorCostsOutstanding,
           inventoryIssuedTotal,
           materialsExpensesTotal,
           operationalExpensesTotal,
           administrativeExpensesTotal,
           projectExpensesPreTax,
           projectExpensesWithTax,
           administrativeExpensesPreTax,
           payrollTotal: financialTotals.payrollTotal,
           totalExpenses: materialsExpensesTotal + operationalExpensesTotal + administrativeExpensesTotal + financialTotals.payrollTotal + subcontractorCostsTotal + inventoryIssuedTotal,
           cashGap,
          pendingApprovals: projectApprovals.length,
          overdueApprovals,
          expectedScheduleProgress,
          scheduleVariancePct,
          projectTimeVarianceDays: projectTime.timeVarianceDays,
          projectTimeStatus: projectTime.timeStatus,
          progress,
          stageCount: projectStages.length,
          budgetUsage,
          status,
          reasons,
          delayedStages,
          missingDocumentCount: documentCompleteness.missing.length + missingCertificateDocuments + missingPaymentDocuments,
          activeStage: activeStage ? { id: activeStage.id, code: activeStage.code, name: activeStage.name, status: activeStage.status, plannedStart: activeStage.plannedStart, plannedEnd: activeStage.plannedEnd, actualProgress: Number(activeStage.actualProgress || 0), plannedBudget: activeStagePlannedBudget, actualCost: activeStageActualCost } : null,
        };
      });
      for (const item of summary) {
        const triggers = projectNotificationTriggers({ projectName: item.project.name, pendingApprovals: item.pendingApprovals, overdueApprovals: item.overdueApprovals, scheduleVariancePct: item.scheduleVariancePct, budgetUsage: item.budgetUsage, cashGap: item.cashGap, hasAttachments: attachmentRows.some((attachment) => attachment.projectId === item.project.id), missingDocumentCount: item.missingDocumentCount });
        for (const trigger of triggers) await notifyOnce(db, ctx.user.id, trigger.type, trigger.title, trigger.message);
      }
      return summary;
    }),
    sendProjectAlert: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), message: z.string().trim().min(2).max(2000) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "إرسال تنبيهات المشاريع متاح للمدير العام والمالك فقط" });
      const project = (await db.select({ id: projects.id, name: projects.name, companyId: projects.companyId }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0];
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
      const activeCompanyId = await resolveActiveCompanyId(db, ctx);
      if (activeCompanyId && project.companyId !== activeCompanyId) throw new TRPCError({ code: "FORBIDDEN", message: "المشروع لا يتبع الشركة النشطة" });
      const managers = await db.select({ id: users.id, name: users.name, email: users.email }).from(projectMembers).innerJoin(users, eq(projectMembers.userId, users.id)).where(and(eq(projectMembers.projectId, input.projectId), eq(projectMembers.projectRole, "manager")));
      const recipients = managers.filter((manager) => manager.id !== ctx.user.id);
      if (!recipients.length) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يوجد مدير مشروع مسند إلى هذا المشروع" });
      const title = `تنبيه سريع بخصوص مشروع ${project.name}`;
      await Promise.all(recipients.map(async (recipient) => {
        await db.insert(notifications).values({ userId: recipient.id, type: "project_manager_alert", title, message: input.message });
        if (recipient.email) {
          try { await sendApprovalEmail({ to: recipient.email, recipientName: recipient.name, title, message: input.message, approvalUrl: `${getAppUrl()}/projects/${project.id}` }); } catch (error) { console.warn("[ProjectAlert] email failed", error); }
        }
      }));
      await db.insert(auditLogs).values({ entityType: "project", entityId: project.id, action: "manager_alert_sent", actorId: ctx.user.id, afterJson: JSON.stringify({ recipients: recipients.map((recipient) => recipient.id), message: input.message }) });
      return { success: true, recipientCount: recipients.length } as const;
    }),
    companySummary: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const [projectRows, expenseRows, payrollRows, administrativePayrollRows, allocationRows, salesRows, certificateRows, inventoryRows, voucherRows] = await Promise.all([
        db.select().from(projects), db.select().from(expenses), db.select().from(payroll), db.select().from(administrativePayroll), db.select().from(payrollAllocations), db.select().from(sales), db.select().from(certificates), db.select().from(inventoryMovements), db.select().from(accountingDocuments).where(eq(accountingDocuments.documentType, "payment_voucher")),
      ]);
      const visibleProjects = projectRows.filter((project) => !allowed || allowed.has(project.id));
      const activeProjects = visibleProjects.filter((project) => project.status !== "archived" && Number(project.contractValue || 0) > 0);
      const approved = (status: string) => ["approved", "posted", "paid"].includes(status);
      const visibleProjectIds = new Set(visibleProjects.map((project) => project.id));
      const postedVouchers = voucherRows.filter((row) => row.status === "posted");
      const projectVoucherCosts = postedVouchers.filter((row) => row.projectId !== null && visibleProjectIds.has(row.projectId) && ["materials", "contractor", "operating", "payroll"].includes(row.voucherCategory || "")).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const projectExpenses = expenseRows.filter((row) => row.projectId !== null && visibleProjectIds.has(row.projectId) && row.classification !== "administrative" && approved(row.status)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const projectPayroll = payrollRows.filter((row) => row.projectId !== null && visibleProjectIds.has(row.projectId) && row.classification !== "administrative" && approved(row.status)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const subcontractorCosts = certificateRows.filter((row) => visibleProjectIds.has(row.projectId) && Boolean(row.vendorId || row.contractId) && row.status !== "rejected").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const inventoryCosts = inventoryRows.filter((row) => row.projectId !== null && visibleProjectIds.has(row.projectId) && row.status === "posted" && ["issue", "adjustment_out"].includes(row.movementType)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const projectRevenue = salesRows.filter((row) => visibleProjectIds.has(row.projectId) && row.status === "confirmed").reduce((sum, row) => sum + Number(row.recognizedRevenue || 0), 0);
      const companyExpenses = expenseRows.filter((row) => row.projectId === null && ["administrative", "general_cash", "petty_cash"].includes(row.classification) && approved(row.status));
      const administrativeExpenses = companyExpenses.filter((row) => row.classification === "administrative").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) + postedVouchers.filter((row) => row.projectId === null && row.voucherCategory === "administrative").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const pettyCashExpenses = companyExpenses.filter((row) => ["general_cash", "petty_cash"].includes(row.classification)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) + postedVouchers.filter((row) => row.projectId === null && row.voucherCategory === "petty_cash").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const legacyAdministrativePayroll = payrollRows.filter((row) => row.projectId === null && row.classification === "administrative" && approved(row.status)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const administrativePayrollTotal = administrativePayrollRows.filter((row: typeof administrativePayrollRows[number]) => ["approved", "paid"].includes(row.status)).reduce((sum: number, row: typeof administrativePayrollRows[number]) => sum + Number(row.totalAmount || 0), 0) + legacyAdministrativePayroll + postedVouchers.filter((row) => row.projectId === null && row.voucherCategory === "payroll").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const sharedTotal = administrativeExpenses + pettyCashExpenses + administrativePayrollTotal;
      const allocation = allocateAdministrativeAmount(sharedTotal, activeProjects.map((project) => ({ projectId: project.id, projectName: project.name, contractValue: Number(project.contractValue || 0) }))).map((item) => ({ ...item, administrativeExpenses: administrativeExpenses * item.ratio, pettyCashExpenses: pettyCashExpenses * item.ratio, administrativePayroll: administrativePayrollTotal * item.ratio }));
      return { projectCosts: projectExpenses + projectPayroll + projectVoucherCosts + subcontractorCosts + inventoryCosts, projectRevenue, administrativeExpenses, pettyCashExpenses, administrativePayroll: administrativePayrollTotal, sharedTotal, activeProjects: allocation, allocationBasis: "contract_value" as const };
    }),
  }),

  costItems: router({
    list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ input }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(costItems).where(eq(costItems.isActive, 1)).orderBy(costItems.code);
      return input?.projectId ? rows.filter((row) => row.projectId === null || row.projectId === input.projectId) : rows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), parentId: z.number().int().positive().optional(), accountId: z.number().int().positive().optional(), code: z.string().trim().min(1).max(32), name: z.string().trim().min(2).max(255), category: z.string().trim().min(2).max(64) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.projectId) await assertProjectWrite(db, ctx, input.projectId);
      const duplicate = await db.select({ id: costItems.id }).from(costItems).where(eq(costItems.code, input.code)).limit(1);
      if (duplicate.length) throw new TRPCError({ code: "CONFLICT", message: "كود بند التكلفة مستخدم بالفعل، اختر كودًا مختلفًا" });
      if (input.parentId) {
        const parent = (await db.select().from(costItems).where(eq(costItems.id, input.parentId)).limit(1))[0];
        if (!parent || !parent.isActive || (input.projectId && parent.projectId && parent.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر بطاقة تكلفة رئيسية متاحة للمشروع" });
      }
      if (input.accountId) {
        const account = (await db.select().from(accounts).where(eq(accounts.id, input.accountId)).limit(1))[0];
        if (!account || !account.isActive || account.accountType !== "expense") throw new TRPCError({ code: "BAD_REQUEST", message: "اختر حساب مصروف نشطًا من الشجرة المحاسبية" });
      }
      const result = await db.insert(costItems).values({ projectId: input.projectId || null, parentId: input.parentId || null, accountId: input.accountId || null, code: input.code, name: input.name, category: input.category, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "costItem", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), code: z.string().trim().min(1).max(32), name: z.string().trim().min(2).max(255), category: z.string().trim().min(2).max(64), parentId: z.number().int().positive().nullable().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const existing = (await db.select().from(costItems).where(eq(costItems.id, input.id)).limit(1))[0];
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "بطاقة التكلفة غير موجودة" });
      if (existing.projectId) await assertProjectWrite(db, ctx, existing.projectId);
      if (input.parentId === input.id) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن أن يكون بند التكلفة أبًا لنفسه" });
      await db.update(costItems).set({ code: input.code, name: input.name, category: input.category, parentId: input.parentId ?? null }).where(eq(costItems.id, input.id));
      await db.insert(auditLogs).values({ entityType: "costItem", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(existing), afterJson: JSON.stringify(input) });
      return { id: input.id };
    }),
    deactivate: protectedProcedure.input(z.object({ id: z.number().int().positive(), active: z.boolean() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (!input.active) {
        const used = await db.select({ id: accountingDocumentLines.id }).from(accountingDocumentLines).where(eq(accountingDocumentLines.costItemId, input.id)).limit(1);
        if (used.length) throw new TRPCError({ code: "CONFLICT", message: "لا يمكن تعطيل بطاقة مستخدمة في قيود؛ عدّل اسمها بدلًا من حذفها" });
      }
      await db.update(costItems).set({ isActive: input.active ? 1 : 0 }).where(eq(costItems.id, input.id));
      await db.insert(auditLogs).values({ entityType: "costItem", entityId: input.id, action: input.active ? "activated" : "deactivated", actorId: ctx.user.id });
      return { id: input.id };
    }),
  }),
  complianceDocuments: router({
    list: protectedProcedure.input(z.object({ search: z.string().max(255).optional(), scope: z.enum(["all", "company", "employee"]).optional(), status: z.enum(["all", "active", "archived"]).optional(), employeeId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() }).optional()).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const [rows, employeeRows] = await Promise.all([db.select().from(complianceDocuments), db.select({ id: employees.id, fullName: employees.fullName, employeeCode: employees.employeeCode }).from(employees)]);
      const employeeMap = new Map(employeeRows.map((employee) => [employee.id, employee]));
      const query = input?.search?.trim().toLowerCase() || "";
      return rows.filter((row) => (!companyId || row.companyId === companyId) && (!input?.scope || input.scope === "all" || row.documentScope === input.scope) && (!input?.status || input.status === "all" || row.status === input.status) && (!input?.employeeId || row.employeeId === input.employeeId) && (!input?.from || String(row.expiryDate).slice(0, 10) >= input.from) && (!input?.to || String(row.expiryDate).slice(0, 10) <= input.to) && (!query || `${row.title} ${row.documentType} ${row.referenceNumber || ""} ${employeeMap.get(row.employeeId || 0)?.fullName || ""}`.toLowerCase().includes(query))).map((row) => {
        const remainingDays = daysUntilExpiry(row.expiryDate);
        const expiryStage = documentExpiryStage(row.expiryDate, row.reminderDays);
        return { ...row, employee: row.employeeId ? employeeMap.get(row.employeeId) || null : null, remainingDays, expiryStage, expiryLabel: documentExpiryLabel(expiryStage, remainingDays) };
      }).sort((left, right) => new Date(left.expiryDate).getTime() - new Date(right.expiryDate).getTime());
    }),
    create: adminProcedure.input(z.object({ documentScope: z.enum(["company", "employee"]), employeeId: z.number().int().positive().nullable().optional(), documentType: z.string().trim().min(2).max(128), title: z.string().trim().min(2).max(255), referenceNumber: z.string().trim().max(128).optional(), issuingAuthority: z.string().trim().max(255).optional(), issuedDate: z.string().optional(), expiryDate: z.string().min(10), reminderDays: z.number().int().min(1).max(365).default(30), attachmentUrl: z.string().url().optional().or(z.literal("")), attachmentName: z.string().trim().max(255).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      if (!companyId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "اختر شركة نشطة قبل حفظ الوثيقة" });
      if (input.documentScope === "employee" && !input.employeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر الموظف لربط وثيقته" });
      if (input.documentScope === "company" && input.employeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "وثيقة الشركة لا ترتبط بموظف" });
      if (input.employeeId) {
        const employee = (await db.select({ id: employees.id }).from(employees).where(eq(employees.id, input.employeeId)).limit(1))[0];
        if (!employee) throw new TRPCError({ code: "NOT_FOUND", message: "الموظف المحدد غير موجود" });
      }
      const result = await db.insert(complianceDocuments).values({ companyId, employeeId: input.documentScope === "employee" ? input.employeeId || null : null, documentScope: input.documentScope, documentType: input.documentType, title: input.title, referenceNumber: input.referenceNumber || null, issuingAuthority: input.issuingAuthority || null, issuedDate: input.issuedDate ? new Date(`${input.issuedDate}T00:00:00Z`) : null, expiryDate: new Date(`${input.expiryDate}T00:00:00Z`), reminderDays: input.reminderDays, attachmentUrl: input.attachmentUrl || null, attachmentName: input.attachmentName || null, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "complianceDocument", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
    update: adminProcedure.input(z.object({ id: z.number().int().positive(), documentType: z.string().trim().min(2).max(128), title: z.string().trim().min(2).max(255), referenceNumber: z.string().trim().max(128).optional(), issuingAuthority: z.string().trim().max(255).optional(), issuedDate: z.string().optional(), expiryDate: z.string().min(10), reminderDays: z.number().int().min(1).max(365), attachmentUrl: z.string().url().optional().or(z.literal("")), attachmentName: z.string().trim().max(255).optional(), status: z.enum(["active", "archived"]) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const existing = (await db.select().from(complianceDocuments).where(eq(complianceDocuments.id, input.id)).limit(1))[0];
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "سجل الوثيقة غير موجود" });
      await db.update(complianceDocuments).set({ documentType: input.documentType, title: input.title, referenceNumber: input.referenceNumber || null, issuingAuthority: input.issuingAuthority || null, issuedDate: input.issuedDate ? new Date(`${input.issuedDate}T00:00:00Z`) : null, expiryDate: new Date(`${input.expiryDate}T00:00:00Z`), reminderDays: input.reminderDays, attachmentUrl: input.attachmentUrl || null, attachmentName: input.attachmentName || null, status: input.status, lastAlertKey: existing.expiryDate.getTime() === new Date(`${input.expiryDate}T00:00:00Z`).getTime() ? existing.lastAlertKey : null, lastAlertAt: existing.expiryDate.getTime() === new Date(`${input.expiryDate}T00:00:00Z`).getTime() ? existing.lastAlertAt : null }).where(eq(complianceDocuments.id, input.id));
      await db.insert(auditLogs).values({ entityType: "complianceDocument", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(existing), afterJson: JSON.stringify(input) });
      return { id: input.id };
    }),
  }),
  fixedAssets: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      const assets = await db.select().from(fixedAssets).where(eq(fixedAssets.status, "active"));
      return Promise.all(assets.map(async (asset) => ({ ...asset, depreciation: await db.select().from(fixedAssetDepreciation).where(eq(fixedAssetDepreciation.assetId, asset.id)) })));
    }),
    postDepreciation: protectedProcedure.input(z.object({ depreciationId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const row = (await db.select().from(fixedAssetDepreciation).where(eq(fixedAssetDepreciation.id, input.depreciationId)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "دفعة الإهلاك غير موجودة" });
      if (row.status === "posted") throw new TRPCError({ code: "CONFLICT", message: "تم ترحيل إهلاك هذه الفترة مسبقًا" });
      const asset = (await db.select().from(fixedAssets).where(eq(fixedAssets.id, row.assetId)).limit(1))[0];
      if (!asset) throw new TRPCError({ code: "NOT_FOUND", message: "الأصل المرتبط غير موجود" });
      const documentNumber = `DEP-${asset.assetCode}-${row.periodStart}`;
      const result = await db.insert(accountingDocuments).values({ documentType: "journal_entry", documentNumber, documentDate: row.periodEnd, amount: row.depreciationAmount, taxAmount: "0", totalAmount: row.depreciationAmount, status: "posted", notes: `إهلاك شهري — ${asset.name}`, createdBy: ctx.user.id });
      const documentId = Number(result[0].insertId);
      await db.insert(accountingDocumentLines).values([
        { documentId, accountId: asset.depreciationExpenseAccountId, description: `مصروف إهلاك ${asset.name}`, debit: row.depreciationAmount, credit: "0" },
        { documentId, accountId: asset.accumulatedDepreciationAccountId, description: `مجمع إهلاك ${asset.name}`, debit: "0", credit: row.depreciationAmount },
      ]);
      await db.update(fixedAssetDepreciation).set({ status: "posted", journalDocumentId: documentId }).where(eq(fixedAssetDepreciation.id, row.id));
      await db.insert(auditLogs).values({ entityType: "fixedAssetDepreciation", entityId: row.id, action: "posted", actorId: ctx.user.id, afterJson: JSON.stringify({ documentId }) });
      return { documentId };
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), assetCode: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), category: z.string().trim().min(2).max(128), acquisitionDate: z.string(), inServiceDate: z.string(), acquisitionCost: z.number().positive(), residualValue: z.number().nonnegative().default(0), usefulLifeMonths: z.number().int().positive(), assetAccountId: z.number().int().positive(), depreciationExpenseAccountId: z.number().int().positive(), accumulatedDepreciationAccountId: z.number().int().positive(), sourceDocumentId: z.number().int().positive().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.projectId) await assertProjectWrite(db, ctx, input.projectId);
      const accountIds = [input.assetAccountId, input.depreciationExpenseAccountId, input.accumulatedDepreciationAccountId];
      const accountRows = await db.select({ id: accounts.id }).from(accounts);
      if (accountIds.some((id) => !accountRows.some((row) => row.id === id))) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر حسابات صحيحة للأصل والإهلاك" });
      const result = await db.insert(fixedAssets).values({ projectId: input.projectId || null, assetCode: input.assetCode, name: input.name, category: input.category, acquisitionDate: new Date(input.acquisitionDate), inServiceDate: new Date(input.inServiceDate), acquisitionCost: input.acquisitionCost.toFixed(2), residualValue: input.residualValue.toFixed(2), usefulLifeMonths: input.usefulLifeMonths, assetAccountId: input.assetAccountId, depreciationExpenseAccountId: input.depreciationExpenseAccountId, accumulatedDepreciationAccountId: input.accumulatedDepreciationAccountId, sourceDocumentId: input.sourceDocumentId || null, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      const schedule = calculateStraightLineDepreciation({ acquisitionCost: input.acquisitionCost, residualValue: input.residualValue, usefulLifeMonths: input.usefulLifeMonths, inServiceDate: input.inServiceDate });
      await db.insert(fixedAssetDepreciation).values(schedule.map((row) => ({ assetId: id, periodStart: new Date(row.periodStart), periodEnd: new Date(row.periodEnd), depreciationAmount: row.depreciationAmount.toFixed(2), accumulatedAmount: row.accumulatedAmount.toFixed(2), netBookValue: row.netBookValue.toFixed(2) })));
      await db.insert(auditLogs).values({ entityType: "fixedAsset", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, id }) });
      return { id };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive().nullable().optional(), assetCode: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), category: z.string().trim().min(2).max(128), acquisitionDate: z.string(), inServiceDate: z.string(), acquisitionCost: z.number().positive(), residualValue: z.number().nonnegative().default(0), usefulLifeMonths: z.number().int().positive(), assetAccountId: z.number().int().positive(), depreciationExpenseAccountId: z.number().int().positive(), accumulatedDepreciationAccountId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const existing = (await db.select().from(fixedAssets).where(eq(fixedAssets.id, input.id)).limit(1))[0];
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "بطاقة الأصل غير موجودة" });
      if (input.projectId) await assertProjectWrite(db, ctx, input.projectId);
      const depreciationRows = await db.select().from(fixedAssetDepreciation).where(eq(fixedAssetDepreciation.assetId, input.id));
      if (depreciationRows.some((row) => row.status === "posted")) throw new TRPCError({ code: "CONFLICT", message: "لا يمكن تعديل أصل له إهلاك مرحّل؛ استخدم قيد تصحيحي" });
      const accountRows = await db.select({ id: accounts.id }).from(accounts);
      const accountIds = [input.assetAccountId, input.depreciationExpenseAccountId, input.accumulatedDepreciationAccountId];
      if (accountIds.some((id) => !accountRows.some((row) => row.id === id))) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر حسابات صحيحة للأصل والإهلاك" });
      await db.update(fixedAssets).set({ projectId: input.projectId ?? null, assetCode: input.assetCode, name: input.name, category: input.category, acquisitionDate: new Date(input.acquisitionDate), inServiceDate: new Date(input.inServiceDate), acquisitionCost: input.acquisitionCost.toFixed(2), residualValue: input.residualValue.toFixed(2), usefulLifeMonths: input.usefulLifeMonths, assetAccountId: input.assetAccountId, depreciationExpenseAccountId: input.depreciationExpenseAccountId, accumulatedDepreciationAccountId: input.accumulatedDepreciationAccountId }).where(eq(fixedAssets.id, input.id));
      await db.delete(fixedAssetDepreciation).where(eq(fixedAssetDepreciation.assetId, input.id));
      const schedule = calculateStraightLineDepreciation({ acquisitionCost: input.acquisitionCost, residualValue: input.residualValue, usefulLifeMonths: input.usefulLifeMonths, inServiceDate: input.inServiceDate });
      await db.insert(fixedAssetDepreciation).values(schedule.map((row) => ({ assetId: input.id, periodStart: new Date(row.periodStart), periodEnd: new Date(row.periodEnd), depreciationAmount: row.depreciationAmount.toFixed(2), accumulatedAmount: row.accumulatedAmount.toFixed(2), netBookValue: row.netBookValue.toFixed(2) })));
      await db.insert(auditLogs).values({ entityType: "fixedAsset", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(existing), afterJson: JSON.stringify(input) });
      return { id: input.id };
    }),
  }),
  expenses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = companyId ? await db.select().from(expenses).where(eq(expenses.companyId, companyId)).orderBy(expenses.createdAt) : [];
      return allowed ? rows.filter((row) => row.projectId === null || allowed.has(row.projectId)) : rows;
    }),
    statement: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), category: z.enum(["materials", "project_operating", "administrative_petty_cash"]), costItemId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [projectRows, expenseRows, payrollRows, costCatalogRows] = await Promise.all([db.select().from(projects), db.select().from(expenses), db.select().from(payroll), db.select().from(costItems)]);
      const selectedProject = projectRows.find((project) => project.id === input.projectId);
      const contractProjects = projectRows.filter((project) => project.classification === "operational" && project.status !== "archived" && Number(project.contractValue) > 0).map((project) => ({ projectId: project.id, contractValue: Number(project.contractValue) }));
      const selectedAdministrativeRatio = allocateAdministrativeExpense(1, contractProjects).find((row) => row.projectId === input.projectId)?.ratio ?? 0;
      const from = input.from ? new Date(input.from).getTime() : Number.NEGATIVE_INFINITY;
      const to = input.to ? new Date(input.to).getTime() + 86400000 : Number.POSITIVE_INFINITY;
      const inRange = (value: Date | string | null) => !value || (new Date(value).getTime() >= from && new Date(value).getTime() <= to);
      const costMap = new Map(costCatalogRows.map((item) => [item.id, item]));
      const rows: Array<{ id: string; date: Date | null; source: string; description: string; category: string; costItemId: number | null; costItemName: string | null; preTaxAmount: number; taxAmount: number; totalAmount: number; paidAmount: number; outstanding: number; allocationRatio: number }> = [];
      if (input.category === "materials" || input.category === "project_operating") {
        expenseRows.filter((row) => row.projectId === input.projectId && row.status !== "rejected" && row.status !== "draft" && inRange(row.expenseDate) && (input.category === "materials" ? row.expenseType === "materials" : row.expenseType !== "materials") && (!input.costItemId || row.costItemId === input.costItemId)).forEach((row) => rows.push({ id: `expense-${row.id}`, date: row.expenseDate, source: "مصروف", description: row.description, category: row.expenseType, costItemId: row.costItemId, costItemName: row.costItemId ? costMap.get(row.costItemId)?.name ?? null : null, preTaxAmount: Number(row.preTaxAmount), taxAmount: Number(row.taxAmount), totalAmount: Number(row.totalAmount), paidAmount: Number(row.paidAmount), outstanding: Math.max(Number(row.totalAmount) - Number(row.paidAmount), 0), allocationRatio: Number(row.allocationRatio || 1) }));
        if (input.category === "project_operating") payrollRows.filter((row) => row.projectId === input.projectId && row.classification === "project" && inRange(row.createdAt)).forEach((row) => rows.push({ id: `payroll-${row.id}`, date: row.createdAt, source: "راتب مشروع", description: row.employeeName, category: "payroll", costItemId: null, costItemName: null, preTaxAmount: Number(row.preTaxAmount), taxAmount: Number(row.taxAmount), totalAmount: Number(row.totalAmount), paidAmount: Number(row.paidAmount), outstanding: Math.max(Number(row.totalAmount) - Number(row.paidAmount), 0), allocationRatio: 1 }));
      } else if (selectedProject && selectedAdministrativeRatio > 0) {
        expenseRows.filter((row) => !row.projectId && ["administrative", "general_cash", "petty_cash"].includes(row.classification) && row.status !== "rejected" && row.status !== "draft" && inRange(row.expenseDate)).forEach((row) => rows.push({ id: `admin-${row.id}`, date: row.expenseDate, source: "إداري / نثريات", description: row.description, category: row.expenseType, costItemId: row.costItemId, costItemName: row.costItemId ? costMap.get(row.costItemId)?.name ?? null : null, preTaxAmount: Number(row.preTaxAmount) * selectedAdministrativeRatio, taxAmount: Number(row.taxAmount) * selectedAdministrativeRatio, totalAmount: Number(row.totalAmount) * selectedAdministrativeRatio, paidAmount: Number(row.paidAmount) * selectedAdministrativeRatio, outstanding: Math.max(Number(row.totalAmount) - Number(row.paidAmount), 0) * selectedAdministrativeRatio, allocationRatio: selectedAdministrativeRatio }));
      }
      const totals = rows.reduce((acc, row) => ({ preTaxAmount: acc.preTaxAmount + row.preTaxAmount, taxAmount: acc.taxAmount + row.taxAmount, totalAmount: acc.totalAmount + row.totalAmount, paidAmount: acc.paidAmount + row.paidAmount, outstanding: acc.outstanding + row.outstanding }), { preTaxAmount: 0, taxAmount: 0, totalAmount: 0, paidAmount: 0, outstanding: 0 });
      return { project: selectedProject ?? null, category: input.category, administrativeRatio: selectedAdministrativeRatio, rows, totals };
    }),
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().int().positive().optional(),
        stageId: z.number().int().positive().optional(),
        vendorId: z.number().int().positive().optional(),
        costItemId: z.number().int().positive().optional(),
        description: z.string().trim().min(2),
        unit: z.string().trim().max(64).optional(),
        quantity: z.number().nonnegative().default(1),
        expenseType: z.enum(["materials", "payroll", "operating_tools", "equipment_rental", "contractor", "transport", "maintenance", "services", "operating", "administrative"]).default("operating"),
        classification: z.enum(["project", "administrative", "general_cash", "petty_cash"]).default("project"),
        allocationRatio: z.number().min(0.01).max(1).default(1),
        preTaxAmount: z.number().nonnegative(),
        taxRate: z.number().min(0).max(100).default(15),
        paidAmount: z.number().nonnegative().default(0),
        payrollBeneficiaryType: z.enum(["company_employee", "worker"]).optional(),
        payrollEmployeeId: z.number().int().positive().optional(),
        payrollBeneficiaryName: z.string().trim().max(255).optional(),
        expenseDate: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "expense");
        const allocationValidation = validateExpenseAllocation(input);
        if (!allocationValidation.ok) throw new TRPCError({ code: "BAD_REQUEST", message: allocationValidation.message });
        if (input.projectId) {
          await assertProjectAccess(db, ctx, input.projectId);
          await assertProjectWrite(db, ctx, input.projectId);
          await assertPeriodOpen(db, ctx, input.projectId, input.expenseDate ? new Date(input.expenseDate) : new Date());
        }
        let payrollBeneficiaryName = input.payrollBeneficiaryName?.trim() || null;
        if (input.expenseType === "payroll") {
          if (!input.payrollBeneficiaryType) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد نوع مستفيد الراتب" });
          if (input.payrollBeneficiaryType === "company_employee") {
            if (!input.payrollEmployeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر موظف الشركة" });
            const employee = (await db.select({ id: employees.id, fullName: employees.fullName }).from(employees).where(eq(employees.id, input.payrollEmployeeId)).limit(1))[0];
            if (!employee) throw new TRPCError({ code: "NOT_FOUND", message: "الموظف غير موجود" });
            payrollBeneficiaryName = employee.fullName;
          } else if (!payrollBeneficiaryName) throw new TRPCError({ code: "BAD_REQUEST", message: "اكتب اسم العامل أو الأجير" });
        }
        const totals = calculateExpenseTotals(input.preTaxAmount, normalizeExpenseTaxRate(input.expenseType, input.taxRate));
        const approvalStatus = input.projectId ? await resolveApprovalStatus(db, input.projectId, "expense", totals.preTaxAmount) : "pending" as const;
        const taxRate = totals.taxRate;
        const taxAmount = totals.taxAmount;
        const totalAmount = totals.totalAmount;
        const result = await db.insert(expenses).values({
          projectId: input.projectId || null,
          stageId: input.stageId || null,
          vendorId: input.vendorId || null,
          costItemId: input.costItemId || null,
          description: input.description,
          unit: input.unit || null,
          quantity: input.quantity.toFixed(3),
          expenseType: input.expenseType,
          payrollBeneficiaryType: input.expenseType === "payroll" ? input.payrollBeneficiaryType || null : null,
          payrollEmployeeId: input.expenseType === "payroll" ? input.payrollEmployeeId || null : null,
          payrollBeneficiaryName: input.expenseType === "payroll" ? payrollBeneficiaryName : null,
          classification: input.classification,
          allocationRatio: input.classification === "project" ? input.allocationRatio.toFixed(3) : "1.000",
          preTaxAmount: input.preTaxAmount.toFixed(2),
          taxRate: taxRate.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paidAmount: input.paidAmount.toFixed(2),
          expenseDate: input.expenseDate ? new Date(input.expenseDate) : null,
          status: approvalStatus,
          createdBy: ctx.user.id,
        });
        const expenseId = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId || null, entityType: "expense", entityId: expenseId, requestedBy: ctx.user.id, status: approvalStatus });
        await db.insert(auditLogs).values({
          entityType: "expense",
          entityId: expenseId,
          action: "created",
          actorId: ctx.user.id,
          afterJson: JSON.stringify({ ...input, taxAmount, totalAmount, allocationRatio: input.classification === "project" ? input.allocationRatio : 1 }),
        });
        return { id: expenseId, taxAmount, totalAmount };
      }),
    update: protectedProcedure
      .input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), vendorId: z.number().int().positive().optional(), costItemId: z.number().int().positive().optional(), description: z.string().trim().min(2), unit: z.string().trim().max(64).optional(), quantity: z.number().nonnegative().default(1), expenseType: z.enum(["materials", "payroll", "operating_tools", "equipment_rental", "contractor", "transport", "maintenance", "services", "operating", "administrative"]).default("operating"), payrollBeneficiaryType: z.enum(["company_employee", "worker"]).optional(), payrollEmployeeId: z.number().int().positive().optional(), payrollBeneficiaryName: z.string().trim().max(255).optional(), classification: z.enum(["project", "administrative", "general_cash", "petty_cash"]).default("project"), allocationRatio: z.number().min(0.01).max(1).default(1), preTaxAmount: z.number().nonnegative(), taxRate: z.number().min(0).max(100).default(15), paidAmount: z.number().nonnegative().default(0), expenseDate: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");
        const before = (await db.select().from(expenses).where(eq(expenses.id, input.id)).limit(1))[0];
        if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المصروف غير موجود" });
        if (before.projectId) { await assertProjectAccess(db, ctx, before.projectId); await assertProjectWrite(db, ctx, before.projectId); await assertPeriodOpen(db, ctx, before.projectId, input.expenseDate ? new Date(input.expenseDate) : new Date(before.expenseDate ?? new Date())); }
        if (input.projectId) { await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId); await assertPeriodOpen(db, ctx, input.projectId, input.expenseDate ? new Date(input.expenseDate) : new Date()); }
        const allocationValidation = validateExpenseAllocation(input);
        if (!allocationValidation.ok) throw new TRPCError({ code: "BAD_REQUEST", message: allocationValidation.message });
        let payrollBeneficiaryName = input.payrollBeneficiaryName?.trim() || null;
        if (input.expenseType === "payroll") {
          if (!input.payrollBeneficiaryType) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد نوع مستفيد الراتب" });
          if (input.payrollBeneficiaryType === "company_employee") {
            if (!input.payrollEmployeeId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر موظف الشركة" });
            const employee = (await db.select({ id: employees.id, fullName: employees.fullName }).from(employees).where(eq(employees.id, input.payrollEmployeeId)).limit(1))[0];
            if (!employee) throw new TRPCError({ code: "NOT_FOUND", message: "الموظف غير موجود" });
            payrollBeneficiaryName = employee.fullName;
          } else if (!payrollBeneficiaryName) throw new TRPCError({ code: "BAD_REQUEST", message: "اكتب اسم العامل أو الأجير" });
        }
        const totals = calculateExpenseTotals(input.preTaxAmount, normalizeExpenseTaxRate(input.expenseType, input.taxRate));
        const approvalStatus = input.projectId ? await resolveApprovalStatus(db, input.projectId, "expense", totals.preTaxAmount) : "pending" as const;
        await db.update(expenses).set({ projectId: input.projectId || null, stageId: input.stageId || null, vendorId: input.vendorId || null, costItemId: input.costItemId || null, description: input.description, unit: input.unit || null, quantity: input.quantity.toFixed(3), expenseType: input.expenseType, payrollBeneficiaryType: input.expenseType === "payroll" ? input.payrollBeneficiaryType || null : null, payrollEmployeeId: input.expenseType === "payroll" ? input.payrollEmployeeId || null : null, payrollBeneficiaryName: input.expenseType === "payroll" ? payrollBeneficiaryName : null, classification: input.classification, allocationRatio: input.classification === "project" ? input.allocationRatio.toFixed(3) : "1.000", preTaxAmount: totals.preTaxAmount.toFixed(2), taxRate: totals.taxRate.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), paidAmount: input.paidAmount.toFixed(2), expenseDate: input.expenseDate ? new Date(input.expenseDate) : null, status: approvalStatus }).where(eq(expenses.id, input.id));
        await db.delete(approvalRequests).where(and(eq(approvalRequests.entityType, "expense"), eq(approvalRequests.entityId, input.id)));
        await db.insert(approvalRequests).values({ projectId: input.projectId || null, entityType: "expense", entityId: input.id, requestedBy: ctx.user.id, status: approvalStatus });
        await db.insert(auditLogs).values({ entityType: "expense", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify({ ...input, ...totals, approvalStatus }) });
        return { id: input.id, taxAmount: totals.taxAmount, totalAmount: totals.totalAmount, status: approvalStatus };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertOperationPermission(db, ctx, "delete");
      const before = (await db.select().from(expenses).where(eq(expenses.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المصروف غير موجود" });
      if (before.projectId) { await assertProjectAccess(db, ctx, before.projectId); await assertProjectWrite(db, ctx, before.projectId); await assertPeriodOpen(db, ctx, before.projectId, new Date(before.expenseDate ?? new Date())); }
      if (before.status === "posted") throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكن حذف مصروف مرحّل محاسبيًا" });
      await db.delete(approvalRequests).where(and(eq(approvalRequests.entityType, "expense"), eq(approvalRequests.entityId, input.id)));
      await db.delete(expenses).where(eq(expenses.id, input.id));
      await db.insert(auditLogs).values({ entityType: "expense", entityId: input.id, action: "deleted", actorId: ctx.user.id, beforeJson: JSON.stringify(before) });
      return { success: true } as const;
    }),
  }),

  sales: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = companyId ? await db.select().from(sales).where(eq(sales.companyId, companyId)).orderBy(sales.createdAt) : [];
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
          update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive(), unitId: z.number().int().positive(), costItemId: z.number().int().positive().optional(), customerName: z.string().trim().min(2), customerPhone: z.string().max(64).optional(), saleDate: z.string().optional(), preTaxAmount: z.number().positive(), taxRate: z.number().min(0).max(100).default(15) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb()); await assertOperationPermission(db, ctx, "edit");
      const before = (await db.select().from(sales).where(eq(sales.id, input.id)).limit(1))[0]; if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "عملية البيع غير موجودة" });
      await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId);
      if (input.costItemId) { const costItem = (await db.select({ id: costItems.id, projectId: costItems.projectId }).from(costItems).where(eq(costItems.id, input.costItemId)).limit(1))[0]; if (!costItem || (costItem.projectId !== null && costItem.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "بند التكلفة لا يتبع المشروع المحدد" }); }
      const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
      await db.update(sales).set({ projectId: input.projectId, unitId: input.unitId, customerName: input.customerName, customerPhone: input.customerPhone || null, saleDate: input.saleDate ? new Date(input.saleDate) : null, preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), costItemId: input.costItemId ?? before.costItemId ?? null, recognizedRevenue: before.status === "confirmed" ? totals.preTaxAmount.toFixed(2) : before.recognizedRevenue }).where(eq(sales.id, input.id));
      await db.insert(auditLogs).values({ entityType: "sale", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify({ ...input, ...totals }) });
      return { id: input.id, totalAmount: totals.totalAmount } as const;
    }),
    updateCustomer: protectedProcedure.input(z.object({ id: z.number().int().positive(), customerName: z.string().trim().min(2), customerPhone: z.string().max(64).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");

      const before = (await db.select().from(sales).where(eq(sales.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "عملية البيع غير موجودة" });
      await db.update(sales).set({ customerName: input.customerName, customerPhone: input.customerPhone || null }).where(eq(sales.id, input.id));
      await db.insert(auditLogs).values({ entityType: "sale", entityId: input.id, action: "customer_updated", actorId: ctx.user.id, beforeJson: JSON.stringify({ customerName: before.customerName, customerPhone: before.customerPhone }), afterJson: JSON.stringify(input) });
      return { id: input.id } as const;
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), unitId: z.number().int().positive(), stageId: z.number().int().positive().optional(), costItemId: z.number().int().positive().optional(), customerName: z.string().trim().min(2), customerPhone: z.string().max(64).optional(), saleDate: z.string().optional(), preTaxAmount: z.number().positive(), taxRate: z.number().min(0).max(100).default(15) }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        let companyId = await resolveActiveCompanyId(db, ctx);
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
        if (!companyId) { const projectCompany = (await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0]; companyId = projectCompany?.companyId ?? null; }
        await assertPeriodOpen(db, ctx, input.projectId, input.saleDate ? new Date(input.saleDate) : new Date());
        if (input.costItemId) { const costItem = (await db.select({ id: costItems.id, projectId: costItems.projectId }).from(costItems).where(eq(costItems.id, input.costItemId)).limit(1))[0]; if (!costItem || (costItem.projectId !== null && costItem.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "بند التكلفة لا يتبع المشروع المحدد" }); }
        if (input.stageId) {
          const stage = (await db.select().from(stages).where(eq(stages.id, input.stageId)).limit(1))[0];
          if (!stage || stage.projectId !== input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "المرحلة لا تتبع المشروع المحدد" });
        }
        const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
        const approvalPolicy = await findApprovalPolicy(db, input.projectId, "sale");
        const approvalStatus = approvalPolicy && totals.preTaxAmount <= Number(approvalPolicy.thresholdAmount) ? "approved" as const : "pending" as const;
        const finalized = !approvalPolicy || approvalStatus === "approved";
        const result = await db.insert(sales).values({ companyId, projectId: input.projectId, unitId: input.unitId, stageId: input.stageId || null, costItemId: input.costItemId || null, customerName: input.customerName, customerPhone: input.customerPhone || null, saleDate: input.saleDate ? new Date(input.saleDate) : null, preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), recognizedRevenue: finalized ? totals.preTaxAmount.toFixed(2) : "0.00", status: finalized ? "confirmed" : "reserved", createdBy: ctx.user.id });
        const saleId = Number(result[0].insertId);
        await db.update(units).set({ status: finalized ? "sold" : "reserved" }).where(eq(units.id, input.unitId));
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "sale", entityId: saleId, requestedBy: ctx.user.id, status: approvalStatus });
        await db.insert(auditLogs).values({ entityType: "sale", entityId: saleId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, ...totals, recognizedRevenue: totals.preTaxAmount }) });
        return { id: saleId, recognizedRevenue: totals.preTaxAmount, totalAmount: totals.totalAmount };
      }),
  }),

  collections: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = companyId ? await db.select().from(collections).where(eq(collections.companyId, companyId)).orderBy(collections.createdAt) : [];
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive(), saleId: z.number().int().positive(), amount: z.number().positive(), collectionDestination: z.enum(["cash", "bank", "escrow"]).default("cash"), cashAccountId: z.number().int().positive().optional(), escrowReference: z.string().max(128).optional(), receiptReference: z.string().max(128).optional(), collectionDate: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb()); await assertOperationPermission(db, ctx, "edit");
      const before = (await db.select().from(collections).where(eq(collections.id, input.id)).limit(1))[0]; if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "التحصيل غير موجود" });
      await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId);
      const project = (await db.select({ escrowCashAccountId: projects.escrowCashAccountId, projectType: projects.projectType }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0];
      if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
      if (input.collectionDestination === "escrow" && (project.projectType !== "off_plan_sales" || !project.escrowCashAccountId)) throw new TRPCError({ code: "BAD_REQUEST", message: "حساب الضمان غير متاح لهذا المشروع" });
      if (input.cashAccountId && input.collectionDestination !== "escrow") { const account = (await db.select({ id: cashAccounts.id, accountType: cashAccounts.accountType }).from(cashAccounts).where(eq(cashAccounts.id, input.cashAccountId)).limit(1))[0]; if (!account || account.accountType !== input.collectionDestination) throw new TRPCError({ code: "BAD_REQUEST", message: "حساب الإيداع لا يطابق وجهة التحصيل" }); }
      await db.update(collections).set({ projectId: input.projectId, saleId: input.saleId, collectionDestination: input.collectionDestination, cashAccountId: input.collectionDestination === "escrow" ? project.escrowCashAccountId : input.cashAccountId || null, escrowReference: input.collectionDestination === "escrow" ? input.escrowReference || null : null, amount: input.amount.toFixed(2), receiptReference: input.receiptReference || null, collectionDate: input.collectionDate ? new Date(input.collectionDate) : null }).where(eq(collections.id, input.id));
      await db.insert(auditLogs).values({ entityType: "collection", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) }); return { id: input.id } as const;
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), saleId: z.number().int().positive(), amount: z.number().positive(), collectionDestination: z.enum(["cash", "bank", "escrow"]).default("cash"), cashAccountId: z.number().int().positive().optional(), escrowReference: z.string().max(128).optional(), receiptReference: z.string().max(128).optional(), collectionDate: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        let companyId = await resolveActiveCompanyId(db, ctx);
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
        if (!companyId) { const projectCompany = (await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0]; companyId = projectCompany?.companyId ?? null; }
        await assertPeriodOpen(db, ctx, input.projectId, input.collectionDate ? new Date(input.collectionDate) : new Date());
        const project = (await db.select({ escrowCashAccountId: projects.escrowCashAccountId, projectType: projects.projectType }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0];
        if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "المشروع غير موجود" });
        if (input.collectionDestination === "escrow") {
          if (project.projectType !== "off_plan_sales") throw new TRPCError({ code: "BAD_REQUEST", message: "حساب الضمان متاح فقط لمشاريع البيع على الخارطة" });
          if (!project.escrowCashAccountId) throw new TRPCError({ code: "BAD_REQUEST", message: "لم يتم تحديد حساب ضمان لهذا المشروع" });
        } else if (input.cashAccountId) {
          const account = (await db.select({ id: cashAccounts.id, accountType: cashAccounts.accountType }).from(cashAccounts).where(eq(cashAccounts.id, input.cashAccountId)).limit(1))[0];
          if (!account || account.accountType !== input.collectionDestination) throw new TRPCError({ code: "BAD_REQUEST", message: "حساب الإيداع لا يطابق وجهة التحصيل" });
        }
        const approvalPolicy = await findApprovalPolicy(db, input.projectId, "collection");
        const approvalStatus = approvalPolicy && input.amount <= Number(approvalPolicy.thresholdAmount) ? "approved" as const : "pending" as const;
        const finalized = !approvalPolicy || approvalStatus === "approved";
        const result = await db.insert(collections).values({ companyId, projectId: input.projectId, saleId: input.saleId, collectionDestination: input.collectionDestination, cashAccountId: input.collectionDestination === "escrow" ? project.escrowCashAccountId : input.cashAccountId || null, escrowReference: input.collectionDestination === "escrow" ? input.escrowReference || null : null, amount: input.amount.toFixed(2), receiptReference: input.receiptReference || null, collectionDate: input.collectionDate ? new Date(input.collectionDate) : null, status: finalized ? "received" : "draft", createdBy: ctx.user.id });
        const collectionId = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "collection", entityId: collectionId, requestedBy: ctx.user.id, status: approvalStatus });
        await db.insert(auditLogs).values({ entityType: "collection", entityId: collectionId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id: collectionId };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "حذف التحصيلات متاح للمسؤول فقط" });
      const before = (await db.select().from(collections).where(eq(collections.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "التحصيل غير موجود" });
      await db.delete(approvalRequests).where(and(eq(approvalRequests.entityType, "collection"), eq(approvalRequests.entityId, input.id)));
      await db.delete(collections).where(eq(collections.id, input.id));
      await db.insert(auditLogs).values({ entityType: "collection", entityId: input.id, action: "deleted_by_admin", actorId: ctx.user.id, beforeJson: JSON.stringify(before) });
      return { success: true } as const;
    }),
  }),

  procurement: router({
    requisitions: router({
      list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const companyId = await resolveActiveCompanyId(db, ctx);
        const projectRows = companyId ? await db.select({ id: projects.id }).from(projects).where(eq(projects.companyId, companyId)) : [];
        const companyProjectIds = new Set(projectRows.map((project) => project.id));
        const rows = await db.select().from(materialRequisitions);
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        const filtered = rows.filter((row) => companyProjectIds.has(row.projectId) && (!input?.projectId || row.projectId === input.projectId) && (!allowed || allowed.has(row.projectId)));
        return Promise.all(filtered.map(async (row) => ({ ...row, items: await db.select().from(materialRequisitionItems).where(eq(materialRequisitionItems.requisitionId, row.id)) })));
      }),
      planning: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), inventoryItemId: z.number().int().positive(), costItemId: z.number().int().positive().optional(), quantity: z.number().positive() })).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        return resolveMaterialPlanning(db, input);
      }),
      create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), description: z.string().max(2000).optional(), requiredBy: z.string().optional(), items: z.array(materialRequisitionLineSchema).min(1) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        if (ctx.user.role !== "site_worker") await assertProjectWrite(db, ctx, input.projectId);
        const requestNumber = `MR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const result = await db.insert(materialRequisitions).values({ projectId: input.projectId, stageId: input.stageId || null, requestedBy: ctx.user.id, requestNumber, description: input.description || null, status: "pending_approval", requiredBy: input.requiredBy ? new Date(input.requiredBy) : null });
        const id = Number(result[0].insertId);
        for (const item of input.items) {
          if (!item.inventoryItemId) { await db.insert(materialRequisitionItems).values({ requisitionId: id, description: item.description, unit: item.unit || null, quantity: item.quantity.toFixed(3), estimatedUnitCost: item.estimatedUnitCost.toFixed(2), notes: item.notes || null }); continue; }
          const plan = await resolveMaterialPlanning(db, { projectId: input.projectId, stageId: input.stageId, inventoryItemId: item.inventoryItemId, costItemId: item.costItemId, quantity: item.quantity });
          await db.insert(materialRequisitionItems).values({ requisitionId: id, inventoryItemId: item.inventoryItemId, costItemId: plan.costItemId, contractId: plan.contractId, contractItemIndex: plan.contractItemIndex, description: plan.material.name, unit: plan.material.unit, quantity: item.quantity.toFixed(3), estimatedUnitCost: item.estimatedUnitCost.toFixed(2), planningStatus: plan.status, plannedQuantity: plan.plannedQuantity.toFixed(3), notes: item.notes || null });
        }
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "materialRequisition", entityId: id, requestedBy: ctx.user.id, status: "pending", approvalStage: "mostafa", stageOrder: 1 });
        await db.insert(auditLogs).values({ entityType: "materialRequisition", entityId: id, action: "submitted", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        await notifyApprovalUsers(db, { type: "material_requisition_pending", title: `طلب مواد جديد ${requestNumber}`, message: `طلب مواد جديد لمشروع #${input.projectId} أرسله موظف الموقع ويحتاج اعتماد مصطفى أولًا.`, userIds: [13170001], roles: [] });
        return { id, requestNumber };
      }),
      update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), description: z.string().max(2000).optional(), requiredBy: z.string().optional(), items: z.array(materialRequisitionLineSchema).min(1) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        if (ctx.user.role !== "admin" && Number(ctx.user.id) !== 13170001) { const existing = (await db.select({ requestedBy: materialRequisitions.requestedBy }).from(materialRequisitions).where(eq(materialRequisitions.id, input.id)).limit(1))[0]; if (!existing || existing.requestedBy !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "تعديل طلب المواد متاح لمنشئ الطلب أو مصطفى أو المالك" }); }
        const request = (await db.select().from(materialRequisitions).where(eq(materialRequisitions.id, input.id)).limit(1))[0];
        if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "طلب المواد غير موجود" });
        await assertProjectAccess(db, ctx, input.projectId);
        await db.update(materialRequisitions).set({ projectId: input.projectId, stageId: input.stageId || null, description: input.description || null, requiredBy: input.requiredBy ? new Date(input.requiredBy) : null, status: "pending_approval" }).where(eq(materialRequisitions.id, input.id));
        await db.delete(materialRequisitionItems).where(eq(materialRequisitionItems.requisitionId, input.id));
        for (const item of input.items) {
          if (!item.inventoryItemId) { await db.insert(materialRequisitionItems).values({ requisitionId: input.id, description: item.description, unit: item.unit || null, quantity: item.quantity.toFixed(3), estimatedUnitCost: item.estimatedUnitCost.toFixed(2), notes: item.notes || null }); continue; }
          const plan = await resolveMaterialPlanning(db, { projectId: input.projectId, stageId: input.stageId, inventoryItemId: item.inventoryItemId, costItemId: item.costItemId, quantity: item.quantity, excludingRequisitionId: input.id });
          await db.insert(materialRequisitionItems).values({ requisitionId: input.id, inventoryItemId: item.inventoryItemId, costItemId: plan.costItemId, contractId: plan.contractId, contractItemIndex: plan.contractItemIndex, description: plan.material.name, unit: plan.material.unit, quantity: item.quantity.toFixed(3), estimatedUnitCost: item.estimatedUnitCost.toFixed(2), planningStatus: plan.status, plannedQuantity: plan.plannedQuantity.toFixed(3), notes: item.notes || null });
        }
        await db.update(approvalRequests).set({ status: "rejected", reviewedBy: ctx.user.id, reviewedAt: new Date(), note: "إعادة إرسال طلب المواد بعد التعديل" }).where(and(eq(approvalRequests.entityType, "materialRequisition"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending")));
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "materialRequisition", entityId: input.id, requestedBy: ctx.user.id, status: "pending", approvalStage: "mostafa", stageOrder: 1 });
        await db.insert(auditLogs).values({ entityType: "materialRequisition", entityId: input.id, action: "updated_and_resubmitted_to_mostafa", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        await notifyApprovalUsers(db, { type: "material_requisition_pending", title: `طلب مواد معدل بانتظار اعتماد مصطفى #${input.id}`, message: `تم تعديل وإعادة إرسال طلب المواد ويحتاج اعتماد مصطفى.`, userIds: [13170001], roles: [] });
        return { success: true, id: input.id } as const;
      }),
      delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const request = (await db.select().from(materialRequisitions).where(eq(materialRequisitions.id, input.id)).limit(1))[0];
        if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "طلب المواد غير موجود" });
        await db.update(materialRequisitions).set({ status: "cancelled" }).where(eq(materialRequisitions.id, input.id));
        await db.update(approvalRequests).set({ status: "rejected", reviewedBy: ctx.user.id, reviewedAt: new Date(), note: "حذف بواسطة المالك" }).where(and(eq(approvalRequests.entityType, "materialRequisition"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending")));
        await db.insert(auditLogs).values({ entityType: "materialRequisition", entityId: input.id, action: "deleted", actorId: ctx.user.id, afterJson: JSON.stringify({ status: "cancelled" }) });
        return { success: true } as const;
      }),
      decide: protectedProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const request = (await db.select().from(materialRequisitions).where(eq(materialRequisitions.id, input.id)).limit(1))[0];
        if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "طلب المواد غير موجود" });
        const approval = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "materialRequisition"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending"))).limit(1))[0];
        if (!approval) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد مرحلة اعتماد معلقة لهذا الطلب" });
        const stage = approval.approvalStage === "owner" ? "owner" : approval.approvalStage === "project_manager" ? "project_manager" : approval.approvalStage === "general_manager" ? "general_manager" : "mostafa";
        const canReviewStage = stage === "mostafa" ? Number(ctx.user.id) === 13170001 : stage === "project_manager" ? ctx.user.role === "project_manager" : stage === "owner" ? ctx.user.role === "admin" : ctx.user.role === "general_manager";
        if (!canReviewStage) throw new TRPCError({ code: "FORBIDDEN", message: stage === "mostafa" ? "اعتماد طلب المواد في المرحلة الأولى مخصص لمصطفى" : stage === "owner" ? "اعتماد طلب المواد في المرحلة الثانية مخصص للمالك" : stage === "project_manager" ? "اعتماد طلب المواد في المرحلة الثالثة مخصص لمدير المشاريع" : "الاعتماد النهائي مخصص للمدير العام" });
        await db.update(approvalRequests).set({ status: input.decision, reviewedBy: ctx.user.id, note: input.note || null, reviewedAt: new Date() }).where(eq(approvalRequests.id, approval.id));
        if (input.decision === "rejected") {
          await db.update(materialRequisitions).set({ status: "rejected" }).where(eq(materialRequisitions.id, input.id));
          await db.insert(auditLogs).values({ entityType: "materialRequisition", entityId: input.id, action: "rejected", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, stage }) });
          return { success: true, status: "rejected" as const, approvalStage: "rejected" as const };
        }
        const nextStage = nextMaterialRequisitionApproval(stage);
        if (nextStage) {
          await db.insert(approvalRequests).values({ projectId: request.projectId, entityType: "materialRequisition", entityId: request.id, requestedBy: request.requestedBy, status: "pending", approvalStage: nextStage.approvalStage, stageOrder: nextStage.stageOrder });
          const recipientConfig = nextStage.approvalStage === "owner" ? { roles: ["admin"] as UserRole[], type: "material_requisition_owner_pending", title: `طلب مواد بانتظار اعتماد المالك #${input.id}`, message: `اعتمد مصطفى طلب المواد #${input.id} وأصبح بانتظار اعتماد المالك.` } : nextStage.approvalStage === "project_manager" ? { roles: ["project_manager"] as UserRole[], type: "material_requisition_project_manager_pending", title: `طلب مواد بانتظار مدير المشاريع #${input.id}`, message: `اعتمد المالك طلب المواد #${input.id} وأصبح بانتظار اعتماد مدير المشاريع.` } : { roles: ["general_manager"] as UserRole[], type: "material_requisition_general_manager_pending", title: `طلب مواد بانتظار اعتماد المدير العام #${input.id}`, message: `اعتمد مدير المشاريع طلب المواد #${input.id} وأصبح بانتظار اعتماد المدير العام.` };
          await db.insert(auditLogs).values({ entityType: "materialRequisition", entityId: input.id, action: `${stage}_approved_${nextStage.approvalStage}_pending`, actorId: ctx.user.id, afterJson: JSON.stringify({ note: input.note || null }) });
          await notifyApprovalUsers(db, recipientConfig);
          return { success: true, status: "pending_approval" as const, approvalStage: nextStage.approvalStage };
        }
        await db.update(materialRequisitions).set({ status: "approved" }).where(eq(materialRequisitions.id, input.id));
        await db.insert(auditLogs).values({ entityType: "materialRequisition", entityId: input.id, action: "general_manager_approved", actorId: ctx.user.id, afterJson: JSON.stringify({ note: input.note || null }) });
        await notifyApprovalUsers(db, { type: "material_requisition_approved", title: `تم اعتماد طلب المواد #${input.id}`, message: `تم اعتماد طلب المواد نهائيًا ويمكن استكمال التنفيذ التشغيلي.`, userIds: [request.requestedBy, 13170001], roles: [] });
        return { success: true, status: "approved" as const, approvalStage: "complete" as const };
      }),
    }),
    purchaseOrders: router({
      list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const companyId = await resolveActiveCompanyId(db, ctx);
        const projectRows = companyId ? await db.select({ id: projects.id }).from(projects).where(eq(projects.companyId, companyId)) : [];
        const companyProjectIds = new Set(projectRows.map((project) => project.id));
        const rows = await db.select().from(purchaseOrders);
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        const filtered = rows.filter((row) => companyProjectIds.has(row.projectId) && (!input?.projectId || row.projectId === input.projectId) && (!allowed || allowed.has(row.projectId)));
        return Promise.all(filtered.map(async (row) => ({ ...row, items: await db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderId, row.id)) })));
      }),
      create: protectedProcedure.input(z.object({ requisitionId: z.number().int().positive(), vendorId: z.number().int().positive(), orderDate: z.string().optional(), expectedDate: z.string().optional(), items: z.array(z.object({ description: z.string().min(1).max(255), unit: z.string().max(64).optional(), inventoryItemId: z.number().int().positive().optional(), costItemId: z.number().int().positive().optional(), quantity: z.number().positive(), unitCost: z.number().nonnegative() })).min(1) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const requisition = (await db.select().from(materialRequisitions).where(eq(materialRequisitions.id, input.requisitionId)).limit(1))[0];
        if (!requisition || requisition.status !== "approved") throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن إنشاء أمر شراء إلا لطلب مواد معتمد" });
        await assertProjectWrite(db, ctx, requisition.projectId);
        const vendor = (await db.select().from(vendors).where(eq(vendors.id, input.vendorId)).limit(1))[0];
        if (!vendor) throw new TRPCError({ code: "NOT_FOUND", message: "المورد غير موجود" });
        const requisitionItems = await db.select().from(materialRequisitionItems).where(eq(materialRequisitionItems.requisitionId, requisition.id));
        for (let index = 0; index < input.items.length; index += 1) { const item = input.items[index]; const requisitionItem = requisitionItems[index]; const costItemId = item.costItemId ?? requisitionItem?.costItemId ?? null; if (costItemId) { const costItem = (await db.select({ id: costItems.id, projectId: costItems.projectId }).from(costItems).where(eq(costItems.id, costItemId)).limit(1))[0]; if (!costItem || (costItem.projectId !== null && costItem.projectId !== requisition.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "بند التكلفة لا يتبع مشروع طلب المواد" }); } }
        const subtotal = input.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
        const orderNumber = `PO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const result = await db.insert(purchaseOrders).values({ projectId: requisition.projectId, stageId: requisition.stageId || null, vendorId: input.vendorId, requisitionId: requisition.id, orderNumber, status: "pending_approval", subtotal: subtotal.toFixed(2), taxAmount: "0.00", totalAmount: subtotal.toFixed(2), orderDate: input.orderDate ? new Date(input.orderDate) : null, expectedDate: input.expectedDate ? new Date(input.expectedDate) : null, createdBy: ctx.user.id });
        const id = Number(result[0].insertId);
        for (let index = 0; index < input.items.length; index += 1) { const item = input.items[index]; const requisitionItem = requisitionItems[index]; await db.insert(purchaseOrderItems).values({ purchaseOrderId: id, inventoryItemId: item.inventoryItemId ?? requisitionItem?.inventoryItemId ?? null, costItemId: item.costItemId ?? requisitionItem?.costItemId ?? null, description: item.description, unit: item.unit || null, quantity: item.quantity.toFixed(3), unitCost: item.unitCost.toFixed(2), receivedQuantity: "0.000", totalAmount: (item.quantity * item.unitCost).toFixed(2) }); }
        await db.update(materialRequisitions).set({ status: "converted" }).where(eq(materialRequisitions.id, requisition.id));
        await db.insert(approvalRequests).values({ projectId: requisition.projectId, entityType: "purchaseOrder", entityId: id, requestedBy: ctx.user.id, status: "pending", approvalStage: "project_manager", stageOrder: 1 });
        await db.insert(auditLogs).values({ entityType: "purchaseOrder", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id, orderNumber };
      }),
      decide: adminProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const order = (await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, input.id)).limit(1))[0];
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "أمر الشراء غير موجود" });
        await db.update(purchaseOrders).set({ status: input.decision === "approved" ? "approved" : "cancelled" }).where(eq(purchaseOrders.id, input.id));
        await db.update(approvalRequests).set({ status: input.decision, reviewedBy: ctx.user.id, note: input.note || null, reviewedAt: new Date() }).where(and(eq(approvalRequests.entityType, "purchaseOrder"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending")));
        await db.insert(auditLogs).values({ entityType: "purchaseOrder", entityId: input.id, action: input.decision, actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { success: true } as const;
      }),
      updateInvoice: adminProcedure.input(z.object({ id: z.number().int().positive(), invoiceNumber: z.string().max(128).optional(), invoicedAmount: z.number().nonnegative(), paidAmount: z.number().nonnegative() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const order = (await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, input.id)).limit(1))[0];
        if (!order) throw new TRPCError({ code: "NOT_FOUND", message: "أمر الشراء غير موجود" });
        if (input.paidAmount > input.invoicedAmount) throw new TRPCError({ code: "BAD_REQUEST", message: "المدفوع لا يمكن أن يتجاوز قيمة الفاتورة" });
        if (input.invoicedAmount > Number(order.totalAmount)) throw new TRPCError({ code: "BAD_REQUEST", message: "قيمة الفاتورة لا يمكن أن تتجاوز إجمالي أمر الشراء" });
        const invoiceStatus = calculatePurchaseInvoiceStatus(input.invoicedAmount, input.paidAmount);
        await db.update(purchaseOrders).set({ invoiceNumber: input.invoiceNumber || null, invoiceStatus, invoicedAmount: input.invoicedAmount.toFixed(2), paidAmount: input.paidAmount.toFixed(2) }).where(eq(purchaseOrders.id, input.id));
        await db.insert(auditLogs).values({ entityType: "purchaseOrder", entityId: input.id, action: "invoice_updated", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, invoiceStatus }) });
        return { success: true, invoiceStatus } as const;
      }),
      receive: protectedProcedure.input(z.object({ purchaseOrderId: z.number().int().positive(), receivedDate: z.string().optional(), notes: z.string().max(1000).optional(), items: z.array(z.object({ purchaseOrderItemId: z.number().int().positive(), quantity: z.number().positive() })).min(1) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const order = (await db.select().from(purchaseOrders).where(eq(purchaseOrders.id, input.purchaseOrderId)).limit(1))[0];
        if (!order || !["approved", "partially_received"].includes(order.status)) throw new TRPCError({ code: "BAD_REQUEST", message: "أمر الشراء غير معتمد أو مغلق" });
        await assertProjectWrite(db, ctx, order.projectId);
        const receiptNumber = `GRN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const receiptResult = await db.insert(purchaseReceipts).values({ purchaseOrderId: order.id, projectId: order.projectId, stageId: order.stageId || null, receiptNumber, receivedDate: input.receivedDate ? new Date(input.receivedDate) : null, notes: input.notes || null, status: "posted", createdBy: ctx.user.id });
        const receiptId = Number(receiptResult[0].insertId);
        let receivedCost = 0;
        for (const received of input.items) {
          const item = (await db.select().from(purchaseOrderItems).where(and(eq(purchaseOrderItems.id, received.purchaseOrderItemId), eq(purchaseOrderItems.purchaseOrderId, order.id))).limit(1))[0];
          if (!item) throw new TRPCError({ code: "NOT_FOUND", message: "بند أمر الشراء غير موجود" });
          const quantity = Math.min(received.quantity, Number(item.quantity) - Number(item.receivedQuantity));
          if (quantity <= 0) continue;
          receivedCost += quantity * Number(item.unitCost);
          await db.insert(purchaseReceiptItems).values({ receiptId, purchaseOrderItemId: item.id, quantity: quantity.toFixed(3) });
          await db.update(purchaseOrderItems).set({ receivedQuantity: (Number(item.receivedQuantity) + quantity).toFixed(3) }).where(eq(purchaseOrderItems.id, item.id));
        }
        if (receivedCost > 0) await db.insert(expenses).values({ projectId: order.projectId, stageId: order.stageId || null, vendorId: order.vendorId, reference: receiptNumber, description: `استلام مواد من أمر شراء ${order.orderNumber}`, unit: "استلام", quantity: "1.000", expenseType: "materials", classification: "project", preTaxAmount: receivedCost.toFixed(2), taxRate: "0.00", taxAmount: "0.00", totalAmount: receivedCost.toFixed(2), paidAmount: "0.00", status: "posted", expenseDate: input.receivedDate ? new Date(input.receivedDate) : new Date(), createdBy: ctx.user.id });
        const refreshedOrderItems = await db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.purchaseOrderId, order.id));
        const fullyReceived = refreshedOrderItems.length > 0 && refreshedOrderItems.every((item) => Number(item.receivedQuantity) >= Number(item.quantity) - 0.0001);
        await db.update(purchaseOrders).set({ status: fullyReceived ? "received" : "partially_received" }).where(eq(purchaseOrders.id, order.id));
        await db.insert(auditLogs).values({ entityType: "purchaseReceipt", entityId: receiptId, action: "posted", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, receivedCost }) });
        return { id: receiptId, receiptNumber, receivedCost };
      }),
    }),
  }),

  approvals: router({
    policies: router({
      list: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const rows = await db.select().from(approvalPolicies).where(eq(approvalPolicies.projectId, input.projectId));
        return rows.filter((row) => row.projectId === input.projectId);
      }),
      upsert: adminProcedure.input(z.object({ projectId: z.number().int().positive(), entityType: z.enum(["expense", "payroll", "certificate", "collection", "sale"]), thresholdAmount: z.number().nonnegative() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const existingRows = await db.select().from(approvalPolicies).where(eq(approvalPolicies.projectId, input.projectId));
        const existing = existingRows.find((row) => row.projectId === input.projectId && row.entityType === input.entityType);
        if (existing) {
          await db.update(approvalPolicies).set({ thresholdAmount: input.thresholdAmount.toFixed(2), updatedBy: ctx.user.id }).where(eq(approvalPolicies.id, existing.id));
          await db.insert(auditLogs).values({ entityType: "approvalPolicy", entityId: existing.id, action: "updated", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
          return { id: existing.id, updated: true } as const;
        }
        const result = await db.insert(approvalPolicies).values({ projectId: input.projectId, entityType: input.entityType, thresholdAmount: input.thresholdAmount.toFixed(2), createdBy: ctx.user.id, updatedBy: ctx.user.id });
        const id = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "approvalPolicy", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id, updated: false } as const;
      }),
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const projectRows = companyId ? await db.select({ id: projects.id }).from(projects).where(eq(projects.companyId, companyId)) : [];
      const companyProjectIds = new Set(projectRows.map((project) => project.id));
      const rows = await db.select().from(approvalRequests).orderBy(approvalRequests.createdAt);
      const companyRows = rows.filter((row) => row.projectId === null || companyProjectIds.has(row.projectId));
      return allowed ? companyRows.filter((row) => row.projectId === null || allowed.has(row.projectId)) : companyRows;
    }),
    pendingElsewhere: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        const db = requireDb(await getDb());
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        const companyId = await resolveActiveCompanyId(db, ctx);
        const [requests, projectRows, userRows, memberRows, certificateRows, payrollRows, payrollRunRows, requisitionRows, documentRows, saleRows] = await Promise.all([
          db.select().from(approvalRequests).where(eq(approvalRequests.status, "pending")).orderBy(approvalRequests.createdAt),
          companyId ? db.select({ id: projects.id, name: projects.name }).from(projects).where(eq(projects.companyId, companyId)) : db.select({ id: projects.id, name: projects.name }).from(projects),
          db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users),
          db.select({ projectId: projectMembers.projectId, userId: projectMembers.userId, projectRole: projectMembers.projectRole }).from(projectMembers),
          db.select({ id: certificates.id, certificateNumber: certificates.certificateNumber, projectId: certificates.projectId, description: certificates.description, totalAmount: certificates.totalAmount, certificateDate: certificates.certificateDate, createdBy: certificates.createdBy }).from(certificates),
          db.select({ id: payroll.id, month: payroll.month, year: payroll.year, employeeName: payroll.employeeName, totalAmount: payroll.totalAmount, createdAt: payroll.createdAt, createdBy: payroll.createdBy }).from(payroll),
          db.select({ id: payrollRuns.id, runNumber: payrollRuns.runNumber, month: payrollRuns.month, year: payrollRuns.year, totalAmount: payrollRuns.totalAmount, createdAt: payrollRuns.createdAt, createdBy: payrollRuns.createdBy }).from(payrollRuns),
          db.select({ id: materialRequisitions.id, requestNumber: materialRequisitions.requestNumber, projectId: materialRequisitions.projectId, description: materialRequisitions.description, createdAt: materialRequisitions.createdAt, requestedBy: materialRequisitions.requestedBy }).from(materialRequisitions),
          db.select({ id: accountingDocuments.id, documentNumber: accountingDocuments.documentNumber, documentType: accountingDocuments.documentType, notes: accountingDocuments.notes, totalAmount: accountingDocuments.totalAmount, documentDate: accountingDocuments.documentDate, createdBy: accountingDocuments.createdBy }).from(accountingDocuments),
          db.select({ id: sales.id, projectId: sales.projectId, customerName: sales.customerName, totalAmount: sales.totalAmount, saleDate: sales.saleDate, createdBy: sales.createdBy }).from(sales),
        ]);
        const projectMap = new Map(projectRows.map((row) => [row.id, row]));
        const certificateMap = new Map(certificateRows.map((row) => [row.id, row]));
        const payrollMap = new Map(payrollRows.map((row) => [row.id, row]));
        const payrollRunMap = new Map(payrollRunRows.map((row) => [row.id, row]));
        const requisitionMap = new Map(requisitionRows.map((row) => [row.id, row]));
        const documentMap = new Map(documentRows.map((row) => [row.id, row]));
        const saleMap = new Map(saleRows.map((row) => [row.id, row]));
        const userMap = new Map(userRows.map((row) => [row.id, row]));
        const stageLabel = (stage?: string | null) => stage === "mostafa" ? "مصطفى" : stage === "owner" ? "المالك" : stage === "project_manager" ? "مدير المشاريع" : stage === "general_manager" ? "المدير العام" : "المسؤول المعتمد";
        const recipientsFor = (request: typeof requests[number]) => {
          if (request.approvalStage === "mostafa") return userRows.filter((user) => user.id === 13170001);
          if (request.approvalStage === "project_manager") {
            const memberIds = memberRows.filter((member) => member.projectId === request.projectId && member.projectRole === "manager").map((member) => member.userId);
            return userRows.filter((user) => memberIds.includes(user.id) || user.role === "project_manager");
          }
          if (request.approvalStage === "general_manager") return userRows.filter((user) => user.role === "general_manager");
          return userRows.filter((user) => user.role === "admin");
        };
        const visible = allowed ? requests.filter((row) => row.projectId === null || allowed.has(row.projectId)) : requests;
        return visible.map((request) => {
          const certificate = request.entityType === "certificate" ? certificateMap.get(request.entityId) : undefined;
          const payrollRow = request.entityType === "payroll" ? payrollMap.get(request.entityId) : undefined;
          const payrollRun = request.entityType === "payroll_run" ? payrollRunMap.get(request.entityId) : undefined;
          const requisition = request.entityType === "materialRequisition" ? requisitionMap.get(request.entityId) : undefined;
          const document = ["purchase_payment", "payment_voucher"].includes(request.entityType) ? documentMap.get(request.entityId) : undefined;
          const sale = request.entityType === "sale" ? saleMap.get(request.entityId) : undefined;
          const typeLabel = certificate ? "مستخلص مقاول" : payrollRun ? "مسير رواتب جماعي" : payrollRow ? "راتب منفرد" : requisition ? "طلب شراء مواد" : document ? (document.documentType === "purchase_invoice" ? "فاتورة شراء" : document.documentType === "payment_voucher" ? "سند صرف" : "مستند محاسبي") : sale ? "مبيعات" : request.entityType;
          const title = certificate?.certificateNumber || (payrollRun ? payrollRun.runNumber : payrollRow ? `مسير ${payrollRow.month}/${payrollRow.year}` : requisition?.requestNumber || document?.documentNumber || (sale ? `بيع الوحدة — ${sale.customerName}` : `${request.entityType} #${request.entityId}`));
          const source = certificate || payrollRun || payrollRow || requisition || document || sale;
          const requestedBy = request.requestedBy || (source as { createdBy?: number | null } | undefined)?.createdBy || requisition?.requestedBy || null;
          const recipients = recipientsFor(request);
          const description = certificate?.description || requisition?.description || document?.notes || (sale ? `بيع وحدة للعميل ${sale.customerName}` : payrollRun ? `مسير ${payrollRun.month}/${payrollRun.year} بقيمة إجمالية ${Number(payrollRun.totalAmount || 0).toFixed(2)} ر.س` : payrollRow ? `راتب شهر ${payrollRow.month}/${payrollRow.year} — ${payrollRow.employeeName}` : "—");
          const workflow = getApprovalWorkflowStages(request.entityType, requestedBy);
          const workflowLabel = workflow.map((step) => step.label).join(" ← ");
          const workflowStages = workflow.map((step) => ({ ...step, status: step.stage === request.approvalStage ? "current" as const : request.stageOrder && step.order < request.stageOrder ? "approved" as const : "upcoming" as const, responsibleUsers: recipientsFor({ ...request, approvalStage: step.stage }) }));
          const recordLabel = `${title} ${description}`.includes("تجريبي") ? "سجل تجريبي" : "مستند فعلي";
          const sourceExists = Boolean(source);
          return { ...request, title, typeLabel, description, amount: Number(certificate?.totalAmount || payrollRun?.totalAmount || payrollRow?.totalAmount || document?.totalAmount || sale?.totalAmount || 0), documentDate: certificate?.certificateDate || payrollRun?.createdAt || payrollRow?.createdAt || requisition?.createdAt || document?.documentDate || sale?.saleDate || request.createdAt, requesterName: requestedBy ? userMap.get(requestedBy)?.name || `مستخدم #${requestedBy}` : "غير محدد", requestedBy, workflowLabel, workflowStages, recordLabel, sourceExists, projectName: request.projectId ? projectMap.get(request.projectId)?.name || `مشروع #${request.projectId}` : "مسير عام للشركة", stageLabel: stageLabel(request.approvalStage), responsibleUsers: recipients, isCurrentUserResponsible: recipients.some((user) => user.id === ctx.user.id), waitingDays: Math.max(0, Math.floor((Date.now() - new Date(request.createdAt).getTime()) / 86400000)) };
        }).filter((item) => item.sourceExists);
      }),
      sendReminder: protectedProcedure.input(z.object({ approvalId: z.number().int().positive(), message: z.string().trim().max(1000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const request = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.id, input.approvalId), eq(approvalRequests.status, "pending"))).limit(1))[0];
        if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "الموافقة المعلقة غير موجودة" });
        const canSendReminder = ctx.user.role === "admin" || ctx.user.role === "general_manager" || ctx.user.role === "project_manager" || Number(ctx.user.id) === 13170001;
        if (!canSendReminder) throw new TRPCError({ code: "FORBIDDEN", message: "إرسال تذكير الموافقة متاح للمسؤولين فقط" });
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        if (request.projectId && allowed && !allowed.has(request.projectId)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية على هذا المشروع" });
        const userRows = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users);
        const recipients = request.approvalStage === "mostafa" ? userRows.filter((user) => user.id === 13170001) : request.approvalStage === "general_manager" ? userRows.filter((user) => user.role === "general_manager") : request.approvalStage === "project_manager" ? userRows.filter((user) => user.role === "project_manager") : userRows.filter((user) => user.role === "admin");
        const withEmail = recipients.filter((user) => user.email);
        if (!withEmail.length) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يوجد بريد إلكتروني للمسؤول الحالي" });
        const message = input.message || `يوجد مستند بانتظار ${request.approvalStage === "mostafa" ? "مراجعتك" : "اعتمادك"}. يرجى فتح صفحة الموافقات واتخاذ القرار أو الرفض بسبب واضح.`;
        await Promise.all(withEmail.map((user) => sendApprovalEmail({ to: user.email!, recipientName: user.name, title: "تذكير بموافقة معلقة", message, approvalUrl: `${getAppUrl()}/approvals` })));
        await Promise.all(withEmail.map((user) => db.insert(notifications).values({ userId: user.id, type: "approval_reminder", title: "تذكير بموافقة معلقة", message })));
        await db.insert(auditLogs).values({ entityType: "approval", entityId: request.id, action: "reminder_sent", actorId: ctx.user.id, afterJson: JSON.stringify({ recipients: withEmail.map((user) => user.id), message }) });
        return { success: true, recipients: withEmail.map((user) => user.name) } as const;
      }),
    }),
    decide: protectedProcedure
      .input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(1000).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const request = (await db.select().from(approvalRequests).where(eq(approvalRequests.id, input.id)).limit(1))[0];
        if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "طلب الموافقة غير موجود" });
        if (!canReviewApproval(ctx.user, request)) throw new TRPCError({ code: "FORBIDDEN", message: "لا يملك هذا الدور صلاحية اعتماد هذا النوع من المستندات" });
        await db.update(approvalRequests).set({ status: input.decision, reviewedBy: ctx.user.id, note: input.note || null, reviewedAt: new Date() }).where(eq(approvalRequests.id, input.id));
        const approved = input.decision === "approved";
        if (request.entityType === "purchase_payment") {
          const payment = (await db.select().from(accountingDocuments).where(eq(accountingDocuments.id, request.entityId)).limit(1))[0];
          if (!payment || payment.documentType !== "payment_voucher" || !payment.purchaseInvoiceId) throw new TRPCError({ code: "NOT_FOUND", message: "سند صرف المورد أو فاتورة الشراء غير موجودة" });
          if (!approved) {
            await db.update(accountingDocuments).set({ status: "cancelled" }).where(eq(accountingDocuments.id, payment.id));
          } else {
            await db.update(accountingDocuments).set({ status: "posted" }).where(eq(accountingDocuments.id, payment.id));
            const invoice = (await db.select().from(accountingDocuments).where(eq(accountingDocuments.id, payment.purchaseInvoiceId)).limit(1))[0];
            if (!invoice || invoice.documentType !== "purchase_invoice") throw new TRPCError({ code: "NOT_FOUND", message: "فاتورة الشراء المرتبطة غير موجودة" });
            const paidAfter = Number(invoice.paidAmount || 0) + Number(payment.totalAmount || 0);
            const paymentStatus = paidAfter >= Number(invoice.totalAmount || 0) - 0.005 ? "paid" : "partially_paid" as const;
            await db.update(accountingDocuments).set({ paidAmount: paidAfter.toFixed(2), paymentStatus }).where(eq(accountingDocuments.id, invoice.id));
            await db.insert(auditLogs).values({ entityType: "accountingDocument", entityId: payment.id, action: "supplier_payment_approved", actorId: ctx.user.id, afterJson: JSON.stringify({ invoiceId: invoice.id, paidAmount: paidAfter, paymentStatus }) });
          }
        }
        if (request.entityType === "expense") await db.update(expenses).set({ status: approved ? "approved" : "rejected" }).where(eq(expenses.id, request.entityId));
        if (request.entityType === "payroll") {
          if (!approved) {
            await db.update(payroll).set({ status: "draft" }).where(eq(payroll.id, request.entityId));
            await notifyApprovalUsers(db, { type: "payroll_returned_for_revision", title: `مسير الراتب يحتاج تعديلًا #${request.entityId}`, message: `تم رفض مسير الراتب وإعادته إلى منشئه للتعديل ثم إعادة الإرسال للاعتماد.`, userIds: [request.requestedBy], roles: [] });
          } else if (request.approvalStage === "owner") {
            await db.insert(approvalRequests).values({ projectId: request.projectId, entityType: "payroll", entityId: request.entityId, requestedBy: request.requestedBy, status: "pending", approvalStage: "general_manager", stageOrder: 2 });
            await db.insert(auditLogs).values({ entityType: "payroll", entityId: request.entityId, action: "owner_approved_general_manager_pending", actorId: ctx.user.id });
            await notifyApprovalUsers(db, { type: "payroll_general_manager_pending", title: `مسير راتب بانتظار اعتماد المدير العام #${request.entityId}`, message: `تم اعتماد مسير الراتب من المالك وأصبح بانتظار اعتماد المدير العام.`, roles: ["general_manager"] });
          } else {
            await db.update(payroll).set({ status: "approved" }).where(eq(payroll.id, request.entityId));
          }
        }
        if (request.entityType === "payroll_run") {
          const run = (await db.select().from(payrollRuns).where(eq(payrollRuns.id, request.entityId)).limit(1))[0];
          if (!run) throw new TRPCError({ code: "NOT_FOUND", message: "مسير الرواتب غير موجود" });
        if (!approved) {
          await db.update(payrollRuns).set({ status: "rejected" }).where(eq(payrollRuns.id, run.id));
          await db.update(payroll).set({ status: "draft" }).where(eq(payroll.payrollRunId, run.id));
          await releaseAdvanceRepaymentReservationsForRun(db, run);
            await notifyApprovalUsers(db, { type: "payroll_run_returned", title: `مسير الرواتب ${run.runNumber} يحتاج تعديلًا`, message: `تم رفض مسير الرواتب وإعادته إلى منشئه للتعديل ثم إعادة الإرسال.`, userIds: [run.createdBy || request.requestedBy], roles: [] });
          } else if (request.approvalStage === "owner") {
            await db.insert(approvalRequests).values({ projectId: null, entityType: "payroll_run", entityId: run.id, requestedBy: request.requestedBy, status: "pending", approvalStage: "general_manager", stageOrder: 2 });
            await db.insert(auditLogs).values({ entityType: "payroll_run", entityId: run.id, action: "owner_approved_general_manager_pending", actorId: ctx.user.id });
            await notifyApprovalUsers(db, { type: "payroll_run_general_manager_pending", title: `مسير الرواتب ${run.runNumber} بانتظار اعتماد وتوقيع المدير العام`, message: `اعتمد المالك مسير رواتب ${run.month}/${run.year} وهو الآن بانتظار الاعتماد والتوقيع النهائي.`, roles: ["general_manager"] });
          } else {
            const rows = await db.select().from(payroll).where(eq(payroll.payrollRunId, run.id));
            if (!rows.length) throw new TRPCError({ code: "BAD_REQUEST", message: "مسير الرواتب لا يحتوي على صفوف" });
            let accrualDocumentId = run.accrualDocumentId;
            if (!accrualDocumentId) {
              const companyAccounts = (await db.select().from(accounts)).filter((account) => account.companyId === run.companyId && account.isActive === 1);
              const payrollPayable = companyAccounts.find((account) => account.code === "2103");
              const projectPayrollExpense = companyAccounts.find((account) => account.code === "5202");
              const administrativePayrollExpense = companyAccounts.find((account) => account.code === "5305") || projectPayrollExpense;
              if (!payrollPayable || !projectPayrollExpense || !administrativePayrollExpense) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "تأكد من وجود حسابات رواتب وأجور المشاريع (5202) ورواتب إدارية (5305) ورواتب وأجور مستحقة (2103) قبل اعتماد المسير" });
              const grossAmount = rows.reduce((sum, row) => sum + calculatePayrollAdvanceAccrualAmounts(Number(row.totalAmount || 0), Number(row.advanceDeductionAmount || 0)).payrollExpenseAmount, 0);
              const advanceDeductionAmount = rows.reduce((sum, row) => sum + Number(row.advanceDeductionAmount || 0), 0);
              const totalAmount = rows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
              const employeeAdvanceAccountId = advanceDeductionAmount > 0.005 && run.companyId ? await ensureEmployeeAdvanceAccount(db, run.companyId, ctx.user.id) : null;
              const documentNumber = `PA-${Date.now()}`;
              const created = await db.insert(accountingDocuments).values({ companyId: run.companyId || null, documentType: "journal_entry", documentNumber, partyName: `مسير رواتب ${run.month}/${run.year}`, sourceDocumentId: run.id, documentDate: new Date(), amount: grossAmount.toFixed(2), taxAmount: "0.00", totalAmount: grossAmount.toFixed(2), paymentStatus: "unpaid", status: "posted", notes: `إثبات رواتب وأجور مستحقة وتسوية سلف لمسير ${run.runNumber}`, createdBy: ctx.user.id });
              accrualDocumentId = Number(created[0].insertId);
              const debitLines = rows.map((row) => ({ documentId: accrualDocumentId!, accountId: row.classification === "administrative" ? administrativePayrollExpense.id : projectPayrollExpense.id, projectId: row.projectId || null, stageId: row.stageId || null, description: `إجمالي الراتب المستحق — ${row.employeeName} — ${run.month}/${run.year}`, debit: calculatePayrollAdvanceAccrualAmounts(Number(row.totalAmount || 0), Number(row.advanceDeductionAmount || 0)).payrollExpenseAmount.toFixed(2), credit: "0.00" }));
              const settlementLines = advanceDeductionAmount > 0.005 && employeeAdvanceAccountId ? [{ documentId: accrualDocumentId, accountId: payrollPayable.id, projectId: null, stageId: null, description: `تسوية سلف الموظفين من مسير ${run.runNumber}`, debit: advanceDeductionAmount.toFixed(2), credit: "0.00" }, { documentId: accrualDocumentId, accountId: employeeAdvanceAccountId, projectId: null, stageId: null, description: `إقفال جزء سلف الموظفين — ${run.month}/${run.year}`, debit: "0.00", credit: advanceDeductionAmount.toFixed(2) }] : [];
              await db.insert(accountingDocumentLines).values([...debitLines, { documentId: accrualDocumentId, accountId: payrollPayable.id, projectId: null, stageId: null, description: `إجمالي رواتب وأجور مستحقة — ${run.runNumber}`, debit: "0.00", credit: grossAmount.toFixed(2) }, ...settlementLines]);
            }
            await db.update(payrollRuns).set({ status: "approved", approvedAt: new Date(), approvedBy: ctx.user.id, accrualDocumentId }).where(eq(payrollRuns.id, run.id));
            await db.update(payroll).set({ status: "approved" }).where(eq(payroll.payrollRunId, run.id));
            const reservedRepayments = await db.select().from(advanceRepayments).where(and(eq(advanceRepayments.payrollRunId, run.id), eq(advanceRepayments.status, "reserved")));
            const next = nextPayrollPeriod(run.month, run.year);
            const carryForwardRows = reservedRepayments.flatMap((repayment) => {
              const remaining = Number((Math.max(Number(repayment.scheduledAmount || 0) - Number(repayment.appliedAmount || 0), 0)).toFixed(2));
              return remaining > 0.005 ? [{ advanceRequestId: repayment.advanceRequestId, employeeId: repayment.employeeId, scheduledMonth: next.month, scheduledYear: next.year, scheduledAmount: remaining.toFixed(2), createdBy: ctx.user.id }] : [];
            });
            await db.update(advanceRepayments).set({ status: "applied" }).where(and(eq(advanceRepayments.payrollRunId, run.id), eq(advanceRepayments.status, "reserved")));
            if (carryForwardRows.length) await db.insert(advanceRepayments).values(carryForwardRows);
            await db.insert(auditLogs).values({ entityType: "payroll_run", entityId: run.id, action: "general_manager_approved_and_accrued", actorId: ctx.user.id, afterJson: JSON.stringify({ accrualDocumentId }) });
          }
        }
        if (request.entityType === "sale") await db.update(sales).set({ status: approved ? "confirmed" : "cancelled" }).where(eq(sales.id, request.entityId));
        if (request.entityType === "collection") await db.update(collections).set({ status: approved ? "received" : "reversed" }).where(eq(collections.id, request.entityId));
        if (request.entityType === "certificate") {
          if (!approved) {
            await db.update(certificates).set({ status: "rejected" }).where(eq(certificates.id, request.entityId));
          } else if (nextCertificateApproval(request.stageOrder)) {
            const nextStage = nextCertificateApproval(request.stageOrder)!;
            const certificate = (await db.select().from(certificates).where(eq(certificates.id, request.entityId)).limit(1))[0];
            await db.insert(approvalRequests).values({ projectId: request.projectId, entityType: "certificate", entityId: request.entityId, requestedBy: certificate?.createdBy || ctx.user.id, status: "pending", approvalStage: nextStage.approvalStage, stageOrder: nextStage.stageOrder });
          } else {
            await db.update(certificates).set({ status: "approved" }).where(eq(certificates.id, request.entityId));
          }
        }
        await db.insert(auditLogs).values({ entityType: "approval", entityId: input.id, action: input.decision, actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, approvalStage: request.approvalStage, stageOrder: request.stageOrder }) });
        return { success: true } as const;
      }),
  }),

  payroll: router({
    createAdministrative: protectedProcedure.input(z.object({ employeeName: z.string().trim().min(1), employeeCode: z.string().trim().max(64).optional(), month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100), amount: z.number().positive(), paidAmount: z.number().nonnegative().default(0) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(projects).where(eq(projects.status, "active"));
      const visible = (allowed ? rows.filter((row) => allowed.has(row.id)) : rows).filter((row) => Number(row.contractValue || 0) > 0 && row.classification === "operational");
      const totalContractValue = visible.reduce((sum, row) => sum + Number(row.contractValue || 0), 0);
      if (!totalContractValue) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد مشاريع نشطة بقيم عقود صالحة للتوزيع" });
      const inserted = await db.insert(administrativePayroll).values({ employeeName: input.employeeName, employeeCode: input.employeeCode || null, month: input.month, year: input.year, totalAmount: input.amount.toFixed(2), paidAmount: input.paidAmount.toFixed(2), createdBy: ctx.user.id, status: "pending" });
      const administrativePayrollId = Number(inserted[0].insertId);
      await db.insert(payrollAllocations).values(visible.map((project) => { const ratio = Number(project.contractValue || 0) / totalContractValue; return { administrativePayrollId, projectId: project.id, ratio: ratio.toFixed(6), allocatedAmount: (input.amount * ratio).toFixed(2) }; }));
      return { id: administrativePayrollId, allocations: visible.map((project) => { const ratio = Number(project.contractValue || 0) / totalContractValue; return { projectId: project.id, projectName: project.name, ratio, allocatedAmount: input.amount * ratio }; }) };
    }),
    administrativeList: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(administrativePayroll).orderBy(administrativePayroll.createdAt);
      const allocations = await db.select().from(payrollAllocations);
      return (allowed ? rows : rows).map((row) => ({ ...row, allocations: allocations.filter((allocation) => allocation.administrativePayrollId === row.id && (!allowed || allowed.has(allocation.projectId))) }));
    }),
    adminAllocationPreview: protectedProcedure.input(z.object({ amount: z.number().nonnegative() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(projects).where(eq(projects.status, "active"));
      const visible = (allowed ? rows.filter((row) => allowed.has(row.id)) : rows).filter((row) => Number(row.contractValue || 0) > 0);
      const totalContractValue = visible.reduce((sum, row) => sum + Number(row.contractValue || 0), 0);
      return visible.map((project) => { const ratio = totalContractValue ? Number(project.contractValue || 0) / totalContractValue : 0; return { projectId: project.id, projectName: project.name, contractValue: Number(project.contractValue || 0), ratio, allocatedAmount: input.amount * ratio }; });
    }),
    runs: router({
      advancePreview: protectedProcedure.input(z.object({ month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100) })).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "payroll");
        const [employeeRows, advanceRows, repaymentRows] = await Promise.all([db.select().from(employees).where(eq(employees.status, "active")), db.select().from(advanceRequests).where(eq(advanceRequests.status, "approved")), db.select().from(advanceRepayments)]);
        return employeeRows.map((employee) => {
          const employeeAdvances = advanceRows.filter((advance) => advance.employeeId === employee.id);
          const allRepayments = repaymentRows.filter((repayment) => repayment.employeeId === employee.id && repayment.status !== "cancelled");
          const dueRepayments = allRepayments.filter((repayment) => isRepaymentDue(repayment, input.month, input.year));
          const appliedAmount = allRepayments.filter((repayment) => repayment.status === "applied").reduce((total, repayment) => total + Number(repayment.appliedAmount || 0), 0);
          const grantedAmount = employeeAdvances.reduce((total, advance) => total + Number(advance.amount || 0), 0);
          const legacyUnscheduledAmount = employeeAdvances.filter((advance) => !allRepayments.some((repayment) => repayment.advanceRequestId === advance.id)).reduce((total, advance) => total + Number(advance.amount || 0), 0);
          return { employeeId: employee.id, grantedAmount, appliedAmount, outstandingAmount: Math.max(grantedAmount - appliedAmount, 0), dueAmount: dueRepayments.reduce((total, repayment) => total + Math.max(Number(repayment.scheduledAmount || 0) - Number(repayment.appliedAmount || 0), 0), 0), dueRepaymentIds: dueRepayments.map((repayment) => repayment.id), legacyUnscheduledAmount };
        });
      }),
      list: protectedProcedure.query(async ({ ctx }) => {
        const db = requireDb(await getDb());
        const companyId = await resolveActiveCompanyId(db, ctx);
        const runs = companyId ? await db.select().from(payrollRuns).where(eq(payrollRuns.companyId, companyId)) : [];
        const rows = await db.select().from(payroll);
        const settlements = await db.select().from(payrollSettlements);
        return runs.map((run) => {
          const runRows = rows.filter((row) => row.payrollRunId === run.id);
          const total = runRows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
          const paid = runRows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
          return { ...run, totalAmount: total, paidAmount: paid, outstandingAmount: Math.max(total - paid, 0), rows: runRows, settlementCount: settlements.filter((settlement) => settlement.payrollRunId === run.id).length };
        }).sort((a, b) => Number(b.id) - Number(a.id));
      }),
      createDraft: protectedProcedure.input(z.object({ month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100), rows: z.array(z.object({ projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), employeeId: z.number().int().positive().optional(), employeeName: z.string().trim().min(2), employeeCode: z.string().trim().max(64).optional(), classification: z.enum(["project", "administrative"]), allocationRatio: z.number().min(0).max(100).default(100), amount: z.number().positive(), absenceDays: z.number().int().nonnegative().default(0), deductionAmount: z.number().nonnegative().default(0), advanceAction: z.enum(["apply", "defer"]).default("defer"), advanceDeductionAmount: z.number().nonnegative().default(0) })).min(1) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "payroll");
        const companyId = await resolveActiveCompanyId(db, ctx);
        if (!companyId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا توجد شركة نشطة" });
        const repaymentRows = await db.select().from(advanceRepayments);
        const prepared = [] as Array<{ row: typeof input.rows[number]; total: ReturnType<typeof calculatePayrollTotalsWithDeduction>; applicableRepayments: typeof repaymentRows; advanceDeductionAmount: number }>;
        for (const row of input.rows) {
          if (row.classification === "project" && !row.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر مشروعًا لكل راتب مشروع" });
          if (row.projectId) { await assertProjectAccess(db, ctx, row.projectId); await assertProjectWrite(db, ctx, row.projectId); await assertPeriodOpen(db, ctx, row.projectId, new Date(input.year, input.month - 1, 1)); }
          const applicableRepayments = row.employeeId ? repaymentRows.filter((repayment) => repayment.employeeId === row.employeeId && isRepaymentDue(repayment, input.month, input.year)) : [];
          const dueAmount = applicableRepayments.reduce((total, repayment) => total + Math.max(Number(repayment.scheduledAmount || 0) - Number(repayment.appliedAmount || 0), 0), 0);
          const advanceDeductionAmount = row.advanceAction === "apply" ? calculateAdvanceDeduction({ grossPayrollAmount: row.amount, otherDeductionAmount: row.deductionAmount, dueAmount, requestedAmount: row.advanceDeductionAmount }).appliedAmount : 0;
          prepared.push({ row, applicableRepayments, advanceDeductionAmount, total: calculatePayrollTotalsWithDeduction(row.amount, row.deductionAmount + advanceDeductionAmount) });
        }
        const totalAmount = prepared.reduce((sum, item) => sum + item.total.totalAmount, 0);
        const createdRun = await db.insert(payrollRuns).values({ companyId, runNumber: `PR-${input.year}${String(input.month).padStart(2, "0")}-${Date.now()}`, month: input.month, year: input.year, totalAmount: totalAmount.toFixed(2), paidAmount: "0.00", status: "draft", createdBy: ctx.user.id });
        const payrollRunId = Number(createdRun[0].insertId);
        const ids: number[] = [];
        for (const item of prepared) {
          const result = await db.insert(payroll).values({ payrollRunId, projectId: item.row.projectId || null, stageId: item.row.stageId || null, employeeId: item.row.employeeId || null, employeeName: item.row.employeeName, employeeCode: item.row.employeeCode || null, month: input.month, year: input.year, classification: item.row.classification, allocationRatio: (item.row.allocationRatio / 100).toFixed(6), preTaxAmount: item.row.amount.toFixed(2), taxAmount: "0.00", totalAmount: item.total.totalAmount.toFixed(2), paidAmount: "0.00", absenceDays: item.row.absenceDays, deductionAmount: item.row.deductionAmount.toFixed(2), advanceDeductionAmount: item.advanceDeductionAmount.toFixed(2), createdBy: ctx.user.id, status: "draft" });
          const payrollId = Number(result[0].insertId);
          ids.push(payrollId);
          if (item.row.advanceAction === "defer" && item.applicableRepayments.length) {
            const next = nextPayrollPeriod(input.month, input.year);
            for (const repayment of item.applicableRepayments) await db.update(advanceRepayments).set({ status: "deferred", scheduledMonth: next.month, scheduledYear: next.year, deferredAt: new Date(), payrollRunId, payrollId }).where(eq(advanceRepayments.id, repayment.id));
          }
          let remainingAdvanceDeduction = item.advanceDeductionAmount;
          for (const repayment of item.applicableRepayments) {
            if (remainingAdvanceDeduction <= 0) break;
            const available = Math.max(Number(repayment.scheduledAmount || 0) - Number(repayment.appliedAmount || 0), 0);
            const reservedAmount = Math.min(available, remainingAdvanceDeduction);
            await db.update(advanceRepayments).set({ status: "reserved", appliedAmount: reservedAmount.toFixed(2), payrollRunId, payrollId }).where(eq(advanceRepayments.id, repayment.id));
            remainingAdvanceDeduction = Number((remainingAdvanceDeduction - reservedAmount).toFixed(2));
          }
        }
        await db.insert(auditLogs).values({ entityType: "payroll_run", entityId: payrollRunId, action: "saved_draft", actorId: ctx.user.id, afterJson: JSON.stringify({ month: input.month, year: input.year, totalAmount, payrollIds: ids }) });
        return { id: payrollRunId, payrollIds: ids, totalAmount };
      }),
      deleteDraft: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "payroll");
        const run = (await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.id)).limit(1))[0];
        if (!run || run.createdBy !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "مسير الرواتب المسودة غير موجود" });
        if (!['draft', 'rejected'].includes(run.status)) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا يمكن حذف مسير محال للاعتماد أو معتمد؛ استخدم دورة التصحيح المعتمدة" });
        await releaseAdvanceRepaymentReservationsForRun(db, run);
        await db.delete(payroll).where(eq(payroll.payrollRunId, run.id));
        await db.delete(payrollRuns).where(eq(payrollRuns.id, run.id));
        await db.insert(auditLogs).values({ entityType: "payroll_run", entityId: run.id, action: "draft_deleted_and_advance_reservations_released", actorId: ctx.user.id });
        return { success: true } as const;
      }),
      addManual: protectedProcedure.input(z.object({ payrollRunId: z.number().int().positive().optional(), month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100), projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), employeeId: z.number().int().positive().optional(), employeeName: z.string().trim().min(2), employeeCode: z.string().trim().max(64).optional(), classification: z.enum(["project", "administrative"]), allocationRatio: z.number().min(0).max(100).default(100), amount: z.number().positive(), absenceDays: z.number().int().nonnegative().default(0), deductionAmount: z.number().nonnegative().default(0) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "payroll");
        if (input.classification === "project" && !input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر المشروع لراتب الأجير المرتبط بمشروع" });
        if (input.projectId) { await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId); }
        const companyId = await resolveActiveCompanyId(db, ctx);
        if (!companyId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا توجد شركة نشطة" });
        let run = input.payrollRunId ? (await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.payrollRunId)).limit(1))[0] : undefined;
        if (!run) {
          const created = await db.insert(payrollRuns).values({ companyId, runNumber: `PR-${input.year}${String(input.month).padStart(2, "0")}-${Date.now()}`, month: input.month, year: input.year, totalAmount: "0.00", paidAmount: "0.00", status: "draft", createdBy: ctx.user.id });
          run = (await db.select().from(payrollRuns).where(eq(payrollRuns.id, Number(created[0].insertId))).limit(1))[0];
        }
        if (!run || run.companyId !== companyId || run.status !== "draft") throw new TRPCError({ code: "BAD_REQUEST", message: "يمكن إضافة الأجير إلى مسير مسودة للشركة النشطة فقط" });
        if (run.month !== input.month || run.year !== input.year) throw new TRPCError({ code: "BAD_REQUEST", message: "شهر وسنة الأجير يجب أن تطابق المسير المحدد" });
        const totals = calculatePayrollTotalsWithDeduction(input.amount, input.deductionAmount);
        const created = await db.insert(payroll).values({ payrollRunId: run.id, projectId: input.projectId || null, stageId: input.stageId || null, employeeId: input.employeeId || null, employeeName: input.employeeName, employeeCode: input.employeeCode || null, month: input.month, year: input.year, classification: input.classification, allocationRatio: (input.allocationRatio / 100).toFixed(6), preTaxAmount: input.amount.toFixed(2), taxAmount: "0.00", totalAmount: totals.totalAmount.toFixed(2), paidAmount: "0.00", absenceDays: input.absenceDays, deductionAmount: totals.deductionAmount.toFixed(2), createdBy: ctx.user.id, status: "draft" });
        const payrollId = Number(created[0].insertId);
        const currentRows = await db.select().from(payroll).where(eq(payroll.payrollRunId, run.id));
        const runTotal = currentRows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        await db.update(payrollRuns).set({ totalAmount: runTotal.toFixed(2) }).where(eq(payrollRuns.id, run.id));
        return { payrollRunId: run.id, payrollId, totalAmount: runTotal };
      }),
      submit: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "payroll");
        const run = (await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.id)).limit(1))[0];
        if (!run || run.createdBy !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND", message: "مسير الرواتب المسودة غير موجود" });
        if (run.status !== "draft" && run.status !== "rejected") throw new TRPCError({ code: "BAD_REQUEST", message: "يمكن إرسال المسودة أو المسير المعاد فقط" });
        const rows = await db.select().from(payroll).where(eq(payroll.payrollRunId, run.id));
        if (!rows.length) throw new TRPCError({ code: "BAD_REQUEST", message: "أضف موظفًا أو أجيرًا واحدًا على الأقل قبل الإرسال" });
        const totalAmount = rows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        await db.update(payrollRuns).set({ status: "pending", totalAmount: totalAmount.toFixed(2), submittedAt: new Date() }).where(eq(payrollRuns.id, run.id));
        await db.update(payroll).set({ status: "pending" }).where(eq(payroll.payrollRunId, run.id));
        await db.insert(approvalRequests).values({ projectId: null, entityType: "payroll_run", entityId: run.id, requestedBy: ctx.user.id, status: "pending", approvalStage: "owner", stageOrder: 1 });
        await notifyApprovalUsers(db, { type: "payroll_run_owner_pending", title: `مسير رواتب ${run.runNumber} بانتظار اعتماد المالك`, message: `تم إرسال مسير رواتب ${run.month}/${run.year} بقيمة ${totalAmount.toFixed(2)} ر.س للاعتماد.`, roles: ["admin"] });
        return { id: run.id, status: "pending", totalAmount };
      }),
      settle: protectedProcedure.input(z.object({ payrollRunId: z.number().int().positive(), payrollIds: z.array(z.number().int().positive()).optional(), cashAccountId: z.number().int().positive(), paymentDate: z.string().min(10), notes: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "payment_voucher");
        const companyId = await resolveActiveCompanyId(db, ctx);
        const run = (await db.select().from(payrollRuns).where(eq(payrollRuns.id, input.payrollRunId)).limit(1))[0];
        if (!run || run.companyId !== companyId || !["approved", "partially_paid"].includes(run.status)) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر مسير رواتب معتمدًا وفيه رصيد مستحق" });
        const cashAccount = (await db.select().from(cashAccounts).where(eq(cashAccounts.id, input.cashAccountId)).limit(1))[0];
        if (!cashAccount?.accountId || cashAccount.companyId !== companyId || cashAccount.isActive !== 1) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر بنكًا أو خزينة نشطة من الشركة الحالية" });
        const runRows = await db.select().from(payroll).where(eq(payroll.payrollRunId, run.id));
        const selectedRows = runRows.filter((row) => (!input.payrollIds?.length || input.payrollIds.includes(row.id)) && Number(row.totalAmount || 0) - Number(row.paidAmount || 0) > 0.005);
        if (!selectedRows.length) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد رواتب مستحقة للموظفين المحددين" });
        const payable = (await db.select().from(accounts)).find((account) => account.companyId === companyId && account.code === "2103" && account.isActive === 1);
        if (!payable) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "حساب رواتب وأجور مستحقة (2103) غير متوفر" });
        const amount = selectedRows.reduce((sum, row) => sum + Math.max(Number(row.totalAmount || 0) - Number(row.paidAmount || 0), 0), 0);
        const documentNumber = `PV-${Date.now()}`;
        const created = await db.insert(accountingDocuments).values({ companyId: companyId || null, documentType: "payment_voucher", documentNumber, partyName: input.payrollIds?.length === 1 ? selectedRows[0].employeeName : `موظفو مسير ${run.month}/${run.year}`, voucherCategory: "payroll", sourceDocumentId: run.id, documentDate: new Date(input.paymentDate), sourceAccountId: cashAccount.accountId, amount: amount.toFixed(2), taxAmount: "0.00", totalAmount: amount.toFixed(2), paidAmount: amount.toFixed(2), paymentStatus: "paid", paymentMethod: cashAccount.accountType === "bank" ? "bank" : "cash", status: "posted", notes: input.notes || `تسديد رواتب مستحقة من المسير ${run.runNumber}`, createdBy: ctx.user.id });
        const documentId = Number(created[0].insertId);
        await db.insert(accountingDocumentLines).values([{ documentId, accountId: payable.id, projectId: null, stageId: null, description: `تسديد رواتب مستحقة — ${run.runNumber}`, debit: amount.toFixed(2), credit: "0.00" }, { documentId, accountId: cashAccount.accountId, projectId: null, stageId: null, description: `صرف من ${cashAccount.name} — رواتب ${run.month}/${run.year}`, debit: "0.00", credit: amount.toFixed(2) }]);
        for (const row of selectedRows) {
          const rowAmount = Math.max(Number(row.totalAmount || 0) - Number(row.paidAmount || 0), 0);
          await db.update(payroll).set({ paidAmount: Number(row.totalAmount || 0).toFixed(2), status: "paid" }).where(eq(payroll.id, row.id));
          await db.insert(payrollSettlements).values({ payrollRunId: run.id, payrollId: row.id, accountingDocumentId: documentId, amount: rowAmount.toFixed(2), createdBy: ctx.user.id });
        }
        const refreshedRows = await db.select().from(payroll).where(eq(payroll.payrollRunId, run.id));
        const paidAmount = refreshedRows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
        const totalAmount = refreshedRows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        const status = payrollRunPaymentStatus(totalAmount, paidAmount);
        await db.update(payrollRuns).set({ paidAmount: paidAmount.toFixed(2), status }).where(eq(payrollRuns.id, run.id));
        await db.insert(auditLogs).values({ entityType: "payroll_run", entityId: run.id, action: "settled_by_payment_voucher", actorId: ctx.user.id, afterJson: JSON.stringify({ documentId, payrollIds: selectedRows.map((row) => row.id), amount }) });
        return { documentId, documentNumber, amount, status, settledPayrollIds: selectedRows.map((row) => row.id) };
      }),
      outstanding: protectedProcedure.query(async ({ ctx }) => {
        const db = requireDb(await getDb());
        const companyId = await resolveActiveCompanyId(db, ctx);
        if (!companyId) return [];
        const runs = (await db.select().from(payrollRuns).where(eq(payrollRuns.companyId, companyId))).filter((run) => ["approved", "partially_paid"].includes(run.status));
        const rows = await db.select().from(payroll);
        return runs.map((run) => ({ ...run, rows: rows.filter((row) => row.payrollRunId === run.id).map((row) => ({ ...row, outstandingAmount: Math.max(Number(row.totalAmount || 0) - Number(row.paidAmount || 0), 0) })).filter((row) => row.outstandingAmount > 0.005) })).filter((run) => run.rows.length > 0);
      }),
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(payroll).orderBy(payroll.createdAt);
      return allowed ? rows.filter((row) => row.projectId === null || allowed.has(row.projectId)) : rows;
    }),
    attendanceSummary: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100) })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const rows = await db.select().from(attendance);
      const monthly = rows.filter((row) => {
        if (row.projectId !== input.projectId) return false;
        const date = new Date(row.attendanceDate);
        return date.getUTCFullYear() === input.year && date.getUTCMonth() + 1 === input.month;
      });
      return { total: monthly.length, present: monthly.filter((row) => row.status === "present").length, absent: monthly.filter((row) => row.status === "absent").length, late: monthly.filter((row) => row.status === "late").length, leave: monthly.filter((row) => row.status === "leave").length };
    }),
    createBatch: protectedProcedure.input(z.object({
      month: z.number().int().min(1).max(12),
      year: z.number().int().min(2000).max(2100),
      rows: z.array(z.object({ projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), employeeId: z.number().int().positive().optional(), employeeName: z.string().trim().min(2), employeeCode: z.string().trim().max(64).optional(), classification: z.enum(["project", "administrative"]).default("project"), allocationRatio: z.number().min(0).max(100).default(100), amount: z.number().nonnegative(), paidAmount: z.number().nonnegative().default(0), absenceDays: z.number().int().nonnegative().default(0), deductionAmount: z.number().nonnegative().default(0) })).min(1)
    })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const ids: number[] = [];
      for (const row of input.rows) {
        if (row.classification === "project" && !row.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب اختيار المشروع للراتب المرتبط بمشروع" });
        if (row.projectId) {
          await assertProjectAccess(db, ctx, row.projectId);
          await assertProjectWrite(db, ctx, row.projectId);
          await assertPeriodOpen(db, ctx, row.projectId, new Date(input.year, input.month - 1, 1));
        }
        const totals = calculatePayrollTotalsWithDeduction(row.amount, row.deductionAmount);
        const result = await db.insert(payroll).values({ projectId: row.projectId || null, stageId: row.stageId || null, employeeId: row.employeeId || null, employeeName: row.employeeName, employeeCode: row.employeeCode || null, month: input.month, year: input.year, classification: row.classification, allocationRatio: (row.allocationRatio / 100).toFixed(6), preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: "0.00", totalAmount: totals.totalAmount.toFixed(2), paidAmount: Math.min(row.paidAmount, totals.totalAmount).toFixed(2), absenceDays: row.absenceDays, deductionAmount: totals.deductionAmount.toFixed(2), createdBy: ctx.user.id, status: "pending" });
        const id = Number(result[0].insertId); ids.push(id);
        const approvalStatus = row.projectId ? await resolveApprovalStatus(db, row.projectId, "payroll", totals.totalAmount) : "pending" as const;
        if (approvalStatus === "approved") await db.update(payroll).set({ status: "approved" }).where(eq(payroll.id, id));
        await db.insert(approvalRequests).values({ projectId: row.projectId, entityType: "payroll", entityId: id, requestedBy: ctx.user.id, status: approvalStatus, approvalStage: "owner", stageOrder: 1 });
        await db.insert(auditLogs).values({ entityType: "payroll", entityId: id, action: "created_batch", actorId: ctx.user.id, afterJson: JSON.stringify({ ...row, month: input.month, year: input.year, ...totals }) });
        await notifyApprovalUsers(db, { type: "payroll_owner_pending", title: `مسير راتب بانتظار اعتماد المالك #${id}`, message: `تم إنشاء مسير راتب للشهر ${input.month}/${input.year} ويحتاج اعتماد المالك.`, roles: ["admin"] });
      }
      return { ids, count: ids.length };
    }),
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().int().positive().optional(),
        stageId: z.number().int().positive().optional(),
        employeeName: z.string().trim().min(2),
        employeeCode: z.string().trim().max(64).optional(),
        employeeId: z.number().int().positive().optional(),
        month: z.number().int().min(1).max(12),
        year: z.number().int().min(2000).max(2100),
        classification: z.enum(["project", "administrative"]).default("project"),
        amount: z.number().nonnegative(),
        paidAmount: z.number().nonnegative().default(0),
        absenceDays: z.number().int().nonnegative().default(0),
        deductionAmount: z.number().nonnegative().default(0),
        allocationRatio: z.number().min(0).max(100).default(100),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        if (input.classification === "project" && !input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب اختيار المشروع للراتب المرتبط بمشروع" });
        if (input.projectId) {
          await assertProjectAccess(db, ctx, input.projectId);
          await assertProjectWrite(db, ctx, input.projectId);
          await assertPeriodOpen(db, ctx, input.projectId, new Date(input.year, input.month - 1, 1));
        }
        const totals = calculatePayrollTotalsWithDeduction(input.amount, input.deductionAmount);
        const result = await db.insert(payroll).values({
          projectId: input.projectId || null,
          stageId: input.stageId || null,
          employeeName: input.employeeName,
          employeeCode: input.employeeCode || null,
          employeeId: input.employeeId || null,
          month: input.month,
          year: input.year,
          classification: input.classification,
          allocationRatio: (input.allocationRatio / 100).toFixed(6),
          preTaxAmount: totals.preTaxAmount.toFixed(2),
          taxAmount: totals.taxAmount.toFixed(2),
          totalAmount: totals.totalAmount.toFixed(2),
          paidAmount: Math.min(input.paidAmount, totals.totalAmount).toFixed(2),
          absenceDays: input.absenceDays,
          deductionAmount: totals.deductionAmount.toFixed(2),
          createdBy: ctx.user.id,
          status: "pending",
        });
        const payrollId = Number(result[0].insertId);
        const approvalStatus = input.projectId ? await resolveApprovalStatus(db, input.projectId, "payroll", totals.totalAmount) : "pending" as const;
        if (approvalStatus === "approved") await db.update(payroll).set({ status: "approved" }).where(eq(payroll.id, payrollId));
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "payroll", entityId: payrollId, requestedBy: ctx.user.id, status: approvalStatus, approvalStage: "owner", stageOrder: 1 });
        await notifyApprovalUsers(db, { type: "payroll_owner_pending", title: `مسير راتب بانتظار اعتماد المالك #${payrollId}`, message: `تم إنشاء مسير راتب للشهر ${input.month}/${input.year} ويحتاج اعتماد المالك.`, roles: ["admin"] });
        await db.insert(auditLogs).values({
          entityType: "payroll",
          entityId: payrollId,
          action: "created",
          actorId: ctx.user.id,
          afterJson: JSON.stringify({ ...input, ...totals }),
        });
        return { id: payrollId, taxAmount: totals.taxAmount, totalAmount: totals.totalAmount };
      }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), employeeName: z.string().trim().min(2), employeeCode: z.string().trim().max(64).optional(), employeeId: z.number().int().positive().optional(), month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100), classification: z.enum(["project", "administrative"]).default("project"), amount: z.number().nonnegative(), paidAmount: z.number().nonnegative().default(0), absenceDays: z.number().int().nonnegative().default(0), deductionAmount: z.number().nonnegative().default(0), allocationRatio: z.number().min(0).max(100).default(100) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const before = (await db.select().from(payroll).where(eq(payroll.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "مسير الراتب غير موجود" });
      if (ctx.user.role !== "admin" && Number(ctx.user.id) !== 13170001 && before.createdBy !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "تعديل المسير متاح لمنشئه أو مصطفى أو المالك" });
      if (input.classification === "project" && !input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب اختيار المشروع للراتب المرتبط بمشروع" });
      if (input.projectId) { await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId); await assertPeriodOpen(db, ctx, input.projectId, new Date(input.year, input.month - 1, 1)); }
      const totals = calculatePayrollTotalsWithDeduction(input.amount, input.deductionAmount);
      await db.update(payroll).set({ projectId: input.projectId || null, stageId: input.stageId || null, employeeId: input.employeeId || null, employeeName: input.employeeName, employeeCode: input.employeeCode || null, month: input.month, year: input.year, classification: input.classification, allocationRatio: (input.allocationRatio / 100).toFixed(6), preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), paidAmount: Math.min(input.paidAmount, totals.totalAmount).toFixed(2), absenceDays: input.absenceDays, deductionAmount: totals.deductionAmount.toFixed(2), status: "pending" }).where(eq(payroll.id, input.id));
      await db.update(approvalRequests).set({ status: "rejected", reviewedBy: ctx.user.id, reviewedAt: new Date(), note: "إعادة إرسال بعد التعديل" }).where(and(eq(approvalRequests.entityType, "payroll"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending")));
      await db.insert(approvalRequests).values({ projectId: input.projectId || null, entityType: "payroll", entityId: input.id, requestedBy: ctx.user.id, status: "pending", approvalStage: "owner", stageOrder: 1 });
      await db.insert(auditLogs).values({ entityType: "payroll", entityId: input.id, action: "updated_and_resubmitted_to_owner", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify({ ...input, ...totals }) });
      await notifyApprovalUsers(db, { type: "payroll_owner_pending", title: `مسير راتب معدل بانتظار اعتماد المالك #${input.id}`, message: `تم تعديل وإعادة إرسال مسير الراتب ويحتاج اعتماد المالك.`, roles: ["admin"] });
      return { id: input.id, status: "pending" as const, totalAmount: totals.totalAmount };
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const before = (await db.select().from(payroll).where(eq(payroll.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "مسير الراتب غير موجود" });
      await db.update(payroll).set({ status: "draft" }).where(eq(payroll.id, input.id));
      await db.update(approvalRequests).set({ status: "rejected", reviewedBy: ctx.user.id, reviewedAt: new Date(), note: "إلغاء المسير بواسطة المالك" }).where(and(eq(approvalRequests.entityType, "payroll"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending")));
      await db.insert(auditLogs).values({ entityType: "payroll", entityId: input.id, action: "cancelled_by_owner", actorId: ctx.user.id, beforeJson: JSON.stringify(before) });
      return { success: true } as const;
    }),
  }),

  vendors: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = await db.select().from(vendors).where(companyId ? eq(vendors.companyId, companyId) : eq(vendors.id, -1)).orderBy(vendors.name);
      return allowed ? rows.filter((row) => !row.projectId || allowed.has(row.projectId)) : rows;
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive().nullable().optional(), name: z.string().trim().min(2), partyType: z.enum(["supplier", "customer"]).optional(), entityType: z.enum(["individual", "company"]).optional(), taxNumber: z.string().max(128).optional(), commercialRegistration: z.string().max(128).optional(), nationalAddress: z.string().max(4000).optional(), address: z.string().max(4000).optional(), phone: z.string().max(64).optional(), email: z.string().email().optional().or(z.literal("")), iban: z.string().max(128).optional(), contact: z.string().max(255).optional() })).mutation(async ({ ctx, input }) => {
      if (!canManagePartners(ctx.user)) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية تعديل المورد" });
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const before = (await db.select().from(vendors).where(and(eq(vendors.id, input.id), companyId ? eq(vendors.companyId, companyId) : eq(vendors.id, -1))).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المورد غير موجود" });
      if (before.projectId) { await assertProjectAccess(db, ctx, before.projectId); await assertProjectWrite(db, ctx, before.projectId); }
      if (input.projectId) { await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId); }
      const { id, ...changes } = input;
      await db.update(vendors).set({ ...changes, projectId: changes.projectId ?? null, partyType: changes.partyType || before.partyType || "supplier", entityType: changes.entityType || before.entityType || "company", taxNumber: changes.taxNumber || null, commercialRegistration: changes.commercialRegistration || null, nationalAddress: changes.nationalAddress || null, address: changes.address || null, phone: changes.phone || null, email: changes.email || null, iban: changes.iban || null, contact: changes.contact || null }).where(eq(vendors.id, id));
      await db.insert(auditLogs).values({ entityType: "vendor", entityId: id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
      return { id } as const;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), name: z.string().trim().min(2), partyType: z.enum(["supplier", "customer"]).optional(), entityType: z.enum(["individual", "company"]).optional(), taxNumber: z.string().max(128).optional(), commercialRegistration: z.string().max(128).optional(), nationalAddress: z.string().max(4000).optional(), address: z.string().max(4000).optional(), phone: z.string().max(64).optional(), email: z.string().email().optional().or(z.literal("")), iban: z.string().max(128).optional(), contact: z.string().max(255).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.projectId) {
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
      }
      const companyId = await resolveActiveCompanyId(db, ctx);
      const result = await db.insert(vendors).values({ ...input, companyId: companyId || null, projectId: input.projectId || null, partyType: input.partyType || "supplier", entityType: input.entityType || "company", taxNumber: input.taxNumber || null, commercialRegistration: input.commercialRegistration || null, nationalAddress: input.nationalAddress || null, address: input.address || null, phone: input.phone || null, email: input.email || null, iban: input.iban || null, contact: input.contact || null });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "vendor", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
    remove: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      if (!canManagePartners(ctx.user) || ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "حذف العملاء والموردين متاح للمالك فقط" });
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const party = (await db.select().from(vendors).where(and(eq(vendors.id, input.id), companyId ? eq(vendors.companyId, companyId) : eq(vendors.id, -1))).limit(1))[0];
      if (!party) throw new TRPCError({ code: "NOT_FOUND", message: "الطرف غير موجود" });
      const [expenseUse, certificateUse, contractUse, documentRows] = await Promise.all([
        db.select({ id: expenses.id }).from(expenses).where(eq(expenses.vendorId, input.id)).limit(1),
        db.select({ id: certificates.id }).from(certificates).where(eq(certificates.vendorId, input.id)).limit(1),
        db.select({ id: contractorContracts.id }).from(contractorContracts).where(eq(contractorContracts.vendorId, input.id)).limit(1),
        db.select({ id: accountingDocuments.id, supplierId: accountingDocuments.supplierId, partyName: accountingDocuments.partyName }).from(accountingDocuments),
      ]);
      if (expenseUse.length || certificateUse.length || contractUse.length || documentRows.some((row) => row.supplierId === input.id || row.partyName === party.name)) throw new TRPCError({ code: "CONFLICT", message: "لا يمكن حذف طرف مرتبط بمستندات أو مصروفات أو عقود؛ عدّل بياناته بدلًا من الحذف" });
      await db.delete(vendors).where(eq(vendors.id, input.id));
      await db.insert(auditLogs).values({ entityType: "vendor", entityId: input.id, action: "deleted", actorId: ctx.user.id, beforeJson: JSON.stringify(party) });
      return { id: input.id };
    }),
  }),

  contractorContracts: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(contractorContracts).orderBy(contractorContracts.createdAt);
      const visible = allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
      const allCertificates = await db.select().from(certificates);
      return visible.map((contract) => {
        const used = allCertificates.filter((row) => row.contractId === contract.id && row.status !== "rejected").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        const contractItems = contract.contractItems ?? [];
        const certifiedLines = allCertificates.filter((row) => row.contractId === contract.id && row.status !== "rejected").flatMap((row) => row.certificateItems ?? []);
        const itemProgress = contractItems.map((item, index) => { const certifiedQty = certifiedLines.filter((line) => line.contractItemIndex === index).reduce((sum, line) => sum + Number(line.approvedQty || line.suppliedQty || line.installedQty || 0), 0); return { ...item, certifiedQty, remainingQty: Math.max(0, Number(item.contractedQty || 0) - certifiedQty) }; });
        return { ...contract, contractItems, itemProgress, totalCertificates: used, remaining: Math.max(0, Number(contract.totalAmount) - used), executionPct: Number(contract.totalAmount) > 0 ? (used / Number(contract.totalAmount)) * 100 : 0 };
      });
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), vendorId: z.number().int().positive(), contractNumber: z.string().trim().min(1), description: z.string().max(2000).optional(), contractType: z.enum(["building_stage", "supply", "supply_installation", "equipment_rental", "labor_supply"]).default("building_stage"), contractItems: z.array(z.object({ description: z.string().trim().min(1), unit: z.string().trim().min(1), contractedQty: z.number().positive(), unitPrice: z.number().nonnegative(), suppliedQty: z.number().nonnegative().default(0), installedQty: z.number().nonnegative().default(0), approvedQty: z.number().nonnegative().default(0), inventoryItemId: z.number().int().positive().optional(), costItemId: z.number().int().positive().optional() })).default([]), preTaxAmount: z.number().nonnegative(), taxRate: z.number().min(0).max(100).default(15), contractDate: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      await assertPeriodOpen(db, ctx, input.projectId, input.contractDate ? new Date(input.contractDate) : new Date());
      const projectCompany = (await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0];
      if (input.contractType !== "building_stage" && input.contractItems.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "عقد التوريد أو التوريد والتركيب يجب أن يحتوي على بند كمي واحد على الأقل" });
      let normalizedContractItems = input.contractItems;
      if (isMaterialContractType(input.contractType)) {
        const [inventoryRows, costItemRows, accountRows] = await Promise.all([db.select().from(inventoryItems), db.select().from(costItems), db.select().from(accounts)]);
        normalizedContractItems = input.contractItems.map((line) => {
          if (!line.inventoryItemId || !line.costItemId) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب ربط كل بند توريد ببطاقة خامة وبند تكلفة" });
          const material = inventoryRows.find((row) => row.id === line.inventoryItemId && (!row.projectId || row.projectId === input.projectId));
          if (!material) throw new TRPCError({ code: "BAD_REQUEST", message: "بطاقة الخامة غير موجودة أو لا تتبع المشروع" });
          const costItem = costItemRows.find((row) => row.id === line.costItemId && row.isActive === 1);
          if (!costItem) throw new TRPCError({ code: "BAD_REQUEST", message: "بند التكلفة غير موجود أو غير نشط" });
          const account = resolveMaterialCostAccount(costItem, accountRows);
          if (!account) throw new TRPCError({ code: "BAD_REQUEST", message: `لم يتم إعداد حساب مدين صالح لبند التكلفة «${costItem.name}». افتح إعدادات بند التكلفة واربطه بحساب أصل أو مصروف قابل للترحيل.` });
          return { ...line, accountId: account.id };
        });
      }
      const itemAmount = normalizedContractItems.reduce((sum, item) => sum + item.contractedQty * item.unitPrice, 0);
      const totals = calculateExpenseTotals(normalizedContractItems.length ? itemAmount : input.preTaxAmount, input.taxRate);
      const result = await db.insert(contractorContracts).values({ companyId: projectCompany?.companyId ?? null, projectId: input.projectId, stageId: input.stageId || null, vendorId: input.vendorId, contractNumber: input.contractNumber, description: input.description || null, contractType: input.contractType, contractItems: normalizedContractItems, preTaxAmount: totals.preTaxAmount.toFixed(2), taxRate: input.taxRate.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), status: "active", contractDate: input.contractDate ? new Date(input.contractDate) : null, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "contractor_contract", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, contractItems: normalizedContractItems, ...totals }) });
      return { id, totalAmount: totals.totalAmount };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), vendorId: z.number().int().positive(), contractNumber: z.string().trim().min(1), description: z.string().max(2000).optional(), contractType: z.enum(["building_stage", "supply", "supply_installation", "equipment_rental", "labor_supply"]), contractItems: z.array(z.object({ description: z.string().trim().min(1), unit: z.string().trim().min(1), contractedQty: z.number().positive(), unitPrice: z.number().nonnegative(), suppliedQty: z.number().nonnegative().default(0), installedQty: z.number().nonnegative().default(0), approvedQty: z.number().nonnegative().default(0), inventoryItemId: z.number().int().positive().optional(), costItemId: z.number().int().positive().optional(), accountId: z.number().int().positive().optional() })).default([]), preTaxAmount: z.number().nonnegative(), taxRate: z.number().min(0).max(100).default(15), contractDate: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const before = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "العقد غير موجود" });
      await assertProjectAccess(db, ctx, before.projectId);
      await assertProjectWrite(db, ctx, before.projectId);
      await assertPeriodOpen(db, ctx, input.projectId, input.contractDate ? new Date(input.contractDate) : new Date());
      if (before.projectId !== input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن نقل العقد إلى مشروع آخر أثناء التعديل" });
      if (input.contractType !== "building_stage" && input.contractItems.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "عقد التوريد أو التوريد والتركيب يجب أن يحتوي على بند كمي" });
      let normalizedContractItems = input.contractItems;
      if (isMaterialContractType(input.contractType)) {
        const [inventoryRows, costItemRows, accountRows] = await Promise.all([db.select().from(inventoryItems), db.select().from(costItems), db.select().from(accounts)]);
        normalizedContractItems = input.contractItems.map((line) => {
          if (!line.inventoryItemId || !line.costItemId) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب ربط كل بند توريد ببطاقة خامة وبند تكلفة" });
          const material = inventoryRows.find((row) => row.id === line.inventoryItemId && (!row.projectId || row.projectId === input.projectId));
          const costItem = costItemRows.find((row) => row.id === line.costItemId && row.isActive === 1);
          if (!material || !costItem) throw new TRPCError({ code: "BAD_REQUEST", message: "بطاقة الخامة أو بند التكلفة غير صالح" });
          const account = resolveMaterialCostAccount(costItem, accountRows);
          if (!account) throw new TRPCError({ code: "BAD_REQUEST", message: "لم يتم إعداد حساب صالح لبند التكلفة" });
          return { ...line, accountId: account.id };
        });
      }
      const itemAmount = normalizedContractItems.reduce((sum, item) => sum + item.contractedQty * item.unitPrice, 0);
      const totals = calculateExpenseTotals(normalizedContractItems.length ? itemAmount : input.preTaxAmount, input.taxRate);
      await db.update(contractorContracts).set({ stageId: input.stageId || null, vendorId: input.vendorId, contractNumber: input.contractNumber, description: input.description || null, contractType: input.contractType, contractItems: normalizedContractItems, preTaxAmount: totals.preTaxAmount.toFixed(2), taxRate: input.taxRate.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), contractDate: input.contractDate ? new Date(input.contractDate) : null }).where(eq(contractorContracts.id, input.id));
      await db.insert(auditLogs).values({ entityType: "contractor_contract", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify({ ...input, contractItems: normalizedContractItems, ...totals }) });
      return { id: input.id, totalAmount: totals.totalAmount };
    }),
    summary: protectedProcedure.input(z.object({ contractId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const contract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, input.contractId)).limit(1))[0];
      if (!contract) throw new TRPCError({ code: "NOT_FOUND", message: "عقد المقاول غير موجود" });
      await assertProjectAccess(db, ctx, contract.projectId);
      const rows = await db.select().from(certificates).where(eq(certificates.contractId, input.contractId));
      const totalCertificates = rows.filter((row) => row.status !== "rejected").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const paidCertificates = rows.filter((row) => row.status !== "rejected").reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
      return { contract, certificates: rows, totalCertificates, paidCertificates, remaining: Math.max(0, Number(contract.totalAmount) - totalCertificates), executionPct: Number(contract.totalAmount) > 0 ? (totalCertificates / Number(contract.totalAmount)) * 100 : 0 };
    }),
  }),

  certificates: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = companyId ? await db.select().from(certificates).where(eq(certificates.companyId, companyId)).orderBy(certificates.createdAt) : [];
      const visibleRows = allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
      if (!visibleRows.length) return [];
      const certificateIds = visibleRows.map((row) => row.id);
      const approvalRows = await db.select().from(approvalRequests).where(eq(approvalRequests.entityType, "certificate"));
      const userRows = await db.select({ id: users.id, name: users.name, email: users.email }).from(users);
      const userMap = new Map(userRows.map((user) => [Number(user.id), user]));
      return visibleRows.map((row) => {
        const approvals = approvalRows.filter((approval) => certificateIds.includes(approval.entityId));
        const preparedBy = userMap.get(Number(row.createdBy));
        const stage = (name: string) => approvals.filter((approval) => approval.entityId === row.id && approval.approvalStage === name && (approval.status !== "rejected" || approval.reviewedBy)).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const projectManager = stage("project_manager");
        const generalManager = stage("general_manager");
        const signer = (approval: typeof projectManager) => approval ? { status: approval.status, name: approval.reviewedBy ? userMap.get(Number(approval.reviewedBy))?.name || `مستخدم #${approval.reviewedBy}` : null, userId: approval.reviewedBy ?? null, reviewedAt: approval.reviewedAt, approvalId: approval.id } : null;
        return { ...row, signatureWorkflow: {
          preparedBy: { userId: row.createdBy, name: preparedBy?.name || `مستخدم #${row.createdBy}`, preparedAt: row.createdAt },
          projectManager: signer(projectManager),
          generalManager: signer(generalManager),
        } };
      });
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), contractId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), vendorId: z.number().int().positive().optional(), certificateNumber: z.string().trim().min(1), description: z.string().max(2000).optional(), technicalSpecifications: z.string().max(10000).optional(), certificateItems: z.array(z.object({ contractItemIndex: z.number().int().nonnegative(), suppliedQty: z.number().nonnegative().default(0), installedQty: z.number().nonnegative().default(0), approvedQty: z.number().nonnegative().default(0), unitPrice: z.number().nonnegative().optional() })).default([]), preTaxAmount: z.number().nonnegative(), taxRate: z.number().min(0).max(100).default(15), paidAmount: z.number().nonnegative().default(0), certificateDate: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertOperationPermission(db, ctx, "certificate");
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      await assertPeriodOpen(db, ctx, input.projectId, input.certificateDate ? new Date(input.certificateDate) : new Date());
      const projectCompany = (await db.select({ companyId: projects.companyId }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0];
      const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
      if (input.contractId) {
        const contract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, input.contractId)).limit(1))[0];
        if (!contract || contract.projectId !== input.projectId || (input.vendorId && contract.vendorId !== input.vendorId)) throw new TRPCError({ code: "BAD_REQUEST", message: "العقد لا يتطابق مع المشروع أو المقاول المحدد" });
        const contractItems = contract.contractItems ?? [];
        if (contract.contractType !== "building_stage" && input.certificateItems.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "مستخلص هذا العقد يجب أن يحدد الكميات الموردة أو المركبة" });
        const previous = await db.select().from(certificates).where(eq(certificates.contractId, input.contractId));
        for (const line of input.certificateItems) { const item = contractItems[line.contractItemIndex]; if (!item) throw new TRPCError({ code: "BAD_REQUEST", message: "بند المستخلص غير موجود في العقد" }); const prior = previous.filter((row) => row.status !== "rejected").flatMap((row) => row.certificateItems ?? []).filter((row) => row.contractItemIndex === line.contractItemIndex).reduce((sum, row) => sum + Number(row.approvedQty || row.suppliedQty || row.installedQty || 0), 0); const requested = Math.max(line.approvedQty || 0, line.suppliedQty || 0, line.installedQty || 0); if (prior + requested > Number(item.contractedQty) + 0.0001) throw new TRPCError({ code: "BAD_REQUEST", message: `الكمية تتجاوز المتبقي للبند ${item.description}` }); }
        const used = previous.filter((row) => row.status !== "rejected").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        if (used + totals.totalAmount > Number(contract.totalAmount) + 0.01) throw new TRPCError({ code: "BAD_REQUEST", message: `قيمة المستخلص تتجاوز المتبقي من العقد. المتبقي الحالي ${Math.max(0, Number(contract.totalAmount) - used).toFixed(2)} ر.س` });
      }
      const result = await db.insert(certificates).values({ companyId: projectCompany?.companyId ?? null, projectId: input.projectId, contractId: input.contractId || null, stageId: input.stageId || null, vendorId: input.vendorId || null, certificateNumber: input.certificateNumber, description: input.description || null, technicalSpecifications: input.technicalSpecifications || null, certificateItems: input.certificateItems, preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), paidAmount: Math.min(input.paidAmount, totals.totalAmount).toFixed(2), status: "pending", certificateDate: input.certificateDate ? new Date(input.certificateDate) : null, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      const initialApproval = getCertificateInitialApproval(Number(ctx.user.id));
      await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "certificate", entityId: id, requestedBy: ctx.user.id, status: "pending", approvalStage: initialApproval.approvalStage, stageOrder: initialApproval.stageOrder });
      await db.insert(auditLogs).values({ entityType: "certificate", entityId: id, action: `created_pending_${initialApproval.approvalStage}`, actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, ...totals }) });
      await notifyApprovalUsers(db, initialApproval.approvalStage === "mostafa" ? { type: "certificate_mostafa_pending", title: "مستخلص جديد يحتاج اعتماد مصطفى", message: `المستخلص ${input.certificateNumber} ينتظر اعتماد مصطفى كأول مرحلة.`, roles: [], userIds: [13170001] } : { type: "certificate_owner_pending", title: "مستخلص جديد يحتاج اعتماد المالك", message: `سجّل مصطفى المستخلص ${input.certificateNumber} وهو بانتظار اعتماد المالك.`, roles: ["admin"], userIds: [] });
      return { id, totalAmount: totals.totalAmount, status: "pending" as const };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive(), contractId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), vendorId: z.number().int().positive().optional(), certificateNumber: z.string().trim().min(1), description: z.string().max(2000).optional(), technicalSpecifications: z.string().max(10000).optional(), certificateItems: z.array(z.object({ contractItemIndex: z.number().int().nonnegative(), suppliedQty: z.number().nonnegative().default(0), installedQty: z.number().nonnegative().default(0), approvedQty: z.number().nonnegative().default(0), unitPrice: z.number().nonnegative().optional() })).default([]), preTaxAmount: z.number().nonnegative(), taxRate: z.number().min(0).max(100).default(15), paidAmount: z.number().nonnegative().default(0), certificateDate: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const before = (await db.select().from(certificates).where(eq(certificates.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المستخلص غير موجود" });
      await assertProjectAccess(db, ctx, before.projectId);
      await assertProjectWrite(db, ctx, before.projectId);
      if (before.status === "approved" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكن تعديل مستخلص معتمد إلا بواسطة المسؤول" });
      await assertPeriodOpen(db, ctx, input.projectId, input.certificateDate ? new Date(input.certificateDate) : new Date());
      const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
      if (input.contractId) {
        const contract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, input.contractId)).limit(1))[0];
        if (!contract || contract.projectId !== input.projectId || (input.vendorId && contract.vendorId !== input.vendorId)) throw new TRPCError({ code: "BAD_REQUEST", message: "العقد لا يتطابق مع المشروع أو المقاول المحدد" });
        const contractItems = contract.contractItems ?? [];
        if (contract.contractType !== "building_stage" && input.certificateItems.length === 0) throw new TRPCError({ code: "BAD_REQUEST", message: "مستخلص هذا العقد يجب أن يحدد الكميات الموردة أو المركبة" });
        const previous = await db.select().from(certificates).where(eq(certificates.contractId, input.contractId));
        for (const line of input.certificateItems) { const item = contractItems[line.contractItemIndex]; if (!item) throw new TRPCError({ code: "BAD_REQUEST", message: "بند المستخلص غير موجود في العقد" }); const prior = previous.filter((row) => row.id !== input.id && row.status !== "rejected").flatMap((row) => row.certificateItems ?? []).filter((row) => row.contractItemIndex === line.contractItemIndex).reduce((sum, row) => sum + Number(row.approvedQty || row.suppliedQty || row.installedQty || 0), 0); const requested = Math.max(line.approvedQty || 0, line.suppliedQty || 0, line.installedQty || 0); if (prior + requested > Number(item.contractedQty) + 0.0001) throw new TRPCError({ code: "BAD_REQUEST", message: `الكمية تتجاوز المتبقي للبند ${item.description}` }); }
        const used = previous.filter((row) => row.id !== input.id && row.status !== "rejected").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        if (used + totals.totalAmount > Number(contract.totalAmount) + 0.01) throw new TRPCError({ code: "BAD_REQUEST", message: `قيمة المستخلص تتجاوز المتبقي من العقد. المتبقي الحالي ${Math.max(0, Number(contract.totalAmount) - used).toFixed(2)} ر.س` });
      }
      await db.update(certificates).set({ projectId: input.projectId, contractId: input.contractId || null, stageId: input.stageId || null, vendorId: input.vendorId || null, certificateNumber: input.certificateNumber, description: input.description || null, technicalSpecifications: input.technicalSpecifications || null, certificateItems: input.certificateItems, preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), paidAmount: Math.min(input.paidAmount, totals.totalAmount).toFixed(2), status: "pending", certificateDate: input.certificateDate ? new Date(input.certificateDate) : null }).where(eq(certificates.id, input.id));
      await db.update(approvalRequests).set({ status: "rejected", reviewedBy: ctx.user.id, reviewedAt: new Date(), note: "تمت إعادة المستخلص للتعديل" }).where(and(eq(approvalRequests.entityType, "certificate"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending")));
      const initialApproval = getCertificateInitialApproval(Number(ctx.user.id));
      await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "certificate", entityId: input.id, requestedBy: ctx.user.id, status: "pending", approvalStage: initialApproval.approvalStage, stageOrder: initialApproval.stageOrder });
      await db.insert(auditLogs).values({ entityType: "certificate", entityId: input.id, action: "updated_and_re submitted", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify({ ...input, ...totals }) });
      return { success: true, status: "pending" as const, totalAmount: totals.totalAmount };
    }),
    delete: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const before = (await db.select().from(certificates).where(eq(certificates.id, input.id)).limit(1))[0];
      if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المستخلص غير موجود" });
      await assertProjectAccess(db, ctx, before.projectId);
      await assertProjectWrite(db, ctx, before.projectId);
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "حذف المستخلصات متاح للمسؤول فقط" });
      if (before.status === "approved" && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "لا يمكن حذف مستخلص معتمد إلا بواسطة المسؤول" });
      await db.delete(approvalRequests).where(and(eq(approvalRequests.entityType, "certificate"), eq(approvalRequests.entityId, input.id)));
      await db.delete(certificates).where(eq(certificates.id, input.id));
      await db.insert(auditLogs).values({ entityType: "certificate", entityId: input.id, action: "deleted", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: null });
      return { success: true };
    }),
    approveStage: protectedProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const certificate = (await db.select().from(certificates).where(eq(certificates.id, input.id)).limit(1))[0];
        if (!certificate) throw new TRPCError({ code: "NOT_FOUND", message: "المستخلص غير موجود" });
        const current = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "certificate"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending"))).limit(1))[0];
        if (!current) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد مرحلة موافقة معلقة لهذا المستخلص" });
        const canApprove = canReviewCertificateApproval(current.approvalStage, ctx.user);
        if (!canApprove) throw new TRPCError({ code: "FORBIDDEN", message: "لا تملك صلاحية اعتماد مرحلة المستخلص الحالية" });
        await db.update(approvalRequests).set({ status: input.decision, reviewedBy: ctx.user.id, note: input.note || null, reviewedAt: new Date() }).where(eq(approvalRequests.id, current.id));
        await db.insert(auditLogs).values({ entityType: "certificate", entityId: input.id, action: `approval_${current.approvalStage}_${input.decision}`, actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        if (input.decision === "rejected") {
          await db.update(certificates).set({ status: "rejected" }).where(eq(certificates.id, input.id));
          if (certificate.createdBy) await db.insert(notifications).values({ userId: certificate.createdBy, type: "certificate_rejected", title: "تم رفض المستخلص", message: `تم رفض المستخلص ${certificate.certificateNumber} في مرحلة ${current.approvalStage}.` });
          return { status: "rejected" as const, nextStage: null };
        }
        const next = nextCertificateApproval(current.stageOrder);
        if (!next) {
          await db.update(certificates).set({ status: "approved" }).where(eq(certificates.id, input.id));
          if (certificate.createdBy) await db.insert(notifications).values({ userId: certificate.createdBy, type: "certificate_approved", title: "اكتملت موافقات المستخلص", message: `تم اعتماد المستخلص ${certificate.certificateNumber} ويمكن ترحيله للتقارير والتكلفة.` });
          return { status: "approved" as const, nextStage: null };
        }
        await db.insert(approvalRequests).values({ projectId: certificate.projectId, entityType: "certificate", entityId: input.id, requestedBy: certificate.createdBy || ctx.user.id, status: "pending", approvalStage: next.approvalStage, stageOrder: next.stageOrder });
          const stageRecipients = next.approvalStage === "owner" ? { roles: ["admin"] as UserRole[], userIds: [] as number[] } : next.approvalStage === "project_manager" ? { roles: ["project_manager"] as UserRole[], userIds: [] as number[] } : { roles: ["general_manager"] as UserRole[], userIds: [] as number[] };
          await notifyApprovalUsers(db, { type: "certificate_approval_stage", title: "انتقل المستخلص لمرحلة اعتماد جديدة", message: `المستخلص ${certificate.certificateNumber} ينتظر مرحلة ${next.approvalStage}.`, roles: stageRecipients.roles, userIds: stageRecipients.userIds });
        return { status: "pending" as const, nextStage: next.approvalStage };
      }),
  }),

  custody: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = await db.select().from(custody).where(companyId ? eq(custody.companyId, companyId) : eq(custody.id, -1)).orderBy(custody.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), holderName: z.string().trim().min(2), issueDate: z.string().optional(), issuedAmount: z.number().nonnegative(), settledAmount: z.number().nonnegative().default(0) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      const settled = Math.min(input.settledAmount, input.issuedAmount);
      const status = settled >= input.issuedAmount ? "settled" : settled > 0 ? "partially_settled" : "open";
      const result = await db.insert(custody).values({ companyId: companyId || null, projectId: input.projectId, stageId: input.stageId || null, holderName: input.holderName, issueDate: input.issueDate ? new Date(input.issueDate) : null, issuedAmount: input.issuedAmount.toFixed(2), settledAmount: settled.toFixed(2), status, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "custody", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id, outstanding: input.issuedAmount - settled };
    }),
    settle: protectedProcedure.input(z.object({ id: z.number().int().positive(), settledAmount: z.number().nonnegative() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const row = (await db.select().from(custody).where(eq(custody.id, input.id)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "العهدة غير موجودة" });
      await assertProjectAccess(db, ctx, row.projectId);
      await assertProjectWrite(db, ctx, row.projectId);
      const settled = Math.min(input.settledAmount, Number(row.issuedAmount));
      const status = settled >= Number(row.issuedAmount) ? "settled" : settled > 0 ? "partially_settled" : "open";
      await db.update(custody).set({ settledAmount: settled.toFixed(2), status }).where(eq(custody.id, input.id));
      await db.insert(auditLogs).values({ entityType: "custody", entityId: input.id, action: "settled", actorId: ctx.user.id, afterJson: JSON.stringify({ settledAmount: settled, status }) });
      return { success: true, outstanding: Number(row.issuedAmount) - settled } as const;
    }),
  }),

  custodyMovements: router({
    list: protectedProcedure.input(z.object({ employeeCode: z.string().trim().min(1).optional(), projectId: z.number().int().positive().optional(), allocationType: z.enum(["project", "general_cash", "general_admin", "petty_cash", "operating_expense"]).optional() }).default({})).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = await db.select().from(custodyMovements).where(companyId ? eq(custodyMovements.companyId, companyId) : eq(custodyMovements.id, -1)).orderBy(custodyMovements.movementDate, custodyMovements.createdAt);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      return rows.filter((row) => {
        if (row.projectId && allowed && !allowed.has(row.projectId)) return false;
        if (input.employeeCode && row.employeeCode !== input.employeeCode) return false;
        if (input.projectId && row.projectId !== input.projectId) return false;
        if (input.allocationType && row.allocationType !== input.allocationType) return false;
        return true;
      });
    }),
    statement: protectedProcedure.input(z.object({ employeeCode: z.string().trim().min(1), allocationType: z.enum(["project", "administrative", "general_cash", "general_admin", "petty_cash", "operating_expense"]).optional() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      const rows = await db.select().from(custodyMovements).where(companyId ? eq(custodyMovements.companyId, companyId) : eq(custodyMovements.id, -1)).orderBy(custodyMovements.movementDate, custodyMovements.createdAt);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const filtered = rows.filter((row) => row.employeeCode === input.employeeCode && (!row.projectId || !allowed || allowed.has(row.projectId)) && (!input.allocationType || (input.allocationType === "project" ? row.allocationType === "project" : input.allocationType === "administrative" ? row.allocationType !== "project" : row.allocationType === input.allocationType)));
      let balance = 0;
      return filtered.map((row) => { balance += Number(row.signedAmount); return { ...row, balance }; });
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), employeeCode: z.string().trim().min(1), employeeName: z.string().trim().min(2), movementType: z.enum(["issue", "spend", "return", "settlement"]), allocationType: z.enum(["project", "general_cash", "general_admin", "petty_cash", "operating_expense"]), description: z.string().trim().min(2), amount: z.number().positive(), movementDate: z.string().optional(), expenseType: z.string().trim().max(64).optional(), vendorId: z.number().int().positive().optional(), payrollBeneficiaryType: z.enum(["company_employee", "worker"]).optional(), payrollEmployeeId: z.number().int().positive().optional(), payrollBeneficiaryName: z.string().trim().max(255).optional(), allocationRatio: z.number().min(0).max(100).default(100) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const companyId = await resolveActiveCompanyId(db, ctx);
      await assertOperationPermission(db, ctx, "custody");
      if (input.allocationType === "project" && !input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب اختيار المشروع عند تسجيل عهدة مشروع" });
      if (input.projectId) { await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId); await assertPeriodOpen(db, ctx, input.projectId, input.movementDate ? new Date(input.movementDate) : new Date()); }
      const signedAmount = ["issue", "return"].includes(input.movementType) ? input.amount : -input.amount;
      const result = await db.insert(custodyMovements).values({ companyId: companyId || null, projectId: input.projectId || null, stageId: input.stageId || null, employeeCode: input.employeeCode, employeeName: input.employeeName, movementType: input.movementType, allocationType: input.allocationType, description: input.description, amount: input.amount.toFixed(2), signedAmount: signedAmount.toFixed(2), movementDate: input.movementDate ? new Date(input.movementDate) : null, expenseType: input.expenseType || null, vendorId: input.vendorId || null, payrollBeneficiaryType: input.payrollBeneficiaryType || null, payrollEmployeeId: input.payrollEmployeeId || null, payrollBeneficiaryName: input.payrollBeneficiaryName || null, allocationRatio: input.allocationRatio.toFixed(2), createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      let linkedExpenseId: number | null = null;
      if (["spend", "settlement"].includes(input.movementType)) {
        const classification: "project" | "administrative" | "petty_cash" = input.allocationType === "project" || input.allocationType === "operating_expense" ? "project" : input.allocationType === "petty_cash" || input.allocationType === "general_cash" ? "petty_cash" : "administrative";
        const expenseResult = await db.insert(expenses).values({ projectId: classification === "project" ? (input.projectId || null) : null, stageId: classification === "project" ? (input.stageId || null) : null, description: `مصروف عهدة #${id}: ${input.description}`, unit: "مبلغ", quantity: "1", expenseType: input.expenseType || (classification === "petty_cash" ? "administrative" : "operating"), vendorId: input.vendorId || null, payrollBeneficiaryType: input.expenseType === "payroll" ? input.payrollBeneficiaryType || null : null, payrollEmployeeId: input.expenseType === "payroll" ? input.payrollEmployeeId || null : null, payrollBeneficiaryName: input.expenseType === "payroll" ? input.payrollBeneficiaryName || null : null, classification, allocationRatio: classification === "project" ? (input.allocationRatio / 100).toFixed(3) : "1.000", preTaxAmount: input.amount.toFixed(2), taxRate: "0", taxAmount: "0", totalAmount: input.amount.toFixed(2), paidAmount: input.amount.toFixed(2), status: "approved" as const, expenseDate: input.movementDate ? new Date(input.movementDate) : null, createdBy: ctx.user.id });
        linkedExpenseId = Number(expenseResult[0].insertId);
        await db.update(custodyMovements).set({ linkedExpenseId }).where(eq(custodyMovements.id, id));
      }
      await db.insert(auditLogs).values({ entityType: "custodyMovement", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, signedAmount, linkedExpenseId }) });
      return { id, signedAmount, linkedExpenseId };
    }),
    update: protectedProcedure.input(z.object({ id: z.number().int().positive(), projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), employeeCode: z.string().trim().min(1), employeeName: z.string().trim().min(2), movementType: z.enum(["issue", "spend", "return", "settlement"]), allocationType: z.enum(["project", "general_cash", "general_admin", "petty_cash", "operating_expense"]), description: z.string().trim().min(2), amount: z.number().positive(), movementDate: z.string().optional(), expenseType: z.string().trim().max(64).optional(), vendorId: z.number().int().positive().optional(), payrollBeneficiaryType: z.enum(["company_employee", "worker"]).optional(), payrollEmployeeId: z.number().int().positive().optional(), payrollBeneficiaryName: z.string().trim().max(255).optional(), allocationRatio: z.number().min(0).max(100).default(100) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertOperationPermission(db, ctx, "custody");
      const current = (await db.select().from(custodyMovements).where(eq(custodyMovements.id, input.id)))[0];
      if (!current) throw new TRPCError({ code: "NOT_FOUND", message: "حركة العهدة غير موجودة" });
      if (current.projectId) await assertProjectAccess(db, ctx, current.projectId);
      if (input.projectId) { await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId); await assertPeriodOpen(db, ctx, input.projectId, input.movementDate ? new Date(input.movementDate) : new Date()); }
      if (input.allocationType === "project" && !input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "يجب اختيار المشروع عند تسجيل عهدة مشروع" });
      const signedAmount = ["issue", "return"].includes(input.movementType) ? input.amount : -input.amount;
      const classification: "project" | "administrative" | "petty_cash" = input.allocationType === "project" || input.allocationType === "operating_expense" ? "project" : input.allocationType === "petty_cash" || input.allocationType === "general_cash" ? "petty_cash" : "administrative";
      const shouldPostExpense = ["spend", "settlement"].includes(input.movementType);
      let linkedExpenseId = current.linkedExpenseId ?? null;
      if (shouldPostExpense) {
        const expensePayload = { projectId: classification === "project" ? (input.projectId || null) : null, stageId: classification === "project" ? (input.stageId || null) : null, description: `مصروف عهدة: ${input.description}`, unit: "مبلغ", quantity: "1", expenseType: input.expenseType || (classification === "petty_cash" ? "administrative" : "operating"), vendorId: input.vendorId || null, payrollBeneficiaryType: input.expenseType === "payroll" ? input.payrollBeneficiaryType || null : null, payrollEmployeeId: input.expenseType === "payroll" ? input.payrollEmployeeId || null : null, payrollBeneficiaryName: input.expenseType === "payroll" ? input.payrollBeneficiaryName || null : null, classification, allocationRatio: classification === "project" ? (input.allocationRatio / 100).toFixed(3) : "1.000", preTaxAmount: input.amount.toFixed(2), taxRate: "0", taxAmount: "0", totalAmount: input.amount.toFixed(2), paidAmount: input.amount.toFixed(2), status: "approved" as const, expenseDate: input.movementDate ? new Date(input.movementDate) : null };
        if (linkedExpenseId) await db.update(expenses).set(expensePayload).where(eq(expenses.id, linkedExpenseId));
        else { const expenseResult = await db.insert(expenses).values({ ...expensePayload, createdBy: ctx.user.id }); linkedExpenseId = Number(expenseResult[0].insertId); }
      } else if (linkedExpenseId) {
        await db.update(expenses).set({ status: "rejected", description: `مصروف عهدة ملغى بعد تغيير نوع الحركة: ${input.description}` }).where(eq(expenses.id, linkedExpenseId));
      }
      await db.update(custodyMovements).set({ projectId: input.projectId || null, stageId: input.stageId || null, employeeCode: input.employeeCode, employeeName: input.employeeName, movementType: input.movementType, allocationType: input.allocationType, description: input.description, amount: input.amount.toFixed(2), signedAmount: signedAmount.toFixed(2), movementDate: input.movementDate ? new Date(input.movementDate) : null, expenseType: input.expenseType || null, vendorId: input.vendorId || null, payrollBeneficiaryType: input.payrollBeneficiaryType || null, payrollEmployeeId: input.payrollEmployeeId || null, payrollBeneficiaryName: input.payrollBeneficiaryName || null, allocationRatio: input.allocationRatio.toFixed(2), linkedExpenseId }).where(eq(custodyMovements.id, input.id));
      await db.insert(auditLogs).values({ entityType: "custodyMovement", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(current), afterJson: JSON.stringify({ ...input, signedAmount, linkedExpenseId }) });
      return { id: input.id, signedAmount, linkedExpenseId };
    }),
  }),
  attendance: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(attendance).orderBy(attendance.attendanceDate);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), employeeCode: z.string().max(64).optional(), employeeName: z.string().trim().min(2), attendanceDate: z.string(), checkIn: z.string().max(16).optional(), checkOut: z.string().max(16).optional(), status: z.enum(["present", "absent", "late", "leave"]).default("present"), source: z.enum(["manual", "biometric", "mobile_location", "import"]).default("manual"), latitude: z.number().min(-90).max(90).optional(), longitude: z.number().min(-180).max(180).optional(), locationAccuracyMeters: z.number().positive().max(10000).optional(), locationCapturedAt: z.string().datetime().optional(), notes: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      if ((input.source === "mobile_location") !== (input.latitude !== undefined && input.longitude !== undefined)) throw new TRPCError({ code: "BAD_REQUEST", message: "تسجيل الموقع يتطلب إحداثيات الحضور كاملة" });
      const activeLocations = await db.select().from(projectWorkLocations).where(and(eq(projectWorkLocations.projectId, input.projectId), eq(projectWorkLocations.isActive, true)));
      let locationDistanceMeters: number | undefined;
      let locationMatchStatus: "not_checked" | "within_range" | "outside_range" | "no_site_configured" = "not_checked";
      if (input.source === "mobile_location" && input.latitude !== undefined && input.longitude !== undefined) {
        if (!activeLocations.length) locationMatchStatus = "no_site_configured";
        else {
          locationDistanceMeters = Math.min(...activeLocations.map((site) => distanceMetersBetween(input.latitude!, input.longitude!, Number(site.latitude), Number(site.longitude))));
          const nearest = activeLocations.find((site) => Math.abs(distanceMetersBetween(input.latitude!, input.longitude!, Number(site.latitude), Number(site.longitude)) - locationDistanceMeters!) < 0.01);
          locationMatchStatus = nearest && locationDistanceMeters <= Number(nearest.allowedRadiusMeters) ? "within_range" : "outside_range";
        }
      }
      const result = await db.insert(attendance).values({ projectId: input.projectId, stageId: input.stageId || null, employeeCode: input.employeeCode || null, employeeName: input.employeeName, attendanceDate: new Date(input.attendanceDate), checkIn: input.checkIn || null, checkOut: input.checkOut || null, status: input.status, source: input.source, latitude: input.latitude?.toFixed(7) || null, longitude: input.longitude?.toFixed(7) || null, locationAccuracyMeters: input.locationAccuracyMeters?.toFixed(2) || null, locationDistanceMeters: locationDistanceMeters?.toFixed(2) || null, locationMatchStatus, locationCapturedAt: input.locationCapturedAt ? new Date(input.locationCapturedAt) : null, notes: input.notes || null });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "attendance", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
  }),

  attachments: router({
    list: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      return db.select().from(attachments).where(eq(attachments.projectId, input.projectId)).orderBy(attachments.createdAt);
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), entityType: z.string().trim().min(1), entityId: z.number().int().positive(), documentType: z.string().trim().min(1), fileName: z.string().trim().min(1), fileUrl: z.string().url() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      const result = await db.insert(attachments).values({ ...input, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "attachment", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
  }),

  controls: router({
    trace: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), entityType: z.string().trim().min(1), entityId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.projectId) await assertProjectAccess(db, ctx, input.projectId);
      const [approvalRows, auditRows] = await Promise.all([
        db.select().from(approvalRequests).where(input.projectId
          ? and(eq(approvalRequests.projectId, input.projectId), eq(approvalRequests.entityType, input.entityType), eq(approvalRequests.entityId, input.entityId))
          : and(eq(approvalRequests.entityType, input.entityType), eq(approvalRequests.entityId, input.entityId))).orderBy(approvalRequests.createdAt),
        db.select().from(auditLogs).where(and(eq(auditLogs.entityType, input.entityType), eq(auditLogs.entityId, input.entityId))).orderBy(auditLogs.createdAt),
      ]);
      const supportedEntity = ["expense", "payroll", "certificate", "collection", "sale"].includes(input.entityType) ? input.entityType as "expense" | "payroll" | "certificate" | "collection" | "sale" : null;
      const policy = input.projectId && supportedEntity ? await findApprovalPolicy(db, input.projectId, supportedEntity) : null;
      return { approval: approvalRows[approvalRows.length - 1] || null, audits: auditRows, approvalPolicy: policy ? { entityType: policy.entityType, thresholdAmount: policy.thresholdAmount } : null };
    }),
    audit: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "سجل التدقيق متاح للمدير العام والمالك للعرض فقط" });
      const db = requireDb(await getDb());
      return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(200);
    }),
    executiveSnapshot: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "general_manager") throw new TRPCError({ code: "FORBIDDEN", message: "المؤشرات التنفيذية متاحة للمدير العام والمالك فقط" });
      const db = requireDb(await getDb());
      return buildExecutiveSnapshot(db);
    }),
    notifications: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const approvalTypes = ["approval", "certificate_approval", "certificate_approval_stage", "leave_approval", "advance_approval", "payroll_approval", "purchase_payment_pending"] as const;
      const [notificationRows, pendingApprovals, pendingLeaves, pendingAdvances] = await Promise.all([
        db.select().from(notifications).where(and(eq(notifications.userId, ctx.user.id), inArray(notifications.type, approvalTypes))).orderBy(notifications.createdAt),
        db.select({ entityType: approvalRequests.entityType, projectId: approvalRequests.projectId, projectName: projects.name }).from(approvalRequests).leftJoin(projects, eq(projects.id, approvalRequests.projectId)).where(eq(approvalRequests.status, "pending")),
        db.select({ id: leaveRequests.id }).from(leaveRequests).where(eq(leaveRequests.status, "pending")),
        db.select({ id: advanceRequests.id }).from(advanceRequests).where(eq(advanceRequests.status, "pending")),
      ]);
      const pendingTypes = new Set(pendingApprovals.map((row) => row.entityType));
      const hasPendingProjectMatch = (notification: (typeof notificationRows)[number], entityType?: string) => {
        const projectLabel = notification.title.split("—").pop()?.trim();
        return pendingApprovals.some((row) => (!entityType || row.entityType === entityType) && Boolean(row.projectName) && projectLabel === row.projectName);
      };
      const hasRealSource = (notification: (typeof notificationRows)[number]) => {
        if (notification.type === "approval") return hasPendingProjectMatch(notification);
        if (["certificate_approval", "certificate_approval_stage"].includes(notification.type)) return hasPendingProjectMatch(notification, "certificate");
        if (notification.type === "payroll_approval") return hasPendingProjectMatch(notification, "payroll");
        if (notification.type === "purchase_payment_pending") return hasPendingProjectMatch(notification, "purchase_payment");
        if (notification.type === "leave_approval") return pendingLeaves.length > 0;
        if (notification.type === "advance_approval") return pendingAdvances.length > 0;
        return pendingTypes.size > 0;
      };
      const validNotifications = notificationRows.filter(hasRealSource);
      const staleUnread = notificationRows.filter((notification) => !notification.readAt && !hasRealSource(notification));
      for (const notification of staleUnread) await db.update(notifications).set({ readAt: new Date() }).where(eq(notifications.id, notification.id));
      return validNotifications;
    }),
    markNotificationRead: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await db.update(notifications).set({ readAt: new Date() }).where(eq(notifications.id, input.id));
      await db.insert(auditLogs).values({ entityType: "notification", entityId: input.id, action: "read", actorId: ctx.user.id, afterJson: JSON.stringify({ id: input.id }) });
      return { success: true } as const;
    }),
    locks: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(periodLocks).orderBy(periodLocks.lockedAt);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    lockPeriod: adminProcedure.input(z.object({ projectId: z.number().int().positive(), periodYear: z.number().int().min(2000).max(2100), periodMonth: z.number().int().min(1).max(12), reason: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const existing = await db.select().from(periodLocks).where(eq(periodLocks.projectId, input.projectId));
      if (existing.some((lock) => lock.periodYear === input.periodYear && lock.periodMonth === input.periodMonth)) throw new TRPCError({ code: "CONFLICT", message: "هذه الفترة مقفلة بالفعل لهذا المشروع" });
      const result = await db.insert(periodLocks).values({ ...input, reason: input.reason || null, lockedBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "periodLock", entityId: id, action: "locked", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
    unlockPeriod: adminProcedure.input(z.object({ id: z.number().int().positive(), reason: z.string().trim().min(2).max(1000) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const existing = (await db.select().from(periodLocks).where(eq(periodLocks.id, input.id)).limit(1))[0];
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "فترة الإقفال غير موجودة" });
      await db.delete(periodLocks).where(eq(periodLocks.id, input.id));
      await db.insert(auditLogs).values({ entityType: "periodLock", entityId: input.id, action: "unlocked", actorId: ctx.user.id, beforeJson: JSON.stringify(existing), afterJson: JSON.stringify({ reason: input.reason }) });
      return { success: true } as const;
    }),
  }),

  accounting: router({
    accounts: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        const db = requireDb(await getDb());
        const companyId = await resolveActiveCompanyId(db, ctx);
        return companyId ? db.select().from(accounts).where(and(eq(accounts.isActive, 1), eq(accounts.companyId, companyId))) : [];
      }),
      create: protectedProcedure.input(z.object({ code: z.string().min(1).max(32), name: z.string().min(1).max(255), accountType: z.enum(["asset", "liability", "equity", "revenue", "expense"]), parentId: z.number().int().positive().optional(), isPostable: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");
        const companyId = await resolveActiveCompanyId(db, ctx); if (!companyId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا توجد شركة نشطة" }); const result = await db.insert(accounts).values({ companyId, code: input.code, name: input.name, accountType: input.accountType, parentId: input.parentId || null, isPostable: input.isPostable ? 1 : 0, isActive: 1 });
        const id = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "account", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id };
      }),
      update: protectedProcedure.input(z.object({ id: z.number().int().positive(), code: z.string().min(1).max(32), name: z.string().min(1).max(255), accountType: z.enum(["asset", "liability", "equity", "revenue", "expense"]), parentId: z.number().int().positive().nullable().optional(), isPostable: z.boolean().default(true) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");
        const existing = (await db.select().from(accounts).where(eq(accounts.id, input.id)).limit(1))[0];
        if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "الحساب غير موجود" });
        const used = await db.select({ id: accountingDocumentLines.id }).from(accountingDocumentLines).where(eq(accountingDocumentLines.accountId, input.id)).limit(1);
        if (used.length && (existing.code !== input.code || existing.accountType !== input.accountType)) throw new TRPCError({ code: "CONFLICT", message: "الحساب مستخدم في قيود؛ يمكن تعديل الاسم والأب فقط" });
        await db.update(accounts).set({ code: input.code, name: input.name, accountType: input.accountType, parentId: input.parentId ?? null, isPostable: input.isPostable ? 1 : 0 }).where(eq(accounts.id, input.id));
        await db.insert(auditLogs).values({ entityType: "account", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(existing), afterJson: JSON.stringify(input) });
        return { id: input.id };
      }),
      deactivate: protectedProcedure.input(z.object({ id: z.number().int().positive(), active: z.boolean() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");
        const used = await db.select({ id: accountingDocumentLines.id }).from(accountingDocumentLines).where(eq(accountingDocumentLines.accountId, input.id)).limit(1);
        if (used.length && !input.active) throw new TRPCError({ code: "CONFLICT", message: "لا يمكن تعطيل حساب مستخدم في قيود؛ عدّل الاسم بدلًا من حذفه" });
        await db.update(accounts).set({ isActive: input.active ? 1 : 0 }).where(eq(accounts.id, input.id));
        await db.insert(auditLogs).values({ entityType: "account", entityId: input.id, action: input.active ? "activated" : "deactivated", actorId: ctx.user.id });
        return { id: input.id };
      }),
    }),
    documents: router({
      list: protectedProcedure.input(z.object({ documentType: z.enum(["sales_invoice", "purchase_invoice", "purchase_receipt", "credit_note", "journal_entry", "payment_voucher", "receipt_voucher", "quotation", "purchase_order"]).optional() }).optional()).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const companyId = await resolveActiveCompanyId(db, ctx);
        const rows = companyId ? await db.select().from(accountingDocuments).where(eq(accountingDocuments.companyId, companyId)) : [];
        const filtered = rows.filter((row) => !input?.documentType || row.documentType === input.documentType);
        return Promise.all(filtered.map(async (row) => { const creditedAmount = row.documentType === "sales_invoice" ? rows.filter((candidate) => candidate.documentType === "credit_note" && candidate.originalDocumentId === row.id).reduce((sum, candidate) => sum + Number(candidate.totalAmount || 0), 0) : 0; const netTotalAmount = Math.max(Number(row.totalAmount || 0) - creditedAmount, 0); return { ...row, creditedAmount, netTotalAmount, netRemainingAmount: Math.max(netTotalAmount - Number(row.paidAmount || 0), 0), lines: await db.select().from(accountingDocumentLines).where(eq(accountingDocumentLines.documentId, row.id)) }; }));
      }),
      create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), documentType: z.enum(["sales_invoice", "purchase_invoice", "purchase_receipt", "credit_note", "journal_entry", "payment_voucher", "receipt_voucher", "quotation", "purchase_order"]), relatedDocumentType: z.enum(["quotation", "certificate"]).optional(), relatedDocumentId: z.number().int().positive().optional(), originalDocumentId: z.number().int().positive().optional(), sourceDocumentId: z.number().int().positive().optional(), returnType: z.enum(["full", "partial"]).optional(), voucherCategory: z.enum(["contractor", "supplier", "materials", "payroll", "operating", "administrative", "petty_cash"]).optional(), contractorId: z.number().int().positive().optional(), supplierId: z.number().int().positive().optional(), purchaseInvoiceId: z.number().int().positive().optional(), settlementType: z.enum(["invoice", "direct"]).optional(), certificateId: z.number().int().positive().optional(), fixedAssetId: z.number().int().positive().optional(), partyName: z.string().max(255).optional(), partyTaxNumber: z.string().max(64).optional(), documentDate: z.string().optional(), dueDate: z.string().optional(), sourceAccountId: z.number().int().positive().optional(), amount: z.number().nonnegative(), taxAmount: z.number().nonnegative(), totalAmount: z.number().nonnegative(), paymentMethod: z.enum(["cash", "bank"]).optional(), notes: z.string().max(2000).optional(), status: z.enum(["draft", "posted"]).default("draft"), lines: z.array(z.object({ accountId: z.number().int().positive(), costItemId: z.number().int().positive().optional(), projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), description: z.string().max(500).optional(), debit: z.number().nonnegative(), credit: z.number().nonnegative() })).min(1) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const activeCompanyId = await resolveActiveCompanyId(db, ctx);
        if (!activeCompanyId) throw new TRPCError({ code: "PRECONDITION_FAILED", message: "لا توجد شركة نشطة لحفظ المستند" });
        const accountingOperation = ({ sales_invoice: "sales_invoice", purchase_invoice: "purchase_invoice", purchase_receipt: "inventory_receipt", journal_entry: "edit", payment_voucher: "payment_voucher", receipt_voucher: "receipt_voucher", quotation: "edit", purchase_order: "purchase_request", credit_note: "edit" } as const)[input.documentType];
        await assertOperationPermission(db, ctx, accountingOperation);
        if (input.projectId) await assertProjectWrite(db, ctx, input.projectId);
        if (input.documentType === "payment_voucher") {
          if (!input.voucherCategory) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد طبيعة سند الصرف" });
          if (input.voucherCategory === "contractor" && !input.contractorId) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد المقاول المرتبط بسند الصرف" });
          if (["supplier", "materials", "operating"].includes(input.voucherCategory) && !input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد المشروع المرتبط بهذا التصنيف" });
          if (input.voucherCategory === "payroll" && !input.partyName?.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد اسم مستفيد الراتب" });
          if (input.voucherCategory === "supplier") {
            if (!input.supplierId) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد المورد المرتبط بسند الصرف" });
            if ((input.settlementType || "direct") === "invoice" && !input.purchaseInvoiceId) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد فاتورة الشراء عند اختيار سداد فاتورة" });
            const supplier = (await db.select({ id: vendors.id, name: vendors.name }).from(vendors).where(eq(vendors.id, input.supplierId)).limit(1))[0];
            if (!supplier) throw new TRPCError({ code: "NOT_FOUND", message: "المورد غير موجود" });
            if ((input.settlementType || "direct") === "invoice" && input.purchaseInvoiceId) {
              const purchaseInvoice = (await db.select({ id: accountingDocuments.id, partyName: accountingDocuments.partyName, documentType: accountingDocuments.documentType }).from(accountingDocuments).where(eq(accountingDocuments.id, input.purchaseInvoiceId)).limit(1))[0];
              if (!purchaseInvoice || purchaseInvoice.documentType !== "purchase_invoice" || purchaseInvoice.partyName !== supplier.name) throw new TRPCError({ code: "BAD_REQUEST", message: "فاتورة الشراء لا تخص المورد المحدد" });
            }
          }
          if (input.contractorId) {
            const contractor = (await db.select({ id: vendors.id, projectId: vendors.projectId }).from(vendors).where(eq(vendors.id, input.contractorId)).limit(1))[0];
            if (!contractor) throw new TRPCError({ code: "NOT_FOUND", message: "المقاول غير موجود" });
            if (contractor.projectId) await assertProjectAccess(db, ctx, contractor.projectId);
          }
        }
        if (["sales_invoice", "purchase_invoice"].includes(input.documentType) && !input.partyName?.trim()) throw new TRPCError({ code: "BAD_REQUEST", message: input.documentType === "sales_invoice" ? "اختر العميل أولًا" : "اختر المورد أولًا" });
        if (input.documentType === "sales_invoice" && !input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر مشروع الإيراد قبل حفظ فاتورة المبيعات" });
        if (["sales_invoice", "purchase_invoice"].includes(input.documentType)) {
          const invoiceAccounts = await db.select({ id: accounts.id, code: accounts.code }).from(accounts);
          const codeById = new Map(invoiceAccounts.map((account) => [account.id, account.code]));
          const debitLines = input.lines.filter((line) => line.debit > 0);
          const creditLines = input.lines.filter((line) => line.credit > 0);
          const debitCodes = debitLines.map((line) => codeById.get(line.accountId));
          const creditCodes = creditLines.map((line) => codeById.get(line.accountId));
          if (input.documentType === "sales_invoice" && (debitLines.length > 0 || creditLines.length !== 1 || !creditCodes.includes("4101") || input.lines.some((line) => line.costItemId))) throw new TRPCError({ code: "BAD_REQUEST", message: "فاتورة المبيعات يجب أن تحتوي على حساب إيراد المشروع في الجانب الدائن فقط دون جانب مدين أو بند تكلفة" });
          if (input.documentType === "purchase_invoice" && (!creditCodes.includes("2101") || debitCodes.includes("2101"))) throw new TRPCError({ code: "BAD_REQUEST", message: "فاتورة المشتريات يجب أن تكون مدينة على بند التكلفة ودائنة على المورد" });
        }
        if (input.relatedDocumentType || input.relatedDocumentId) {
          if (!input.relatedDocumentType || !input.relatedDocumentId) throw new TRPCError({ code: "BAD_REQUEST", message: "حدد نوع ورقم المستند المرتبط معًا" });
          if (input.relatedDocumentType === "quotation") {
            const linked = (await db.select({ id: accountingDocuments.id, projectId: accountingDocuments.projectId, documentType: accountingDocuments.documentType }).from(accountingDocuments).where(eq(accountingDocuments.id, input.relatedDocumentId)).limit(1))[0];
            if (!linked || linked.documentType !== "quotation") throw new TRPCError({ code: "BAD_REQUEST", message: "عرض السعر المرتبط غير موجود" });
            if (input.projectId && linked.projectId && linked.projectId !== input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "عرض السعر لا يخص المشروع المحدد" });
          } else {
            const linked = (await db.select({ id: certificates.id, projectId: certificates.projectId }).from(certificates).where(eq(certificates.id, input.relatedDocumentId)).limit(1))[0];
            if (!linked) throw new TRPCError({ code: "BAD_REQUEST", message: "المستخلص المرتبط غير موجود" });
            if (input.projectId && linked.projectId !== input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "المستخلص لا يخص المشروع المحدد" });
            const linkedProject = input.projectId ? (await db.select({ projectType: projects.projectType }).from(projects).where(eq(projects.id, input.projectId)).limit(1))[0] : null;
            if (linkedProject?.projectType !== "off_plan_sales") throw new TRPCError({ code: "BAD_REQUEST", message: "مستخلص الربط متاح فقط لمشاريع البيع على الخارطة وليس لمستخلصات المقاولين" });
          }
        }
        if (input.documentType === "credit_note") {
          if (!input.originalDocumentId || !input.returnType) throw new TRPCError({ code: "BAD_REQUEST", message: "الإشعار الدائن يجب أن يرتبط بفاتورة مبيعات ويحدد نوع المرتجع" });
          const original = (await db.select().from(accountingDocuments).where(eq(accountingDocuments.id, input.originalDocumentId)).limit(1))[0];
          if (!original || original.documentType !== "sales_invoice") throw new TRPCError({ code: "BAD_REQUEST", message: "الفاتورة الأصلية غير صالحة للإشعار الدائن" });
          const priorReturns = (await db.select().from(accountingDocuments)).filter((row) => row.documentType === "credit_note" && row.originalDocumentId === input.originalDocumentId).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
          const remaining = Math.max(Number(original.totalAmount || 0) - priorReturns, 0);
          if (input.totalAmount <= 0 || input.totalAmount > remaining + 0.01) throw new TRPCError({ code: "BAD_REQUEST", message: `قيمة المرتجع تتجاوز المتبقي من الفاتورة. المتاح: ${remaining.toFixed(2)} ر.س` });
          if (input.returnType === "full" && Math.abs(input.totalAmount - remaining) > 0.01) throw new TRPCError({ code: "BAD_REQUEST", message: "المرتجع الكامل يجب أن يساوي المتبقي من الفاتورة" });
          if (input.lines.length !== 1 || input.lines[0].debit <= 0 || input.lines[0].credit !== 0) throw new TRPCError({ code: "BAD_REQUEST", message: "الإشعار الدائن يجب أن يعكس إيراد المشروع في جانب المدين فقط" });
        }
        const totals = accountingTotals(input.lines);
        if (!totals.balanced && !["sales_invoice", "credit_note"].includes(input.documentType)) throw new TRPCError({ code: "BAD_REQUEST", message: "القيد غير متوازن: إجمالي المدين يجب أن يساوي إجمالي الدائن" });
        const prefixes = { sales_invoice: "SI", purchase_invoice: "PI", purchase_receipt: "GRN", credit_note: "CN", journal_entry: "JE", payment_voucher: "PV", receipt_voucher: "RV", quotation: "QT", purchase_order: "PO" } as const;
        const documentNumber = `${prefixes[input.documentType]}-${Date.now()}`;
        const result = await db.insert(accountingDocuments).values({ companyId: activeCompanyId, projectId: input.projectId || null, voucherCategory: input.documentType === "payment_voucher" ? input.voucherCategory || null : null, contractorId: input.documentType === "payment_voucher" ? input.contractorId || null : null, supplierId: input.documentType === "payment_voucher" ? input.supplierId || null : null, purchaseInvoiceId: input.documentType === "payment_voucher" ? input.purchaseInvoiceId || null : null, settlementType: input.documentType === "payment_voucher" ? input.settlementType || "direct" : null, certificateId: input.documentType === "purchase_invoice" ? input.certificateId || null : null, relatedDocumentType: input.relatedDocumentType || null, relatedDocumentId: input.relatedDocumentId || null, originalDocumentId: input.originalDocumentId || null, sourceDocumentId: input.sourceDocumentId || null, returnType: input.returnType || null, documentType: input.documentType, documentNumber, partyName: input.partyName || null, partyTaxNumber: input.partyTaxNumber || null, documentDate: input.documentDate ? new Date(input.documentDate) : new Date(), dueDate: input.dueDate ? new Date(input.dueDate) : null, sourceAccountId: input.sourceAccountId || null, amount: input.amount.toFixed(2), taxAmount: input.taxAmount.toFixed(2), totalAmount: input.totalAmount.toFixed(2), paymentMethod: input.paymentMethod || null, status: requiresSupplierInvoicePaymentApproval(input) ? "draft" : input.status, notes: input.notes || null, createdBy: ctx.user.id });
        const id = Number(result[0].insertId);
        for (const line of input.lines) await db.insert(accountingDocumentLines).values({ documentId: id, accountId: line.accountId, costItemId: line.costItemId || null, projectId: line.projectId || input.projectId || null, stageId: line.stageId || null, description: line.description || null, debit: line.debit.toFixed(2), credit: line.credit.toFixed(2) });
        if (input.documentType === "payment_voucher" && input.voucherCategory === "payroll" && !input.projectId) {
          const activeProjects = (await db.select().from(projects)).filter((project) => project.status === "active" && project.classification === "operational" && Number(project.contractValue || 0) > 0);
          const totalContractValue = activeProjects.reduce((sum, project) => sum + Number(project.contractValue || 0), 0);
          if (totalContractValue > 0) {
            const salaryDate = input.documentDate ? new Date(input.documentDate) : new Date();
            const payrollResult = await db.insert(administrativePayroll).values({ employeeName: input.partyName!.trim(), month: salaryDate.getMonth() + 1, year: salaryDate.getFullYear(), totalAmount: input.totalAmount.toFixed(2), paidAmount: input.totalAmount.toFixed(2), status: "paid", createdBy: ctx.user.id });
            const administrativePayrollId = Number(payrollResult[0].insertId);
            await db.insert(payrollAllocations).values(activeProjects.map((project) => {
              const ratio = Number(project.contractValue || 0) / totalContractValue;
              return { administrativePayrollId, projectId: project.id, ratio: ratio.toFixed(6), allocatedAmount: (input.totalAmount * ratio).toFixed(2) };
            }));
          }
        }
        if (input.fixedAssetId) {
          const asset = (await db.select({ id: fixedAssets.id }).from(fixedAssets).where(eq(fixedAssets.id, input.fixedAssetId)).limit(1))[0];
          if (!asset) throw new TRPCError({ code: "NOT_FOUND", message: "بطاقة الأصل غير موجودة" });
          await db.update(fixedAssets).set({ sourceDocumentId: id }).where(eq(fixedAssets.id, input.fixedAssetId));
        }
        await db.insert(auditLogs).values({ entityType: "accountingDocument", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, documentNumber }) });
        if (requiresSupplierInvoicePaymentApproval(input)) {
          await db.insert(approvalRequests).values({ projectId: input.projectId || null, entityType: "purchase_payment", entityId: id, requestedBy: ctx.user.id, status: "pending", approvalStage: "general_manager", stageOrder: 1 });
          await notifyApprovalUsers(db, { type: "purchase_payment_pending", title: `سند صرف مورد يحتاج اعتماد — ${documentNumber}`, message: `سند صرف بقيمة ${input.totalAmount.toFixed(2)} ر.س للمورد ${input.partyName || "غير محدد"} لسداد فاتورة شراء #${input.purchaseInvoiceId} يحتاج اعتماد المدير العام.`, roles: ["general_manager"] });
        }
        return { id, documentNumber };
      }),
      update: protectedProcedure.input(z.object({ id: z.number().int().positive(), relatedDocumentType: z.enum(["quotation", "certificate"]).optional().nullable(), relatedDocumentId: z.number().int().positive().optional().nullable(), originalDocumentId: z.number().int().positive().optional().nullable(), returnType: z.enum(["full", "partial"]).optional().nullable(), projectId: z.number().int().positive().optional().nullable(), partyName: z.string().max(255).optional(), partyTaxNumber: z.string().max(64).optional(), voucherCategory: z.enum(["contractor", "supplier", "materials", "payroll", "operating", "administrative", "petty_cash"]).optional().nullable(), contractorId: z.number().int().positive().optional().nullable(), supplierId: z.number().int().positive().optional().nullable(), purchaseInvoiceId: z.number().int().positive().optional().nullable(), settlementType: z.enum(["invoice", "direct"]).optional().nullable(), sourceAccountId: z.number().int().positive().optional().nullable(), paymentMethod: z.enum(["cash", "bank"]).optional().nullable(), documentDate: z.string().optional(), dueDate: z.string().optional(), amount: z.number().nonnegative(), taxAmount: z.number().nonnegative(), totalAmount: z.number().nonnegative(), notes: z.string().max(2000).optional(), status: z.enum(["draft", "posted", "cancelled"]).optional(), lines: z.array(z.object({ accountId: z.number().int().positive(), costItemId: z.number().int().positive().optional(), projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), description: z.string().max(500).optional(), debit: z.number().nonnegative(), credit: z.number().nonnegative() })).min(1) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "edit");
        const before = (await db.select().from(accountingDocuments).where(eq(accountingDocuments.id, input.id)).limit(1))[0];
        if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المستند غير موجود" });
        const targetProjectId = input.projectId ?? before.projectId ?? undefined;
        if (targetProjectId) await assertProjectWrite(db, ctx, targetProjectId);
        if (before.documentType === "sales_invoice" && (input.lines.some((line) => line.debit > 0) || input.lines.length !== 1 || input.lines.some((line) => line.costItemId))) throw new TRPCError({ code: "BAD_REQUEST", message: "فاتورة المبيعات يجب أن تحتوي على حساب إيراد المشروع في الجانب الدائن فقط دون جانب مدين أو بند تكلفة" });
        const totals = accountingTotals(input.lines);
        if (!totals.balanced && before.documentType !== "sales_invoice") throw new TRPCError({ code: "BAD_REQUEST", message: "القيد غير متوازن: إجمالي المدين يجب أن يساوي إجمالي الدائن" });
        await db.update(accountingDocuments).set({ relatedDocumentType: input.relatedDocumentType === null ? null : input.relatedDocumentType || before.relatedDocumentType, relatedDocumentId: input.relatedDocumentId === null ? null : input.relatedDocumentId || before.relatedDocumentId, originalDocumentId: input.originalDocumentId === null ? null : input.originalDocumentId || before.originalDocumentId, returnType: input.returnType === null ? null : input.returnType || before.returnType, projectId: input.projectId === null ? null : targetProjectId || null, partyName: input.partyName || null, partyTaxNumber: input.partyTaxNumber || null, voucherCategory: input.voucherCategory === null ? null : input.voucherCategory || before.voucherCategory, contractorId: input.contractorId === null ? null : input.contractorId ?? before.contractorId, supplierId: input.supplierId === null ? null : input.supplierId ?? before.supplierId, purchaseInvoiceId: input.purchaseInvoiceId === null ? null : input.purchaseInvoiceId ?? before.purchaseInvoiceId, settlementType: input.settlementType === null ? null : input.settlementType || before.settlementType, sourceAccountId: input.sourceAccountId === null ? null : input.sourceAccountId ?? before.sourceAccountId, paymentMethod: input.paymentMethod === null ? null : input.paymentMethod || before.paymentMethod, documentDate: input.documentDate ? new Date(input.documentDate) : before.documentDate, dueDate: input.dueDate ? new Date(input.dueDate) : before.dueDate, amount: input.amount.toFixed(2), taxAmount: input.taxAmount.toFixed(2), totalAmount: input.totalAmount.toFixed(2), notes: input.notes || null, status: input.status || before.status }).where(eq(accountingDocuments.id, input.id));
        await db.delete(accountingDocumentLines).where(eq(accountingDocumentLines.documentId, input.id));
        for (const line of input.lines) await db.insert(accountingDocumentLines).values({ documentId: input.id, accountId: line.accountId, costItemId: line.costItemId || null, projectId: line.projectId || targetProjectId || null, stageId: line.stageId || null, description: line.description || null, debit: line.debit.toFixed(2), credit: line.credit.toFixed(2) });
        await db.insert(auditLogs).values({ entityType: "accountingDocument", entityId: input.id, action: "updated", actorId: ctx.user.id, beforeJson: JSON.stringify(before), afterJson: JSON.stringify(input) });
        return { id: input.id };
      }),
      delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const before = (await db.select().from(accountingDocuments).where(eq(accountingDocuments.id, input.id)).limit(1))[0];
        if (!before) throw new TRPCError({ code: "NOT_FOUND", message: "المستند غير موجود" });
        const allDocuments = await db.select().from(accountingDocuments);
        const dependentDocuments = allDocuments.filter((document) => document.id !== input.id && (document.sourceDocumentId === input.id || document.originalDocumentId === input.id || document.purchaseInvoiceId === input.id));
        const sale = before.documentType === "sales_invoice" && before.sourceDocumentId ? (await db.select().from(sales).where(eq(sales.id, before.sourceDocumentId)).limit(1))[0] : undefined;
        const linkedCollections = sale ? await db.select().from(collections).where(eq(collections.saleId, sale.id)) : [];
        const documentIds = [input.id, ...dependentDocuments.map((document) => document.id)];
        const lines = await db.select().from(accountingDocumentLines).where(eq(accountingDocumentLines.documentId, input.id));
        await db.insert(auditLogs).values({ entityType: "accountingDocument", entityId: input.id, action: "deleted_with_dependencies", actorId: ctx.user.id, beforeJson: JSON.stringify({ document: before, lines, dependentDocuments, linkedCollections, sale }) });
        for (const documentId of documentIds) {
          await db.delete(approvalRequests).where(and(eq(approvalRequests.entityType, "purchase_payment"), eq(approvalRequests.entityId, documentId)));
          await db.delete(accountingDocumentLines).where(eq(accountingDocumentLines.documentId, documentId));
        }
        for (const document of dependentDocuments) await db.delete(accountingDocuments).where(eq(accountingDocuments.id, document.id));
        if (sale) {
          await db.delete(approvalRequests).where(and(eq(approvalRequests.entityType, "sale"), eq(approvalRequests.entityId, sale.id)));
          for (const collection of linkedCollections) await db.delete(collections).where(eq(collections.id, collection.id));
          await db.delete(sales).where(eq(sales.id, sale.id));
          const remainingUnitSales = await db.select({ id: sales.id }).from(sales).where(eq(sales.unitId, sale.unitId));
          if (!remainingUnitSales.length) await db.update(units).set({ status: "available" }).where(eq(units.id, sale.unitId));
        }
        await db.delete(accountingDocuments).where(eq(accountingDocuments.id, input.id));
        return { id: input.id, deleted: true, deletedDocumentIds: documentIds, deletedSaleId: sale?.id ?? null, deletedCollectionIds: linkedCollections.map((collection) => collection.id) } as const;
      }),
      settleSales: protectedProcedure.input(z.object({ salesInvoiceId: z.number().int().positive(), cashAccountId: z.number().int().positive(), amount: z.number().positive(), paymentDate: z.string().trim().min(1, "تاريخ التحصيل مطلوب"), notes: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "receipt_voucher");
        const invoice = (await db.select().from(accountingDocuments).where(eq(accountingDocuments.id, input.salesInvoiceId)).limit(1))[0];
        if (!invoice || invoice.documentType !== "sales_invoice") throw new TRPCError({ code: "NOT_FOUND", message: "فاتورة المبيعات غير موجودة" });
        const cashAccount = (await db.select().from(cashAccounts).where(and(eq(cashAccounts.id, input.cashAccountId), eq(cashAccounts.isActive, 1))).limit(1))[0];
        if (!cashAccount?.accountId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر بنكًا أو خزينة مرتبطة بحساب محاسبي" });
        const paidBefore = Number(invoice.paidAmount || 0);
        const creditedBefore = (await db.select().from(accountingDocuments)).filter((row) => row.documentType === "credit_note" && row.originalDocumentId === invoice.id).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        const netInvoiceTotal = Math.max(Number(invoice.totalAmount || 0) - creditedBefore, 0);
        const remaining = Math.max(netInvoiceTotal - paidBefore, 0);
        if (input.amount > remaining + 0.005) throw new TRPCError({ code: "BAD_REQUEST", message: "قيمة المقبوض أكبر من المتبقي على الفاتورة بعد الإشعارات الدائنة" });
        const paidAfter = paidBefore + input.amount;
        const paymentStatus = paidAfter >= netInvoiceTotal - 0.005 ? "paid" : "partially_paid";
        const receivable = (await db.select({ id: accounts.id }).from(accounts).where(eq(accounts.code, "1201")).limit(1))[0];
        if (!receivable) throw new TRPCError({ code: "BAD_REQUEST", message: "حساب العملاء 1201 غير موجود" });
        const documentNumber = `RV-${Date.now()}`;
        const result = await db.insert(accountingDocuments).values({ documentType: "receipt_voucher", documentNumber, partyName: invoice.partyName, projectId: invoice.projectId, sourceAccountId: cashAccount.accountId, sourceDocumentId: invoice.id, amount: input.amount.toFixed(2), taxAmount: "0.00", totalAmount: input.amount.toFixed(2), paidAmount: input.amount.toFixed(2), paymentStatus: "paid", paymentMethod: cashAccount.accountType === "bank" ? "bank" : "cash", documentDate: new Date(input.paymentDate), status: "posted", notes: input.notes || `مقبوضات فاتورة ${invoice.documentNumber}`, createdBy: ctx.user.id });
        const paymentId = Number(result[0].insertId);
        await db.insert(accountingDocumentLines).values([{ documentId: paymentId, accountId: cashAccount.accountId, projectId: invoice.projectId || null, description: `${cashAccount.name} — ${invoice.documentNumber}`, debit: input.amount.toFixed(2), credit: "0.00" }, { documentId: paymentId, accountId: receivable.id, projectId: invoice.projectId || null, description: `تحصيل من ${invoice.partyName || "العميل"}`, debit: "0.00", credit: input.amount.toFixed(2) }]);
        await db.update(accountingDocuments).set({ paidAmount: paidAfter.toFixed(2), paymentStatus }).where(eq(accountingDocuments.id, invoice.id));
        return { paymentId, paymentNumber: documentNumber, paidAmount: paidAfter, creditedAmount: creditedBefore, remaining: Math.max(netInvoiceTotal - paidAfter, 0), paymentStatus };
      }),
      settlePurchase: protectedProcedure.input(z.object({ purchaseInvoiceId: z.number().int().positive(), cashAccountId: z.number().int().positive(), amount: z.number().positive(), paymentDate: z.string().optional(), notes: z.string().max(2000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "payment_voucher");
        const invoice = (await db.select().from(accountingDocuments).where(eq(accountingDocuments.id, input.purchaseInvoiceId)).limit(1))[0];
        if (!invoice || invoice.documentType !== "purchase_invoice") throw new TRPCError({ code: "NOT_FOUND", message: "فاتورة الشراء غير موجودة" });
        const cashAccount = (await db.select().from(cashAccounts).where(and(eq(cashAccounts.id, input.cashAccountId), eq(cashAccounts.isActive, 1))).limit(1))[0];
        if (!cashAccount) throw new TRPCError({ code: "NOT_FOUND", message: "حساب البنك أو الخزينة غير موجود أو غير نشط" });
        if (!cashAccount.accountId) throw new TRPCError({ code: "BAD_REQUEST", message: "اربط حساب البنك أو الخزينة بحساب محاسبي أولًا" });
        const paidBefore = Number(invoice.paidAmount || 0);
        const remaining = Math.max(Number(invoice.totalAmount || 0) - paidBefore, 0);
        if (remaining <= 0) throw new TRPCError({ code: "BAD_REQUEST", message: "فاتورة الشراء مسددة بالكامل" });
        if (input.amount > remaining + 0.005) throw new TRPCError({ code: "BAD_REQUEST", message: `قيمة السداد تتجاوز المتبقي (${remaining.toFixed(2)})` });
        const payable = (await db.select({ id: accounts.id }).from(accounts).where(and(eq(accounts.code, "2101"), eq(accounts.isActive, 1))).limit(1))[0];
        if (!payable) throw new TRPCError({ code: "BAD_REQUEST", message: "حساب الموردين 2101 غير موجود في الشجرة" });
        const paidAfter = paidBefore + input.amount;
        const paymentStatus = paidAfter >= Number(invoice.totalAmount || 0) - 0.005 ? "paid" : "partially_paid" as const;
        const documentNumber = `PV-${Date.now()}`;
        const result = await db.insert(accountingDocuments).values({ projectId: invoice.projectId || null, documentType: "payment_voucher", documentNumber, partyName: invoice.partyName || null, voucherCategory: "supplier", supplierId: invoice.supplierId || null, purchaseInvoiceId: invoice.id, documentDate: input.paymentDate ? new Date(input.paymentDate) : new Date(), sourceAccountId: cashAccount.accountId, amount: input.amount.toFixed(2), taxAmount: "0.00", totalAmount: input.amount.toFixed(2), paymentMethod: cashAccount.accountType === "bank" ? "bank" : "cash", status: "posted", notes: input.notes || `سداد فاتورة شراء ${invoice.documentNumber}`, createdBy: ctx.user.id });
        const paymentId = Number(result[0].insertId);
        await db.insert(accountingDocumentLines).values({ documentId: paymentId, accountId: payable.id, projectId: invoice.projectId || null, description: `سداد مورد — ${invoice.documentNumber}`, debit: input.amount.toFixed(2), credit: "0.00" });
        await db.insert(accountingDocumentLines).values({ documentId: paymentId, accountId: cashAccount.accountId, projectId: invoice.projectId || null, description: `${cashAccount.name} — ${invoice.documentNumber}`, debit: "0.00", credit: input.amount.toFixed(2) });
        await db.update(accountingDocuments).set({ paidAmount: paidAfter.toFixed(2), paymentStatus }).where(eq(accountingDocuments.id, invoice.id));
        await db.insert(auditLogs).values({ entityType: "accountingDocument", entityId: invoice.id, action: "purchase_invoice_settled", actorId: ctx.user.id, beforeJson: JSON.stringify({ paidAmount: paidBefore, paymentStatus: invoice.paymentStatus }), afterJson: JSON.stringify({ paidAmount: paidAfter, paymentStatus, paymentId, sourceCashAccountId: input.cashAccountId }) });
        return { paymentId, paymentNumber: documentNumber, paidAmount: paidAfter, remaining: Math.max(Number(invoice.totalAmount || 0) - paidAfter, 0), paymentStatus };
      }),
    }),
    reports: router({
      customerStatement: protectedProcedure.input(z.object({ partyName: z.string().min(1), projectId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() })).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const rows = (await loadAccountingLedger(db, input, await resolveActiveCompanyId(db, ctx))).filter((row) => row.document.partyName === input.partyName);
        const debit = rows.reduce((sum, row) => sum + Number(row.debit), 0);
        const credit = rows.reduce((sum, row) => sum + Number(row.credit), 0);
        return { partyName: input.partyName, debit, credit, balance: debit - credit, rows };
      }),
      supplierStatement: protectedProcedure.input(z.object({ partyName: z.string().min(1), projectId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() })).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const rows = (await loadAccountingLedger(db, input, await resolveActiveCompanyId(db, ctx))).filter((row) => row.document.partyName === input.partyName);
        const debit = rows.reduce((sum, row) => sum + Number(row.debit), 0);
        const credit = rows.reduce((sum, row) => sum + Number(row.credit), 0);
        return { partyName: input.partyName, debit, credit, balance: credit - debit, rows };
      }),
      trialBalance: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() }).optional()).query(async ({ input }) => {
        const db = requireDb(await getDb());
        const rows = await loadAccountingLedger(db, input || {});
        const grouped = new Map<number, { accountId: number; code: string; name: string; debit: number; credit: number }>();
        for (const row of rows) { const account = row.account; if (!account) continue; const current = grouped.get(account.id) || { accountId: account.id, code: account.code, name: account.name, debit: 0, credit: 0 }; current.debit += Number(row.debit); current.credit += Number(row.credit); grouped.set(account.id, current); }
        const items = Array.from(grouped.values()).map((item) => ({ ...item, balance: item.debit - item.credit }));
        return { items, totalDebit: items.reduce((sum, item) => sum + item.debit, 0), totalCredit: items.reduce((sum, item) => sum + item.credit, 0) };
      }),
      incomeStatement: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() }).optional()).query(async ({ input }) => {
        const db = requireDb(await getDb());
        const rows = await loadAccountingLedger(db, input || {});
        const ledgerRevenue = rows.filter((row) => row.account?.accountType === "revenue").reduce((sum, row) => sum + Number(row.credit) - Number(row.debit), 0);
        const ledgerExpenses = rows.filter((row) => row.account?.accountType === "expense").reduce((sum, row) => sum + Number(row.debit) - Number(row.credit), 0);
        const [salesRows, expenseRows, payrollRows, certificateRows, voucherRows] = await Promise.all([db.select().from(sales), db.select().from(expenses), db.select().from(payroll), db.select().from(certificates), db.select().from(accountingDocuments).where(eq(accountingDocuments.documentType, "payment_voucher"))]);
        const from = input?.from ? new Date(input.from).getTime() : Number.NEGATIVE_INFINITY;
        const to = input?.to ? new Date(input.to).getTime() + 86400000 : Number.POSITIVE_INFINITY;
        const inRange = (date: Date | null) => !date || (new Date(date).getTime() >= from && new Date(date).getTime() <= to);
        const scoped = <T extends { projectId?: number | null; status?: string; saleDate?: Date | null; expenseDate?: Date | null; createdAt?: Date | null; certificateDate?: Date | null; documentDate?: Date | null }>(rowsToScope: T[], dateKey: keyof T) => rowsToScope.filter((row) => (!input?.projectId || row.projectId === input.projectId) && inRange((row[dateKey] as Date | null | undefined) || null));
        const operationalRevenue = scoped(salesRows, "saleDate").filter((row) => row.status === "confirmed").reduce((sum, row) => sum + Number(row.recognizedRevenue || 0), 0);
        const offPlanClaimCertificatesTotal = scoped(certificateRows, "certificateDate").filter((row) => !row.vendorId && !row.contractId && ["submitted", "approved", "paid"].includes(row.status)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        const operationalExpenses = scoped(expenseRows, "expenseDate").filter((row) => row.classification !== "administrative" && ["approved", "posted"].includes(row.status)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) + scoped(payrollRows, "createdAt").filter((row) => row.classification !== "administrative" && ["approved", "posted", "paid"].includes(row.status)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) + scoped(certificateRows, "certificateDate").filter((row) => Boolean(row.vendorId || row.contractId) && ["approved", "paid"].includes(row.status)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) + scoped(voucherRows, "documentDate").filter((row) => row.status === "posted").reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        const income = Math.abs(ledgerRevenue) > 0.001 ? ledgerRevenue : operationalRevenue;
        const expensesTotal = Math.abs(ledgerExpenses) > 0.001 ? ledgerExpenses : operationalExpenses;
        return { revenue: income, expenses: expensesTotal, netIncome: income - expensesTotal, offPlanClaimCertificatesTotal, revenueRows: rows.filter((row) => row.account?.accountType === "revenue"), expenseRows: rows.filter((row) => row.account?.accountType === "expense") };
      }),
      balanceSheet: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() }).optional()).query(async ({ input }) => {
        const db = requireDb(await getDb());
        const rows = await loadAccountingLedger(db, input || {});
        const total = (type: string) => rows.filter((row) => row.account?.accountType === type).reduce((sum, row) => sum + Number(row.debit) - Number(row.credit), 0);
        const assets = total("asset"); const liabilities = total("liability") * -1; const equity = total("equity") * -1; const revenue = rows.filter((row) => row.account?.accountType === "revenue").reduce((sum, row) => sum + Number(row.credit) - Number(row.debit), 0); const expensesTotal = total("expense");
        return { assets, liabilities, equity, retainedEarnings: revenue - expensesTotal, totalLiabilitiesAndEquity: liabilities + equity + revenue - expensesTotal, balanced: Math.abs(assets - (liabilities + equity + revenue - expensesTotal)) <= 0.01 };
      }),
      costItemStatement: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), costItemId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() }).optional()).query(async ({ input }) => {
        const db = requireDb(await getDb());
        const rows = (await loadAccountingLedger(db, input || {})).filter((row) => row.costItem && (!input?.costItemId || row.costItem.id === input.costItemId));
        const grouped = new Map<number, { costItemId: number; code: string; name: string; category: string; debit: number; credit: number; net: number }>();
        for (const row of rows) { const item = row.costItem!; const current = grouped.get(item.id) || { costItemId: item.id, code: item.code, name: item.name, category: item.category, debit: 0, credit: 0, net: 0 }; current.debit += Number(row.debit); current.credit += Number(row.credit); current.net += Number(row.debit) - Number(row.credit); grouped.set(item.id, current); }
        const items = Array.from(grouped.values());
        return { items, total: items.reduce((sum, item) => sum + item.net, 0), rows };
      }),
      accountStatement: protectedProcedure.input(z.object({ accountId: z.number().int().positive(), projectId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() })).query(async ({ input }) => {
        const db = requireDb(await getDb());
        const account = (await db.select().from(accounts).where(eq(accounts.id, input.accountId)).limit(1))[0];
        if (!account) throw new TRPCError({ code: "NOT_FOUND", message: "الحساب غير موجود" });
        const rows = (await loadAccountingLedger(db, input)).filter((row) => row.accountId === input.accountId).sort((a, b) => String(a.document.documentDate || "").localeCompare(String(b.document.documentDate || "")) || a.id - b.id);
        let balance = 0;
        const items = rows.map((row) => { const debit = Number(row.debit); const credit = Number(row.credit); balance += debit - credit; return { id: row.id, documentId: row.documentId, documentNumber: row.document.documentNumber, documentType: row.document.documentType, documentDate: row.document.documentDate, partyName: row.document.partyName, description: row.description || row.document.notes || row.document.partyName || "—", debit, credit, balance, projectId: row.projectId ?? row.document.projectId ?? null, costItem: row.costItem ? { code: row.costItem.code, name: row.costItem.name } : null }; });
        return { account, items, totals: { debit: items.reduce((sum, item) => sum + item.debit, 0), credit: items.reduce((sum, item) => sum + item.credit, 0), balance } };
      }),
      financialPosition: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), from: z.string().optional(), to: z.string().optional() }).optional()).query(async ({ input }) => {
        const db = requireDb(await getDb());
        const rows = await loadAccountingLedger(db, input || {});
        const cash = rows.filter((row) => ["1101", "1103"].includes(row.account?.code || "")).reduce((sum, row) => sum + Number(row.debit) - Number(row.credit), 0);
        const receivables = rows.filter((row) => row.account?.code === "1201").reduce((sum, row) => sum + Number(row.debit) - Number(row.credit), 0);
        const payables = rows.filter((row) => row.account?.code === "2101").reduce((sum, row) => sum + Number(row.credit) - Number(row.debit), 0);
        return { cash, receivables, payables, netWorkingCapital: cash + receivables - payables };
      }),
    }),
  }),

  reports: router({
    costCenter: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [stageRows, expenseRows, payrollRows, custodyRows, certificateRows, collectionRows] = await Promise.all([
        db.select().from(stages).where(eq(stages.projectId, input.projectId)),
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(payroll).where(eq(payroll.projectId, input.projectId)),
        db.select().from(custody).where(eq(custody.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
        db.select().from(collections).where(eq(collections.projectId, input.projectId)),
      ]);
      return stageRows.map((stage) => {
        const stageExpenses = expenseRows.filter((row) => row.stageId === stage.id);
        const stagePayroll = payrollRows.filter((row) => row.stageId === stage.id);
        const stageCustody = custodyRows.filter((row) => row.stageId === stage.id);
        const stageCertificates = certificateRows.filter((row) => row.stageId === stage.id && Boolean(row.vendorId || row.contractId));
        return { stage, byType: stageExpenses.reduce<Record<string, { total: number; paid: number; outstanding: number }>>((acc, row) => { const key = row.expenseType || "operating"; const current = acc[key] || { total: 0, paid: 0, outstanding: 0 }; current.total += Number(row.totalAmount); current.paid += Number(row.paidAmount); current.outstanding += Math.max(Number(row.totalAmount) - Number(row.paidAmount), 0); acc[key] = current; return acc; }, {}), expenses: stageExpenses, payroll: stagePayroll, custody: stageCustody, certificates: stageCertificates, collections: collectionRows.filter((row) => row.status === "received") };
      });
    }),
    projectStageDetail: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [stageRows, expenseRows, payrollRows, certificateRows, costCatalogRows, vendorRows, budgetLineRows] = await Promise.all([
        db.select().from(stages).where(eq(stages.projectId, input.projectId)),
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(payroll).where(eq(payroll.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
        db.select().from(costItems),
        db.select().from(vendors).where(eq(vendors.projectId, input.projectId)),
        db.select().from(projectBudgetLines).where(eq(projectBudgetLines.projectId, input.projectId)),
      ]);
      const vendorName = (ids: Array<number | null>) => Array.from(new Set(ids.filter((id): id is number => Boolean(id)).map((id) => vendorRows.find((vendor) => vendor.id === id)?.name).filter((name): name is string => Boolean(name)))).join("، ");
      const activeExpenses = expenseRows.filter((row) => row.status !== "rejected" && row.status !== "draft");
      const actualForStage = (stageId: number) => activeExpenses.filter((row) => row.stageId === stageId);
      const payrollForStage = (stageId: number) => payrollRows.filter((row) => row.stageId === stageId);
      const certificateForStage = (stageId: number) => certificateRows.filter((row) => row.stageId === stageId && row.status !== "rejected" && Boolean(row.vendorId || row.contractId));
      const timeMetrics = (plannedEnd: Date | string | null, status: string) => calculateStageTimeVariance(plannedEnd, status);
      const makeMetrics = (plannedBudget: number, rows: typeof activeExpenses, stageId?: number) => {
        const expenseTotal = rows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
        const paid = rows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
        const payrollTotal = stageId ? payrollForStage(stageId).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) : 0;
        const payrollPaid = stageId ? payrollForStage(stageId).reduce((sum, row) => sum + Number(row.paidAmount || 0), 0) : 0;
        const certificateTotal = stageId ? certificateForStage(stageId).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0) : 0;
        const certificatePaid = stageId ? certificateForStage(stageId).reduce((sum, row) => sum + Number(row.paidAmount || 0), 0) : 0;
        const actual = expenseTotal + payrollTotal + certificateTotal;
        const paidAmount = paid + payrollPaid + certificatePaid;
        const outstanding = Math.max(actual - paidAmount, 0);
        return { plannedBudget, actual, paidAmount, outstanding, variance: plannedBudget - actual, consumptionPct: plannedBudget > 0 ? (actual / plannedBudget) * 100 : 0 };
      };
      const rows = stageRows.map((stage) => {
        const stageExpenseRows = actualForStage(stage.id);
        const metrics = makeMetrics(Number(stage.plannedBudget || 0), stageExpenseRows, stage.id);
        const approvedStageCertificates = certificateForStage(stage.id).filter((certificate) => ["approved", "paid"].includes(certificate.status));
        const progress = calculateCertificateProgress({ plannedBudget: Number(stage.plannedBudget || 0), certifiedAmounts: approvedStageCertificates.map((certificate) => certificate.totalAmount) });
        const budgetParent = stage.budgetParentCostItemId ? costCatalogRows.find((item) => item.id === stage.budgetParentCostItemId) ?? null : null;
        return { rowType: "stage" as const, id: stage.id, code: stage.code, name: stage.name, stageId: stage.id, stageName: stage.name, budgetParentCostItemId: stage.budgetParentCostItemId ?? null, budgetParentCode: budgetParent?.code ?? null, budgetParentName: budgetParent?.name ?? null, plannedBudgetTaxBasis: stage.plannedBudgetTaxBasis, status: stage.status, plannedStart: stage.plannedStart, plannedEnd: stage.plannedEnd, actualProgress: approvedStageCertificates.length ? progress.progressPct : Number(stage.actualProgress || 0), certifiedAmount: progress.certifiedAmount, certificateCount: approvedStageCertificates.length, progressSource: approvedStageCertificates.length ? "contractor_certificates" as const : "manual" as const, contractor: vendorName(stageExpenseRows.map((row) => row.vendorId)), notes: stageExpenseRows.map((row) => row.description).filter(Boolean).slice(0, 3).join("، "), ...timeMetrics(stage.plannedEnd, stage.status), ...metrics };
      });
      const costItemRows = costCatalogRows.filter((item) => item.isActive === 1 && (item.projectId === null || item.projectId === input.projectId)).map((item) => {
        const itemExpenses = activeExpenses.filter((row) => row.costItemId === item.id);
        const metrics = makeMetrics(0, itemExpenses);
        const stage = stageRows.find((candidate) => itemExpenses.some((row) => row.stageId === candidate.id));
        return { rowType: "costItem" as const, id: item.id, code: item.code, name: item.name, stageId: stage?.id ?? null, stageName: stage?.name ?? "غير محدد", plannedBudgetTaxBasis: null, status: stage?.status ?? "planned", plannedStart: stage?.plannedStart ?? null, plannedEnd: stage?.plannedEnd ?? null, actualProgress: stage ? Number(stage.actualProgress || 0) : 0, contractor: vendorName(itemExpenses.map((row) => row.vendorId)), notes: itemExpenses.map((row) => row.description).filter(Boolean).slice(0, 3).join("، "), ...timeMetrics(stage?.plannedEnd ?? null, stage?.status ?? "planned"), ...metrics };
      });
      const parentIds = Array.from(new Set(rows.map((row) => row.budgetParentCostItemId).filter((id): id is number => Boolean(id))));
      const budgetParents = parentIds.map((parentId) => {
        const parent = costCatalogRows.find((item) => item.id === parentId);
        const plannedBudget = budgetLineRows.filter((line) => line.lineType === "cost" && line.costItemId === parentId).reduce((sum, line) => sum + Number(line.amount || 0), 0);
        const metrics = calculateParentBudgetMetrics({ plannedBudget, children: rows.filter((row) => row.budgetParentCostItemId === parentId) });
        return { id: parentId, code: parent?.code ?? `PARENT-${parentId}`, name: parent?.name ?? "حساب أب غير مسمى", ...metrics };
      });
      const total = rows.reduce((acc, row) => ({ plannedBudget: acc.plannedBudget + row.plannedBudget, actual: acc.actual + row.actual, paidAmount: acc.paidAmount + row.paidAmount, outstanding: acc.outstanding + row.outstanding }), { plannedBudget: 0, actual: 0, paidAmount: 0, outstanding: 0 });
      const stageTotal = rows.reduce((acc, row) => ({ plannedBudget: acc.plannedBudget + row.plannedBudget, actual: acc.actual + row.actual, paidAmount: acc.paidAmount + row.paidAmount, outstanding: acc.outstanding + row.outstanding }), { plannedBudget: 0, actual: 0, paidAmount: 0, outstanding: 0 });
      const materialsTotal = costItemRows.reduce((acc, row) => ({ plannedBudget: acc.plannedBudget + row.plannedBudget, actual: acc.actual + row.actual, paidAmount: acc.paidAmount + row.paidAmount, outstanding: acc.outstanding + row.outstanding }), { plannedBudget: 0, actual: 0, paidAmount: 0, outstanding: 0 });
      const withVariance = (value: typeof total) => ({ ...value, variance: value.plannedBudget - value.actual, consumptionPct: value.plannedBudget > 0 ? (value.actual / value.plannedBudget) * 100 : 0 });
      return { rows: [...rows, ...costItemRows], budgetParents, total: withVariance(total), stageTotal: withVariance(stageTotal), materialsTotal: withVariance(materialsTotal) };
    }),
    cashFlow: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [expenseRows, payrollRows, custodyRows, collectionRows, stageRows, salesRows, certificateRows] = await Promise.all([
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(payroll).where(eq(payroll.projectId, input.projectId)),
        db.select().from(custody).where(eq(custody.projectId, input.projectId)),
        db.select().from(collections).where(eq(collections.projectId, input.projectId)),
        db.select().from(stages).where(eq(stages.projectId, input.projectId)),
        db.select().from(sales).where(eq(sales.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
      ]);
      const contractorCertificateRows = certificateRows.filter((row) => Boolean(row.vendorId || row.contractId));
      const offPlanClaimRows = certificateRows.filter((row) => !row.vendorId && !row.contractId);
      const cashOut = expenseRows.reduce((sum, row) => sum + (row.classification === "project" ? Number(row.paidAmount) : 0), 0) + payrollRows.reduce((sum, row) => sum + (row.classification === "project" ? Number(row.paidAmount) : 0), 0) + custodyRows.reduce((sum, row) => sum + Number(row.settledAmount), 0) + contractorCertificateRows.reduce((sum, row) => sum + Number(row.paidAmount), 0);
      const receivedCollections = collectionRows.filter((row) => row.status === "received");
      const cashIn = receivedCollections.reduce((sum, row) => sum + Number(row.amount), 0);
      let cumulativeGap = 0;
      const stageCashFlow: Array<{ stageId: number | null; stageName: string; cashIn: number; cashOut: number; net: number; cumulativeGap: number; fundingRequired: number; allocation: string }> = stageRows.map((stage) => {
        const stageOut = expenseRows.filter((row) => row.stageId === stage.id && row.classification === "project").reduce((sum, row) => sum + Number(row.paidAmount), 0) + payrollRows.filter((row) => row.stageId === stage.id && row.classification === "project").reduce((sum, row) => sum + Number(row.paidAmount), 0) + custodyRows.filter((row) => row.stageId === stage.id).reduce((sum, row) => sum + Number(row.settledAmount), 0) + contractorCertificateRows.filter((row) => row.stageId === stage.id).reduce((sum, row) => sum + Number(row.paidAmount), 0);
        const stageIn = receivedCollections.filter((collection) => salesRows.some((sale) => sale.id === collection.saleId && sale.stageId === stage.id)).reduce((sum, collection) => sum + Number(collection.amount), 0);
        cumulativeGap += stageOut - stageIn;
        return { stageId: stage.id, stageName: stage.name, cashIn: stageIn, cashOut: stageOut, net: stageIn - stageOut, cumulativeGap, fundingRequired: Math.max(cumulativeGap, 0), allocation: stageIn > 0 ? "stage-linked-sales-and-outflows" : "stage-linked-outflow" };
      });
      const unallocatedCashIn = receivedCollections.filter((collection) => !salesRows.some((sale) => sale.id === collection.saleId && sale.stageId)).reduce((sum, collection) => sum + Number(collection.amount), 0);
      if (unallocatedCashIn) {
        cumulativeGap -= unallocatedCashIn;
        stageCashFlow.push({ stageId: null, stageName: "غير مصنف — يحتاج ربطًا بمرحلة", cashIn: unallocatedCashIn, cashOut: 0, net: unallocatedCashIn, cumulativeGap, fundingRequired: Math.max(cumulativeGap, 0), allocation: "collections-unallocated-because-sales-unlinked-to-stage" });
      }
      return { cashIn, cashOut, net: cashIn - cashOut, fundingRequired: Math.max(cashOut - cashIn, 0), collections: collectionRows, expensePayments: expenseRows, payrollPayments: payrollRows, custodySettlements: custodyRows, certificatePayments: contractorCertificateRows, offPlanClaimDocuments: offPlanClaimRows, stages: stageCashFlow };
    }),
    supplierStatement: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), vendorId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [expenseRows, certificateRows] = await Promise.all([
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
      ]);
      const vendorExpenses = expenseRows.filter((row) => row.vendorId === input.vendorId);
      const vendorCertificates = certificateRows.filter((row) => row.vendorId === input.vendorId);
      const debit = vendorExpenses.reduce((sum, row) => sum + Number(row.totalAmount), 0) + vendorCertificates.reduce((sum, row) => sum + Number(row.totalAmount), 0);
      const credit = vendorExpenses.reduce((sum, row) => sum + Number(row.paidAmount), 0) + vendorCertificates.reduce((sum, row) => sum + Number(row.paidAmount), 0);
      return { debit, credit, balance: debit - credit, expenses: vendorExpenses, certificates: vendorCertificates };
    }),
    financialSummary: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), from: z.string().optional(), to: z.string().optional() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [salesRows, collectionRows, expenseRows, payrollRows, certificateRows, voucherRows] = await Promise.all([
        db.select().from(sales).where(eq(sales.projectId, input.projectId)),
        db.select().from(collections).where(eq(collections.projectId, input.projectId)),
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(payroll).where(eq(payroll.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
        db.select().from(accountingDocuments).where(and(eq(accountingDocuments.projectId, input.projectId), eq(accountingDocuments.documentType, "payment_voucher"))),
      ]);
      const from = input.from ? new Date(input.from).getTime() : Number.NEGATIVE_INFINITY;
      const to = input.to ? new Date(input.to).getTime() + 86400000 : Number.POSITIVE_INFINITY;
      const inRange = (date: Date | null) => !date || (new Date(date).getTime() >= from && new Date(date).getTime() <= to);
      const scopedExpenses = expenseRows.filter((row) => row.classification !== "administrative" && inRange(row.expenseDate));
      const scopedPayroll = payrollRows.filter((row) => row.classification !== "administrative" && inRange(row.createdAt));
      const scopedSales = salesRows.filter((row) => inRange(row.saleDate));
      const scopedCollections = collectionRows.filter((row) => inRange(row.collectionDate));
      const totals = calculateFinancialSummaryTotals({ sales: scopedSales, collections: scopedCollections, expenses: scopedExpenses, payroll: scopedPayroll });
      const contractorCertificatesTotal = certificateRows.filter((row) => Boolean(row.vendorId || row.contractId) && ["approved", "paid"].includes(row.status) && inRange(row.certificateDate)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const offPlanClaimCertificatesTotal = certificateRows.filter((row) => !row.vendorId && !row.contractId && ["submitted", "approved", "paid"].includes(row.status) && inRange(row.certificateDate)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const postedVoucherTotal = voucherRows.filter((row) => row.status === "posted" && inRange(row.documentDate)).reduce((sum, row) => sum + Number(row.totalAmount || 0), 0);
      const expensesTotal = totals.expensesTotal + contractorCertificatesTotal + postedVoucherTotal;
      return { ...totals, expensesTotal, contractorCertificatesTotal, offPlanClaimCertificatesTotal, postedVoucherTotal, expenseRows: scopedExpenses, payrollRows: scopedPayroll, salesRows: scopedSales, collectionRows: scopedCollections };
    }),
    dataQuality: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const [projectRows, stageRows, vendorRows, employeeRows, expenseRows, certificateRows, payrollRows, salesRows, costItemRows] = await Promise.all([db.select().from(projects), db.select().from(stages), db.select().from(vendors), db.select().from(employees), db.select().from(expenses), db.select().from(certificates), db.select().from(payroll), db.select().from(sales), db.select().from(costItems)]);
      const activeCompanyId = await resolveActiveCompanyId(db, ctx);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const visibleProjects = projectRows.filter((row) => (!activeCompanyId || row.companyId === activeCompanyId) && (!allowed || allowed.has(row.id)));
      const visibleProjectIds = new Set(visibleProjects.map((row) => row.id));
      const issues: Array<{ id: string; entityType: string; entityId: number; title: string; detail: string; severity: "critical" | "warning" | "info"; action: string }> = [];
      const visible = (projectId: number | null) => projectId === null || visibleProjectIds.has(projectId);
      visibleProjects.forEach((project) => {
        if (!project.plannedStart || !project.plannedEnd) issues.push({ id: `project-dates-${project.id}`, entityType: "project", entityId: project.id, title: "تواريخ المشروع غير مكتملة", detail: `${project.name} يحتاج تاريخ بداية ونهاية مخططين.`, severity: "warning", action: "استكمال بيانات المشروع" });
        if (project.status === "active" && !stageRows.some((stage) => stage.projectId === project.id)) issues.push({ id: `project-stages-${project.id}`, entityType: "project", entityId: project.id, title: "مشروع نشط بلا مراحل", detail: `${project.name} نشط لكن لا توجد مراحل مرتبطة به.`, severity: "critical", action: "إضافة مرحلة للمشروع" });
      });
      stageRows.filter((stage) => visibleProjectIds.has(stage.projectId)).forEach((stage) => {
        if (!stage.plannedStart || !stage.plannedEnd) issues.push({ id: `stage-dates-${stage.id}`, entityType: "stage", entityId: stage.id, title: "مرحلة بلا برنامج زمني", detail: `المرحلة ${stage.name} تحتاج بداية ونهاية مخططتين.`, severity: "warning", action: "تحديث البرنامج الزمني" });
        if (Number(stage.plannedBudget) <= 0) issues.push({ id: `stage-budget-${stage.id}`, entityType: "stage", entityId: stage.id, title: "مرحلة بلا ميزانية", detail: `المرحلة ${stage.name} لا تحتوي ميزانية مخططة موجبة.`, severity: "warning", action: "تسجيل ميزانية المرحلة" });
      });
      vendorRows.filter((vendor) => !vendor.projectId || visibleProjectIds.has(vendor.projectId)).forEach((vendor) => {
        if (!vendor.taxNumber && !vendor.commercialRegistration) issues.push({ id: `vendor-id-${vendor.id}`, entityType: "vendor", entityId: vendor.id, title: "بيانات المورد النظامية ناقصة", detail: `${vendor.name} بلا رقم ضريبي أو سجل تجاري.`, severity: "warning", action: "استكمال بطاقة المورد" });
      });
      employeeRows.filter((employee) => employee.status === "active").forEach((employee) => {
        if (Number(employee.basicSalary) <= 0) issues.push({ id: `employee-salary-${employee.id}`, entityType: "employee", entityId: employee.id, title: "راتب أساسي غير مسجل", detail: `${employee.fullName} موظف نشط بلا راتب أساسي موجب.`, severity: "critical", action: "استكمال ملف الموظف" });
      });
      expenseRows.filter((expense) => visible(expense.projectId)).forEach((expense) => {
        const total = Number(expense.totalAmount || 0);
        const paid = Number(expense.paidAmount || 0);
        if (total <= 0) issues.push({ id: `expense-total-${expense.id}`, entityType: "expense", entityId: expense.id, title: "مصروف بإجمالي غير صالح", detail: `${expense.description} مسجل بإجمالي ${total.toFixed(2)}؛ راجع قبل الاعتماد.`, severity: "critical", action: "مراجعة المصروف" });
        else if (paid > total + 0.01) issues.push({ id: `expense-paid-${expense.id}`, entityType: "expense", entityId: expense.id, title: "مدفوع المصروف يتجاوز الإجمالي", detail: `${expense.description} مدفوع ${paid.toFixed(2)} مقابل إجمالي ${total.toFixed(2)}.`, severity: "critical", action: "تصحيح المصروف" });
        if (expense.classification === "project" && !expense.projectId) issues.push({ id: `expense-project-${expense.id}`, entityType: "expense", entityId: expense.id, title: "مصروف مشروع بلا مشروع", detail: `${expense.description} مصنف كمصروف مشروع دون تحديد مشروع محمل عليه.`, severity: "warning", action: "تحديد المشروع" });
        if (["approved", "posted"].includes(expense.status) && expense.classification === "project" && !expense.costItemId) issues.push({ id: `expense-cost-item-${expense.id}`, entityType: "expense", entityId: expense.id, title: "مصروف مشروع بلا بند تكلفة", detail: `${expense.description} معتمد دون بطاقة تكلفة؛ لن يظهر تفصيله بشكل صحيح في تقارير البنود.`, severity: "warning", action: "تحديد بند التكلفة" });
        if (expense.stageId && (!expense.projectId || !stageRows.some((stage) => stage.id === expense.stageId && stage.projectId === expense.projectId))) issues.push({ id: `expense-stage-${expense.id}`, entityType: "expense", entityId: expense.id, title: "مرحلة المصروف غير متطابقة", detail: `${expense.description} مرتبط بمرحلة لا تتبع المشروع المحدد.`, severity: "critical", action: "تصحيح المرحلة" });
      });
      certificateRows.filter((certificate) => visible(certificate.projectId) && Boolean(certificate.vendorId || certificate.contractId) && certificate.status !== "rejected").forEach((certificate) => {
        const total = Number(certificate.totalAmount || 0);
        const paid = Number(certificate.paidAmount || 0);
        if (total <= 0) issues.push({ id: `certificate-total-${certificate.id}`, entityType: "certificate", entityId: certificate.id, title: "مستخلص بإجمالي غير صالح", detail: `المستخلص ${certificate.certificateNumber} لا يحتوي إجماليًا موجبًا.`, severity: "critical", action: "مراجعة المستخلص" });
        else if (paid > total + 0.01) issues.push({ id: `certificate-paid-${certificate.id}`, entityType: "certificate", entityId: certificate.id, title: "مدفوع المستخلص يتجاوز الإجمالي", detail: `المستخلص ${certificate.certificateNumber} مدفوع ${paid.toFixed(2)} مقابل إجمالي ${total.toFixed(2)}.`, severity: "critical", action: "تصحيح المستخلص" });
        if (!certificate.contractId) issues.push({ id: `certificate-contract-${certificate.id}`, entityType: "certificate", entityId: certificate.id, title: "مستخلص بلا عقد مقاول", detail: `المستخلص ${certificate.certificateNumber} غير مربوط بعقد؛ لا يمكن تتبع رصيد العقد بدقة.`, severity: "warning", action: "ربط المستخلص بعقد" });
      });
      payrollRows.filter((row) => visible(row.projectId)).forEach((row) => {
        if (row.classification === "project" && !row.projectId) issues.push({ id: `payroll-project-${row.id}`, entityType: "payroll", entityId: row.id, title: "راتب مشروع بلا مشروع", detail: `مسير ${row.month}/${row.year} مصنف كمشروع دون تحديد المشروع.`, severity: "warning", action: "تحديد مشروع الراتب" });
        if (row.stageId && (!row.projectId || !stageRows.some((stage) => stage.id === row.stageId && stage.projectId === row.projectId))) issues.push({ id: `payroll-stage-${row.id}`, entityType: "payroll", entityId: row.id, title: "مرحلة الراتب غير متطابقة", detail: `مسير ${row.month}/${row.year} مرتبط بمرحلة لا تتبع المشروع المحدد.`, severity: "critical", action: "تصحيح مرحلة الراتب" });
      });
      const activeCostItemIds = new Set(costItemRows.filter((item) => item.isActive).map((item) => item.id));
      expenseRows.filter((expense) => expense.costItemId && !activeCostItemIds.has(expense.costItemId) && visible(expense.projectId)).forEach((expense) => issues.push({ id: `expense-cost-item-inactive-${expense.id}`, entityType: "expense", entityId: expense.id, title: "بند تكلفة غير متاح", detail: `${expense.description} مرتبط ببطاقة تكلفة غير نشطة أو غير موجودة.`, severity: "warning", action: "تحديث بطاقة التكلفة" }));
      salesRows.filter((sale) => visible(sale.projectId) && sale.status !== "cancelled").forEach((sale) => {
        const expectedTotal = Number(sale.preTaxAmount || 0) + Number(sale.taxAmount || 0);
        const total = Number(sale.totalAmount || 0);
        const recognized = Number(sale.recognizedRevenue || 0);
        if (Math.abs(expectedTotal - total) > 0.01) issues.push({ id: `sale-total-${sale.id}`, entityType: "sale", entityId: sale.id, title: "إجمالي البيع غير متسق", detail: `البيع رقم ${sale.id} لا يساوي قبل الضريبة مضافًا إليه الضريبة.`, severity: "critical", action: "مراجعة فاتورة البيع" });
        if (recognized > total + 0.01) issues.push({ id: `sale-revenue-${sale.id}`, entityType: "sale", entityId: sale.id, title: "الإيراد المعترف به يتجاوز البيع", detail: `البيع رقم ${sale.id} يحمل إيرادًا معترفًا به أكبر من إجمالي البيع.`, severity: "critical", action: "تصحيح الإيراد" });
      });
      const score = Math.max(0, 100 - issues.reduce((total, issue) => total + (issue.severity === "critical" ? 12 : issue.severity === "warning" ? 6 : 2), 0));
      return { score, issues, totals: { critical: issues.filter((issue) => issue.severity === "critical").length, warning: issues.filter((issue) => issue.severity === "warning").length, info: issues.filter((issue) => issue.severity === "info").length } };
    }),
  }),
  inventory: router({
    items: router({
      list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        const rows = await db.select().from(inventoryItems);
        return rows.filter((item) => (!input?.projectId || item.projectId === input.projectId || item.projectId === null) && (!allowed || item.projectId === null || allowed.has(item.projectId)) && item.isActive === 1);
      }),
      create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().nullable().optional(), parentItemId: z.number().int().positive().nullable().optional(), defaultCostItemId: z.number().int().positive().nullable().optional(), code: z.string().trim().min(1).max(64), name: z.string().trim().min(1).max(255), category: z.string().trim().min(1).max(128).default("materials"), unit: z.string().trim().min(1).max(64), minimumStock: z.number().nonnegative().default(0) })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertOperationPermission(db, ctx, "inventory_item");
        if (input.projectId) await assertProjectWrite(db, ctx, input.projectId);
        const duplicate = await db.select({ id: inventoryItems.id }).from(inventoryItems).where(eq(inventoryItems.code, input.code)).limit(1);
        if (duplicate.length) throw new TRPCError({ code: "CONFLICT", message: "كود بطاقة الخامة مستخدم بالفعل" });
        if (input.parentItemId) {
          const parent = (await db.select().from(inventoryItems).where(eq(inventoryItems.id, input.parentItemId)).limit(1))[0];
          if (!parent || !parent.isActive || (input.projectId && parent.projectId && parent.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر خامة رئيسية متاحة للمشروع" });
        }
        if (input.defaultCostItemId) {
          const linkedCost = (await db.select().from(costItems).where(eq(costItems.id, input.defaultCostItemId)).limit(1))[0];
          if (!linkedCost || !linkedCost.isActive || (input.projectId && linkedCost.projectId && linkedCost.projectId !== input.projectId)) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر بند تكلفة نشطًا ومتوافقًا مع المشروع" });
        }
        const result = await db.insert(inventoryItems).values({ projectId: input.projectId ?? null, parentItemId: input.parentItemId ?? null, defaultCostItemId: input.defaultCostItemId ?? null, code: input.code, name: input.name, category: input.category, unit: input.unit, minimumStock: input.minimumStock.toFixed(3), createdBy: ctx.user.id });
        const id = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "inventoryItem", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id };
      }),
    }),
    services: router({
      list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), entryType: z.enum(["equipment_rental", "labor_supply"]).optional() }).optional()).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        const [rows, projectsRows, stagesRows, vendorsRows, contractsRows] = await Promise.all([db.select().from(serviceContractEntries), db.select().from(projects), db.select().from(stages), db.select().from(vendors), db.select().from(contractorContracts)]);
        const projectMap = new Map(projectsRows.map((row) => [row.id, row]));
        const stageMap = new Map(stagesRows.map((row) => [row.id, row]));
        const vendorMap = new Map(vendorsRows.map((row) => [row.id, row]));
        const contractMap = new Map(contractsRows.map((row) => [row.id, row]));
        return rows.filter((row) => row.status !== "cancelled" && (!input?.projectId || row.projectId === input.projectId) && (!input?.entryType || row.entryType === input.entryType) && (!allowed || allowed.has(row.projectId))).map((row) => ({ ...row, project: projectMap.get(row.projectId) ?? null, stage: row.stageId ? stageMap.get(row.stageId) ?? null : null, vendor: vendorMap.get(row.vendorId) ?? null, contract: contractMap.get(row.contractId) ?? null }));
      }),
      create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().nullable().optional(), contractId: z.number().int().positive(), vendorId: z.number().int().positive(), entryType: z.enum(["equipment_rental", "labor_supply"]), serviceDate: z.string().min(1), periodStart: z.string().optional(), periodEnd: z.string().optional(), description: z.string().trim().min(1).max(4000), equipmentClass: z.string().trim().max(128).optional(), quantity: z.number().positive().default(1), rentalDays: z.number().positive().optional(), dailyRate: z.number().positive().optional(), workerCategory: z.string().trim().max(128).optional(), headcount: z.number().positive().optional(), workDays: z.number().positive().optional(), dailyWage: z.number().positive().optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
        await assertOperationPermission(db, ctx, "expense");
        const contract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, input.contractId)).limit(1))[0];
        if (!contract || contract.projectId !== input.projectId || contract.vendorId !== input.vendorId) throw new TRPCError({ code: "BAD_REQUEST", message: "العقد لا يتطابق مع المشروع أو المورد" });
        if (contract.contractType !== input.entryType) throw new TRPCError({ code: "BAD_REQUEST", message: "نوع السجل لا يتطابق مع نوع العقد" });
        if (input.stageId) { const stage = (await db.select({ id: stages.id }).from(stages).where(and(eq(stages.id, input.stageId), eq(stages.projectId, input.projectId))).limit(1))[0]; if (!stage) throw new TRPCError({ code: "BAD_REQUEST", message: "المرحلة لا تتبع المشروع المحدد" }); }
        const totalAmount = calculateServiceEntryTotal(input);
        if (totalAmount <= 0) throw new TRPCError({ code: "BAD_REQUEST", message: input.entryType === "equipment_rental" ? "أدخل العدد والأيام والأجرة اليومية للآلة" : "أدخل عدد العمال والأيام والأجر اليومي" });
        const prior = await db.select().from(serviceContractEntries).where(and(eq(serviceContractEntries.contractId, input.contractId), eq(serviceContractEntries.status, "posted")));
        const remaining = remainingServiceContractAmount(Number(contract.totalAmount || 0), prior.map((row) => Number(row.totalAmount || 0)));
        if (totalAmount > remaining + 0.01) throw new TRPCError({ code: "BAD_REQUEST", message: `القيمة تتجاوز المتبقي من العقد. المتبقي ${remaining.toFixed(2)} ر.س` });
        const result = await db.insert(serviceContractEntries).values({ projectId: input.projectId, stageId: input.stageId ?? null, contractId: input.contractId, vendorId: input.vendorId, entryType: input.entryType, serviceDate: new Date(input.serviceDate), periodStart: input.periodStart ? new Date(input.periodStart) : null, periodEnd: input.periodEnd ? new Date(input.periodEnd) : null, description: input.description, equipmentClass: input.entryType === "equipment_rental" ? input.equipmentClass || null : null, quantity: input.quantity.toFixed(3), rentalDays: Number(input.rentalDays || 0).toFixed(3), dailyRate: Number(input.dailyRate || 0).toFixed(2), workerCategory: input.entryType === "labor_supply" ? input.workerCategory || null : null, headcount: Number(input.headcount || 0).toFixed(3), workDays: Number(input.workDays || 0).toFixed(3), dailyWage: Number(input.dailyWage || 0).toFixed(2), totalAmount: totalAmount.toFixed(2), status: "pending_approval", createdBy: ctx.user.id });
        const id = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "serviceContractEntry", entityId: id, requestedBy: ctx.user.id, status: "pending", approvalStage: "mostafa", stageOrder: 1 });
        await db.insert(auditLogs).values({ entityType: "serviceContractEntry", entityId: id, action: "submitted_for_mostafa_approval", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, totalAmount }) });
        return { id, totalAmount, status: "pending_approval" as const, approvalStage: "mostafa" as const };
      }),
      decide: protectedProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const entry = (await db.select().from(serviceContractEntries).where(eq(serviceContractEntries.id, input.id)).limit(1))[0];
        if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "سجل الخدمة غير موجود" });
        const request = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "serviceContractEntry"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending"))).limit(1))[0];
        if (!request) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد موافقة معلقة لهذا السجل" });
        const approvalStage = request.approvalStage === "owner" ? "owner" : "mostafa";
        if (!canReviewInventoryStage(approvalStage, { id: Number(ctx.user.id), role: ctx.user.role })) throw new TRPCError({ code: "FORBIDDEN", message: approvalStage === "mostafa" ? "اعتماد المرحلة الأولى مخصص لمصطفى أو المالك" : "اعتماد المرحلة النهائية مخصص للمالك فقط" });
        await db.update(approvalRequests).set({ status: input.decision === "approved" ? "approved" : "rejected", reviewedBy: ctx.user.id, reviewedAt: new Date(), note: input.note || null }).where(eq(approvalRequests.id, request.id));
        if (input.decision === "rejected") { await db.update(serviceContractEntries).set({ status: "cancelled" }).where(eq(serviceContractEntries.id, input.id)); return { success: true, status: "cancelled" as const }; }
        if (approvalStage === "mostafa") { await db.insert(approvalRequests).values({ projectId: entry.projectId, entityType: "serviceContractEntry", entityId: entry.id, requestedBy: entry.createdBy || ctx.user.id, status: "pending", approvalStage: "owner", stageOrder: 2 }); return { success: true, status: "pending_approval" as const, approvalStage: "owner" as const }; }
        const expenseResult = await db.insert(expenses).values({ projectId: entry.projectId, stageId: entry.stageId, vendorId: entry.vendorId, reference: `SERVICE-${entry.id}`, description: `${entry.entryType === "equipment_rental" ? "إيجار آلة" : "توريد عمالة"}: ${entry.description}`, unit: entry.entryType === "equipment_rental" ? "يومية آلة" : "يوم عمل", quantity: (entry.entryType === "equipment_rental" ? Number(entry.quantity) * Number(entry.rentalDays) : Number(entry.headcount) * Number(entry.workDays)).toFixed(3), expenseType: entry.entryType, classification: "project", allocationRatio: "1", preTaxAmount: entry.totalAmount, taxRate: "0", taxAmount: "0", totalAmount: entry.totalAmount, paidAmount: "0", status: "posted", expenseDate: entry.serviceDate, createdBy: ctx.user.id });
        const expenseId = Number(expenseResult[0].insertId);
        await db.update(serviceContractEntries).set({ status: "posted", expenseId }).where(eq(serviceContractEntries.id, entry.id));
        await db.insert(auditLogs).values({ entityType: "serviceContractEntry", entityId: entry.id, action: "owner_approved_posted", actorId: ctx.user.id, afterJson: JSON.stringify({ expenseId, totalAmount: entry.totalAmount, note: input.note || null }) });
        return { success: true, status: "posted" as const, expenseId };
      }),
    }),
    movements: router({
      list: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), itemId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        const [movementRows, itemRows, vendorRows, projectRows, stageRows, documentRows, contractRows] = await Promise.all([db.select().from(inventoryMovements), db.select().from(inventoryItems), db.select().from(vendors), db.select().from(projects), db.select().from(stages), db.select().from(accountingDocuments), db.select().from(contractorContracts)]);
        const items = new Map(itemRows.map((item) => [item.id, item]));
        const vendorMap = new Map(vendorRows.map((vendor) => [vendor.id, vendor]));
        const projectMap = new Map(projectRows.map((project) => [project.id, project]));
        const stageMap = new Map(stageRows.map((stage) => [stage.id, stage]));
        const documentMap = new Map(documentRows.map((document) => [document.id, document]));
        const contractMap = new Map(contractRows.map((contract) => [contract.id, contract]));
        return movementRows.filter((row) => row.status !== "cancelled" && (!input?.projectId || row.projectId === input.projectId) && (!input?.itemId || row.itemId === input.itemId) && (!allowed || allowed.has(row.projectId))).map((row) => ({ ...row, item: items.get(row.itemId) ?? null, vendor: row.vendorId ? vendorMap.get(row.vendorId) ?? null : null, project: projectMap.get(row.projectId) ?? null, stage: row.stageId ? stageMap.get(row.stageId) ?? null : null, contract: row.contractId ? contractMap.get(row.contractId) ?? null : null, receiptDocument: row.sourceDocumentId ? documentMap.get(row.sourceDocumentId) ?? null : null, purchaseInvoice: row.purchaseInvoiceId ? documentMap.get(row.purchaseInvoiceId) ?? null : null }));
      }),
      summary: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional() }).optional()).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
        const [items, movements] = await Promise.all([db.select().from(inventoryItems), db.select().from(inventoryMovements)]);
        const visible = movements.filter((row) => row.status === "posted" && (!input?.projectId || row.projectId === input.projectId) && (!allowed || allowed.has(row.projectId)));
        const balances = new Map<number, { received: number; issued: number; quantity: number; value: number }>();
        for (const item of items) balances.set(item.id, calculateInventoryBalance(visible.filter((row) => row.itemId === item.id)));

        return items.filter((item) => item.isActive === 1 && (!item.projectId || !input?.projectId || item.projectId === input.projectId)).map((item) => ({ item, ...(balances.get(item.id) ?? { received: 0, issued: 0, quantity: 0, value: 0 }), lowStock: isInventoryBelowMinimum(balances.get(item.id)?.quantity, item.minimumStock) }));
      }),
      create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().nullable().optional(), itemId: z.number().int().positive(), vendorId: z.number().int().positive().nullable().optional(), movementType: z.enum(["receipt", "issue", "adjustment_in", "adjustment_out"]), quantity: z.number().positive(), unitCost: z.number().nonnegative().default(0), movementDate: z.string().optional(), reference: z.string().max(128).optional(), description: z.string().max(4000).optional(), contractId: z.number().int().positive().nullable().optional(), contractItemIndex: z.number().int().nonnegative().nullable().optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const isSiteWorkerMovement = ["site_worker", "procurement_manager"].includes(ctx.user.role) && ["receipt", "issue"].includes(input.movementType);
        if (!isSiteWorkerMovement) await assertProjectWrite(db, ctx, input.projectId);
        if (ctx.user.role === "site_worker" && !isSiteWorkerMovement) throw new TRPCError({ code: "FORBIDDEN", message: "موظف الموقع مسموح له فقط بتسجيل الاستلام أو السحب" });
        await assertOperationPermission(db, ctx, input.movementType === "receipt" || input.movementType === "adjustment_in" ? "inventory_receipt" : "inventory_issue");
        const operationalInput = isSiteWorkerMovement ? { ...input, stageId: null, vendorId: null, unitCost: 0, reference: undefined, contractId: null, contractItemIndex: null } : input;
        const item = (await db.select().from(inventoryItems).where(eq(inventoryItems.id, input.itemId)).limit(1))[0];
        if (!item || item.isActive !== 1) throw new TRPCError({ code: "NOT_FOUND", message: "بطاقة الخامة غير موجودة أو غير نشطة" });
        if (item.projectId && item.projectId !== input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "بطاقة الخامة لا تتبع المشروع المحدد" });
        if (input.stageId) { const stage = (await db.select({ id: stages.id }).from(stages).where(and(eq(stages.id, input.stageId), eq(stages.projectId, input.projectId))).limit(1))[0]; if (!stage) throw new TRPCError({ code: "BAD_REQUEST", message: "المرحلة لا تتبع المشروع المحدد" }); }
        if (input.vendorId) { const vendor = (await db.select({ id: vendors.id }).from(vendors).where(eq(vendors.id, input.vendorId)).limit(1))[0]; if (!vendor) throw new TRPCError({ code: "NOT_FOUND", message: "المورد غير موجود" }); }
        let linkedContract: typeof contractorContracts.$inferSelect | undefined;
        let linkedContractCostItemId: number | null = null;
        if (input.contractId) {
          linkedContract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, input.contractId)).limit(1))[0];
          if (!linkedContract || linkedContract.projectId !== input.projectId || linkedContract.vendorId !== input.vendorId) throw new TRPCError({ code: "BAD_REQUEST", message: "العقد لا يتطابق مع المشروع أو المورد المحدد" });
          if (!["supply", "supply_installation"].includes(linkedContract.contractType) || input.movementType !== "receipt") throw new TRPCError({ code: "BAD_REQUEST", message: "ربط العقد بحركة المخزون متاح لعقود التوريد أو التوريد والتركيب عند الاستلام فقط" });
          if (input.contractItemIndex === null || input.contractItemIndex === undefined) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر بند العقد المرتبط بالاستلام" });
          const contractItem = (linkedContract.contractItems ?? [])[input.contractItemIndex];
          if (!contractItem) throw new TRPCError({ code: "BAD_REQUEST", message: "بند العقد غير موجود" });
          if (!contractItem.inventoryItemId || Number(contractItem.inventoryItemId) !== input.itemId) throw new TRPCError({ code: "BAD_REQUEST", message: "بطاقة الخامة لا تطابق بند عقد التوريد المختار" });
          if (!contractItem.costItemId) throw new TRPCError({ code: "BAD_REQUEST", message: "بند العقد المختار غير مربوط ببند تكلفة؛ عدّل العقد أولًا" });
          linkedContractCostItemId = Number(contractItem.costItemId);
          const priorRows = await db.select().from(inventoryMovements).where(and(eq(inventoryMovements.contractId, input.contractId), eq(inventoryMovements.contractItemIndex, input.contractItemIndex)));
          const receivedBefore = priorRows.filter((row) => row.status !== "cancelled").reduce((sum, row) => sum + Number(row.quantity || 0), 0);
          if (!canReceiveContractQuantity({ contractedQty: contractItem.contractedQty, receivedQty: receivedBefore }, input.quantity)) throw new TRPCError({ code: "BAD_REQUEST", message: `الكمية تتجاوز المتبقي من بند العقد. المتبقي ${remainingContractQuantity({ contractedQty: contractItem.contractedQty, receivedQty: receivedBefore }).toFixed(3)} ${contractItem.unit}` });
        }
        const incoming = input.movementType === "receipt" || input.movementType === "adjustment_in";
        if (input.movementType === "receipt" && !isSiteWorkerMovement && !operationalInput.vendorId) throw new TRPCError({ code: "BAD_REQUEST", message: "اختر المورد لإنشاء سند الاستلام وفاتورة الشراء تلقائيًا" });
        const existing = await db.select().from(inventoryMovements).where(and(eq(inventoryMovements.projectId, input.projectId), eq(inventoryMovements.itemId, input.itemId), eq(inventoryMovements.status, "posted")));
        const balance = existing.reduce((total, row) => total + ((row.movementType === "receipt" || row.movementType === "adjustment_in" ? 1 : -1) * Number(row.quantity || 0)), 0);
        if (!incoming && input.quantity > balance + 0.0005) throw new TRPCError({ code: "BAD_REQUEST", message: `الرصيد المتاح لا يكفي. الرصيد الحالي ${balance.toFixed(3)} ${item.unit}` });
        const totalAmount = operationalInput.quantity * operationalInput.unitCost;
        let linkedPurchaseInvoiceId: number | null = null;
        let linkedReference = input.reference || null;
        if (!incoming) {
          const sourceReceipts = await db.select({ purchaseInvoiceId: inventoryMovements.purchaseInvoiceId, reference: inventoryMovements.reference }).from(inventoryMovements).where(and(eq(inventoryMovements.projectId, input.projectId), eq(inventoryMovements.itemId, input.itemId), eq(inventoryMovements.movementType, "receipt"), eq(inventoryMovements.status, "posted")));
          linkedPurchaseInvoiceId = selectPurchaseInvoiceForIssue(sourceReceipts);
          if (linkedPurchaseInvoiceId) linkedReference = `فاتورة شراء #${linkedPurchaseInvoiceId}`;
        }
        const result = await db.insert(inventoryMovements).values({ projectId: operationalInput.projectId, stageId: operationalInput.stageId ?? null, costItemId: linkedContractCostItemId, itemId: operationalInput.itemId, vendorId: operationalInput.vendorId ?? null, movementType: operationalInput.movementType, quantity: operationalInput.quantity.toFixed(3), unitCost: operationalInput.unitCost.toFixed(4), totalAmount: totalAmount.toFixed(2), movementDate: operationalInput.movementDate ? new Date(operationalInput.movementDate) : new Date(), reference: linkedReference, description: operationalInput.description || null, sourceDocumentId: linkedPurchaseInvoiceId, purchaseInvoiceId: linkedPurchaseInvoiceId, contractId: operationalInput.contractId ?? null, contractItemIndex: operationalInput.contractItemIndex ?? null, status: "pending_approval", createdBy: ctx.user.id });
        const id = Number(result[0].insertId);
        let autoDocuments: { receiptId: number; receiptNumber: string; purchaseInvoiceId: number; invoiceNumber: string } | null = null;
        if (incoming && input.movementType === "receipt" && !isSiteWorkerMovement) {
          autoDocuments = await createInventoryPurchaseDocuments(db, ctx, { movementId: id, projectId: input.projectId, stageId: input.stageId ?? null, itemId: input.itemId, vendorId: input.vendorId ?? null, quantity: input.quantity, unitCost: input.unitCost, movementDate: input.movementDate, description: input.description || null, contractId: input.contractId ?? null, contractItemIndex: input.contractItemIndex ?? null });
        }
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "inventoryMovement", entityId: id, requestedBy: ctx.user.id, status: "pending", approvalStage: "mostafa", stageOrder: 1 });
        await db.insert(auditLogs).values({ entityType: "inventoryMovement", entityId: id, action: "submitted_for_mostafa_approval", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, totalAmount, status: "pending_approval", autoDocuments, purchaseInvoiceId: linkedPurchaseInvoiceId }) });
        await notifyApprovalUsers(db, { type: "inventory_movement_pending", title: `حركة خامات جديدة #${id}`, message: `حركة ${input.movementType === "receipt" ? "استلام" : "صرف"} لخامة #${input.itemId} بكمية ${input.quantity} لمشروع #${input.projectId} تحتاج اعتماد مصطفى أولًا.`, userIds: [13170001], roles: [] });
        return { id, status: "pending_approval" as const, approvalStage: "mostafa" as const, balanceAfter: balance + (incoming ? input.quantity : -input.quantity), autoDocuments, purchaseInvoiceId: linkedPurchaseInvoiceId };
      }),
      decide: protectedProcedure.input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(1000).optional(), costItemId: z.number().int().positive().nullable().optional() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const movement = (await db.select().from(inventoryMovements).where(eq(inventoryMovements.id, input.id)).limit(1))[0];
        if (!movement) throw new TRPCError({ code: "NOT_FOUND", message: "حركة المخزون غير موجودة" });
        const request = (await db.select().from(approvalRequests).where(and(eq(approvalRequests.entityType, "inventoryMovement"), eq(approvalRequests.entityId, input.id), eq(approvalRequests.status, "pending"))).limit(1))[0];
        if (!request) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد مرحلة اعتماد معلقة لهذه الحركة" });
        const approvalStage = request.approvalStage === "owner" ? "owner" : "mostafa";
        if (!canReviewInventoryStage(approvalStage, { id: Number(ctx.user.id), role: ctx.user.role })) throw new TRPCError({ code: "FORBIDDEN", message: approvalStage === "mostafa" ? "اعتماد المرحلة الأولى مخصص لمصطفى أو المالك" : "الاعتماد النهائي وتحديد بند التكلفة مخصص للمالك فقط" });
        if (input.decision === "rejected") {
          await db.update(approvalRequests).set({ status: "rejected", reviewedBy: ctx.user.id, note: input.note || null, reviewedAt: new Date() }).where(eq(approvalRequests.id, request.id));
          await db.update(inventoryMovements).set({ status: "cancelled" }).where(eq(inventoryMovements.id, input.id));
          await db.insert(auditLogs).values({ entityType: "inventoryMovement", entityId: input.id, action: "rejected", actorId: ctx.user.id, afterJson: JSON.stringify({ stage: request.approvalStage, note: input.note || null }) });
          return { success: true, status: "cancelled" as const };
        }
        await db.update(approvalRequests).set({ status: "approved", reviewedBy: ctx.user.id, note: input.note || null, reviewedAt: new Date() }).where(eq(approvalRequests.id, request.id));
        if (nextInventoryApprovalStage(approvalStage, "approved") === "owner") {
          await db.insert(approvalRequests).values({ projectId: movement.projectId, entityType: "inventoryMovement", entityId: input.id, requestedBy: movement.createdBy || ctx.user.id, status: "pending", approvalStage: "owner", stageOrder: 2 });
          await db.insert(auditLogs).values({ entityType: "inventoryMovement", entityId: input.id, action: "mostafa_approved_owner_pending", actorId: ctx.user.id, afterJson: JSON.stringify({ note: input.note || null }) });
          await notifyApprovalUsers(db, { type: "inventory_movement_owner_pending", title: `حركة خامات بانتظار اعتمادك #${input.id}`, message: `اعتمد مصطفى حركة الخامات #${input.id} وأصبحت بانتظار اعتمادك النهائي وتحديد بند التكلفة.`, roles: ["admin"] });
          return { success: true, status: "pending_approval" as const, approvalStage: "owner" as const };
        }
        if (input.costItemId) {
          const costItem = (await db.select({ id: costItems.id }).from(costItems).where(and(eq(costItems.id, input.costItemId), eq(costItems.isActive, 1))).limit(1))[0];
          if (!costItem) throw new TRPCError({ code: "BAD_REQUEST", message: "بند التكلفة غير موجود أو غير نشط" });
        }
        let approvedCostItemId = input.costItemId ?? movement.costItemId ?? null;
        if (movement.contractId !== null && movement.contractId !== undefined && movement.contractItemIndex !== null && movement.contractItemIndex !== undefined) {
          const contract = (await db.select().from(contractorContracts).where(eq(contractorContracts.id, movement.contractId)).limit(1))[0];
          const contractLine = contract?.contractItems?.[movement.contractItemIndex];
          if (!contractLine?.costItemId) throw new TRPCError({ code: "BAD_REQUEST", message: "بند العقد المرتبط بالحركة لا يحمل بند تكلفة" });
          if (input.costItemId && Number(input.costItemId) !== Number(contractLine.costItemId)) throw new TRPCError({ code: "BAD_REQUEST", message: "لا يمكن تغيير بند تكلفة حركة مرتبطة بعقد توريد؛ استخدم بند التكلفة المحدد في العقد" });
          approvedCostItemId = Number(contractLine.costItemId);
        }
        await db.update(inventoryMovements).set({ status: "posted", costItemId: approvedCostItemId }).where(eq(inventoryMovements.id, input.id));
        const postedMovement = { ...movement, costItemId: approvedCostItemId };
        await postInventoryLinkedDocuments(db, postedMovement);
        await db.insert(auditLogs).values({ entityType: "inventoryMovement", entityId: input.id, action: "owner_approved_posted", actorId: ctx.user.id, afterJson: JSON.stringify({ note: input.note || null, sourceDocumentId: movement.sourceDocumentId ?? null, purchaseInvoiceId: movement.purchaseInvoiceId ?? null, costItemId: approvedCostItemId }) });
        await notifyApprovalUsers(db, { type: "inventory_movement_posted", title: `تم ترحيل حركة الخامات #${input.id}`, message: `تم اعتماد وترحيل حركة الخامات #${input.id} إلى السجلات المرتبطة.`, userIds: [movement.createdBy || 0, 13170001], roles: [] });
        return { success: true, status: "posted" as const, approvalStage: "complete" as const };
      }),
    }),
  }),
});
