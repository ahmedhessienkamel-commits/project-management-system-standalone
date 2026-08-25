import { beforeEach, describe, expect, it, vi } from "vitest";
import { projects, stages, expenses, collections, approvalRequests, attachments, sales, payroll, vendors, certificates, projectMembers, units, periodLocks, notifications, auditLogs, attendance, approvalPolicies, custodyMovements, materialRequisitions, materialRequisitionItems, purchaseOrders, purchaseOrderItems, purchaseReceipts, purchaseReceiptItems, advanceRequests, advanceRepayments, leaveRequests, employees, users, costItems } from "../drizzle/schema";

const state = {
  projects: [] as any[],
  stages: [] as any[],
  expenses: [] as any[],
  collections: [] as any[],
  approvalRequests: [] as any[],
  attachments: [] as any[],
  sales: [] as any[],
  payroll: [] as any[],
  vendors: [] as any[],
  certificates: [] as any[],
  projectMembers: [] as any[],
  units: [] as any[],
  periodLocks: [] as any[],
  notifications: [] as any[],
  auditLogs: [] as any[],
  attendance: [] as any[],
  approvalPolicies: [] as any[],
  custodyMovements: [] as any[],
  materialRequisitions: [] as any[],
  materialRequisitionItems: [] as any[],
  purchaseOrders: [] as any[],
  purchaseOrderItems: [] as any[],
  purchaseReceipts: [] as any[],
  purchaseReceiptItems: [] as any[],
  advanceRequests: [] as any[],
  advanceRepayments: [] as any[],
  leaveRequests: [] as any[],
  employees: [] as any[],
  users: [] as any[],
  costItems: [] as any[],
};

const tableState = new Map<any, keyof typeof state>([
  [projects, "projects"], [stages, "stages"], [expenses, "expenses"], [collections, "collections"], [approvalRequests, "approvalRequests"], [attachments, "attachments"], [sales, "sales"], [payroll, "payroll"], [vendors, "vendors"], [certificates, "certificates"], [projectMembers, "projectMembers"], [units, "units"], [periodLocks, "periodLocks"], [notifications, "notifications"], [auditLogs, "auditLogs"], [attendance, "attendance"], [approvalPolicies, "approvalPolicies"], [custodyMovements, "custodyMovements"], [materialRequisitions, "materialRequisitions"], [materialRequisitionItems, "materialRequisitionItems"], [purchaseOrders, "purchaseOrders"], [purchaseOrderItems, "purchaseOrderItems"], [purchaseReceipts, "purchaseReceipts"], [purchaseReceiptItems, "purchaseReceiptItems"], [advanceRequests, "advanceRequests"], [advanceRepayments, "advanceRepayments"], [leaveRequests, "leaveRequests"], [employees, "employees"], [users, "users"], [costItems, "costItems"],
]);

function rowsFor(table: any) {
  return state[tableState.get(table)!] ?? [];
}

function fakeDb() {
  let id = 100;
  return {
    select: () => ({
      from: (table: any) => {
        const rows = rowsFor(table);
        const query: any = Promise.resolve(rows);
        query.where = () => query;
        query.limit = (count: number) => Promise.resolve(rows.slice(0, count));
        query.orderBy = () => query;
        return query;
      },
    }),
    insert: (table: any) => ({
      values: (value: any) => {
        const rows = rowsFor(table);
        const next = { ...value, id: ++id, createdAt: new Date(), updatedAt: new Date() };
        rows.push(next);
        return Promise.resolve([{ insertId: next.id }]);
      },
    }),
    update: (table: any) => ({
      set: (changes: any) => ({
        where: async () => {
          const rows = rowsFor(table);
          if (rows[0]) Object.assign(rows[0], changes);
          return [];
        },
      }),
    }),
  };
}

vi.mock("./db", () => ({ getDb: vi.fn(async () => fakeDb()) }));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(userId = 1, role: "admin" | "user" = "user"): TrpcContext {
  return {
    user: { id: userId, openId: `integration-user-${userId}`, email: `integration-${userId}@example.com`, name: "Integration User", loginMethod: "password", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("ERP sales and collections API flow", () => {
  beforeEach(() => {
    for (const key of Object.keys(state) as Array<keyof typeof state>) state[key].splice(0);
    state.projects.push({ id: 1, code: "WN-001", name: "وادي نمار", classification: "operational", status: "active", location: "الرياض", createdAt: new Date(), updatedAt: new Date() });
    state.projectMembers.push({ id: 1, projectId: 1, userId: 1, projectRole: "finance", createdAt: new Date() });
    state.stages.push({ id: 2, projectId: 1, code: "EXC", name: "الحفر", status: "active", plannedBudget: "100000", createdAt: new Date() });
    state.units.push({ id: 10, projectId: 1, unitCode: "A-101", status: "available", createdAt: new Date(), updatedAt: new Date() });
    state.users.push({ id: 1, name: "مدير الحسابات", email: "owner@example.com" }, { id: 13170001, name: "مصطفى", email: "mostafa@example.com" });
    state.employees.push({ id: 9, employeeCode: "EMP-009", fullName: "أحمد العامل", employmentType: "employee", status: "active" });
    state.costItems.push({ id: 12, code: "ADM-01", name: "مصروفات إدارية عامة", category: "administrative", isActive: 1 });
  });

  it("creates a confirmed unit sale, received collection, and dashboard summary from the same state", async () => {
    const caller = appRouter.createCaller(context());
    const memberships = await caller.erp.members.mine();
    expect(memberships).toEqual(expect.arrayContaining([expect.objectContaining({ projectId: 1, userId: 1, projectRole: "finance" })]));
    await caller.erp.attendance.create({ projectId: 1, employeeCode: "EMP-001", employeeName: "أحمد", attendanceDate: "2026-08-05", checkIn: "08:00", checkOut: "17:00", status: "present", notes: "" });
    await caller.erp.attendance.create({ projectId: 1, employeeCode: "EMP-001", employeeName: "أحمد", attendanceDate: "2026-08-06", checkIn: "08:10", checkOut: "17:00", status: "late", notes: "" });
    const attendanceSummary = await caller.erp.payroll.attendanceSummary({ projectId: 1, month: 8, year: 2026 });
    expect(attendanceSummary).toEqual({ total: 2, present: 1, absent: 0, late: 1, leave: 0 });
    const vendor = await caller.erp.vendors.create({ name: "مورد عام", taxNumber: "TAX-001", commercialRegistration: "CR-001" });
    const vendorTrace = await caller.erp.controls.trace({ entityType: "vendor", entityId: vendor.id });
    expect(vendorTrace.audits.length).toBeGreaterThan(0);
    const certificate = await caller.erp.certificates.create({ projectId: 1, stageId: 2, vendorId: vendor.id, certificateNumber: "CERT-001", description: "مستخلص اختبار", preTaxAmount: 5000, taxRate: 15, paidAmount: 1000 });
    const certificateTrace = await caller.erp.controls.trace({ projectId: 1, entityType: "certificate", entityId: certificate.id });
    expect(certificateTrace.audits.length).toBeGreaterThan(0);
    const custody = await caller.erp.custody.create({ projectId: 1, stageId: 2, holderName: "أحمد", issuedAmount: 2000, settledAmount: 500 });
    const custodyTrace = await caller.erp.controls.trace({ projectId: 1, entityType: "custody", entityId: custody.id });
    expect(custodyTrace.audits.length).toBeGreaterThan(0);
    const attachment = await caller.erp.attachments.create({ projectId: 1, entityType: "certificate", entityId: certificate.id, documentType: "مطالبة", fileName: "claim.pdf", fileUrl: "https://example.com/claim.pdf" });
    const attachmentTrace = await caller.erp.controls.trace({ projectId: 1, entityType: "attachment", entityId: attachment.id });
    expect(attachmentTrace.audits.length).toBeGreaterThan(0);
    const sale = await caller.erp.sales.create({ projectId: 1, unitId: 10, stageId: 2, customerName: "عميل الاختبار", preTaxAmount: 250000, taxRate: 15 });
    const saleTrace = await caller.erp.controls.trace({ projectId: 1, entityType: "sale", entityId: sale.id });
    expect(saleTrace.audits.length).toBeGreaterThan(0);
    const collection = await caller.erp.collections.create({ projectId: 1, saleId: sale.id, amount: 75000, receiptReference: "RC-001" });
    const collectionTrace = await caller.erp.controls.trace({ projectId: 1, entityType: "collection", entityId: collection.id });
    expect(collectionTrace.audits.length).toBeGreaterThan(0);
    await caller.erp.payroll.create({ projectId: 1, stageId: 2, employeeName: "أحمد", employeeCode: "EMP-001", month: 8, year: 2026, classification: "project", amount: 12000, paidAmount: 0 });
    await caller.erp.payroll.create({ projectId: 1, employeeName: "سارة", employeeCode: "EMP-002", month: 8, year: 2026, classification: "administrative", amount: 8000, paidAmount: 0 });
    const projectExpense = await caller.erp.expenses.create({ projectId: 1, stageId: 2, description: "حديد", unit: "طن", quantity: 2, expenseType: "materials", classification: "project", preTaxAmount: 1000, taxRate: 15, paidAmount: 500 });
    await caller.erp.expenses.create({ projectId: 1, description: "إدارة", unit: "شهر", quantity: 1, expenseType: "administrative", classification: "administrative", preTaxAmount: 300, taxRate: 15, paidAmount: 300 });
    const trace = await caller.erp.controls.trace({ projectId: 1, entityType: "expense", entityId: projectExpense.id });
    expect(trace.approval).not.toBeNull();
    expect(trace.audits.length).toBeGreaterThan(0);
    state.payroll.forEach((row) => { row.status = "approved"; });
    state.expenses.forEach((row) => { row.status = "approved"; });
    const summary = await caller.erp.dashboard.summary();
    const quality = await caller.erp.reports.dataQuality();
    const report = await caller.erp.reports.financialSummary({ projectId: 1 });
    expect(sale.recognizedRevenue).toBe(250000);
    expect(state.sales[0]).toMatchObject({ projectId: 1, unitId: 10, stageId: 2, status: "confirmed", recognizedRevenue: "250000.00" });
    expect(state.collections[0]).toMatchObject({ projectId: 1, saleId: sale.id, status: "received", amount: "75000.00" });
    expect(state.payroll).toHaveLength(2);
    expect(state.payroll.find((row) => row.employeeCode === "EMP-001")).toMatchObject({ employeeName: "أحمد", classification: "project", taxAmount: "0.00" });
    expect(state.payroll.find((row) => row.employeeCode === "EMP-002")).toMatchObject({ employeeName: "سارة", classification: "administrative", taxAmount: "0.00" });
    expect(summary[0]).toMatchObject({ recognizedRevenue: 250000, collectionsReceived: 75000, actualCost: 19245, subcontractorCostsTotal: 5750, payrollOutstanding: 12000 });
    expect(summary[0].missingDocumentCount).toBeGreaterThanOrEqual(2);
    expect(quality.score).toBeGreaterThanOrEqual(0);
    expect(quality.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(quality.issues)).toBe(true);
    expect(report).toMatchObject({ revenue: 250000, collectionsReceived: 75000, expensesPreTax: 1000, payrollTotal: 12000, payrollOutstanding: 12000 });
    const cashFlow = await caller.erp.reports.cashFlow({ projectId: 1 });
    expect(cashFlow.stages.find((row) => row.stageId === 2)).toMatchObject({ stageName: "الحفر", cashIn: 75000, cashOut: 1500, net: 73500, cumulativeGap: -73500, fundingRequired: 0, allocation: "stage-linked-sales-and-outflows" });
    expect(cashFlow.stages.find((row) => row.stageId === null)).toBeUndefined();
  });

  it("completes procurement from requisition to receipt, invoice, and partial payment", async () => {
    const admin = appRouter.createCaller(context(1, "admin"));
    const vendor = await admin.erp.vendors.create({ projectId: 1, name: "مورد مواد", taxNumber: "TAX-PO", commercialRegistration: "CR-PO" });
    const requisition = await admin.erp.procurement.requisitions.create({ projectId: 1, stageId: 2, description: "مواد خرسانة", items: [{ description: "حديد", unit: "طن", quantity: 2, estimatedUnitCost: 1000 }] });
    const mostafa = appRouter.createCaller(context(13170001, "user"));
    await mostafa.erp.procurement.requisitions.decide({ id: requisition.id, decision: "approved" });
    const mostafaVisibleRequests = await mostafa.erp.procurement.requisitions.list();
    const mostafaVisibleRequest = mostafaVisibleRequests.find((item) => item.id === requisition.id);
    expect(mostafaVisibleRequest).toMatchObject({ id: requisition.id, requestNumber: requisition.requestNumber, items: [expect.objectContaining({ description: "حديد" })] });
    expect(mostafaVisibleRequest?.items[0]?.costItemId).toBeUndefined();
    state.materialRequisitions[0].status = "approved";
    const order = await admin.erp.procurement.purchaseOrders.create({ requisitionId: requisition.id, vendorId: vendor.id, items: [{ description: "حديد", unit: "طن", quantity: 2, unitCost: 1000 }] });
    await admin.erp.procurement.purchaseOrders.decide({ id: order.id, decision: "approved" });
    const receipt = await admin.erp.procurement.purchaseOrders.receive({ purchaseOrderId: order.id, receivedDate: "2026-08-19", items: [{ purchaseOrderItemId: state.purchaseOrderItems[0].id, quantity: 2 }] });
    expect(receipt.receivedCost).toBe(2000);
    expect(state.expenses.find((row) => row.reference === receipt.receiptNumber)).toMatchObject({ projectId: 1, expenseType: "materials", totalAmount: "2000.00", status: "posted" });
    const invoice = await admin.erp.procurement.purchaseOrders.updateInvoice({ id: order.id, invoiceNumber: "INV-PO-001", invoicedAmount: 2000, paidAmount: 500 });
    expect(invoice.invoiceStatus).toBe("partially_paid");
    expect(state.purchaseOrders[0]).toMatchObject({ invoiceNumber: "INV-PO-001", invoicedAmount: "2000.00", paidAmount: "500.00", invoiceStatus: "partially_paid" });
  });

  it("records custody movements and returns a complete employee statement", async () => {
    const caller = appRouter.createCaller(context());
    await caller.erp.custodyMovements.create({ employeeCode: "EMP-001", employeeName: "أحمد", movementType: "issue", allocationType: "general_cash", description: "عهدة نثريات", amount: 500, movementDate: "2026-08-18" });
    const spend = await caller.erp.custodyMovements.create({ employeeCode: "EMP-001", employeeName: "أحمد", movementType: "spend", allocationType: "general_cash", description: "شراء مستلزمات", amount: 100, movementDate: "2026-08-19", expenseType: "نثريات" });
    const statement = await caller.erp.custodyMovements.statement({ employeeCode: "EMP-001" });
    expect(spend.linkedExpenseId).toBeTypeOf("number");
    expect(state.expenses.filter((row) => row.id === spend.linkedExpenseId)).toHaveLength(1);
    expect(state.expenses.find((row) => row.id === spend.linkedExpenseId)).toMatchObject({ totalAmount: "100.00", paidAmount: "100.00", status: "approved", classification: "petty_cash" });
    expect(statement).toHaveLength(2);
    expect(statement[0]).toMatchObject({ employeeCode: "EMP-001", movementType: "issue", allocationType: "general_cash", signedAmount: "500.00", balance: 500 });
    expect(statement[1]).toMatchObject({ movementType: "spend", description: "شراء مستلزمات", signedAmount: "-100.00", balance: 400 });
    expect(await caller.erp.custodyMovements.statement({ employeeCode: "EMP-001", allocationType: "general_admin" })).toHaveLength(0);
  });

  it("shows named employee leave and advance requests to Mostafa for review", async () => {
    state.leaveRequests.push({ id: 41, requestedBy: 1, employeeId: 9, leaveType: "emergency", startDate: new Date("2026-08-23"), endDate: new Date("2026-08-28"), days: "6.00", reason: "حالة طارئة", status: "pending", createdAt: new Date("2026-08-20") });
    state.advanceRequests.push({ id: 42, requestedBy: 1, employeeId: 9, amount: "500.00", reason: "سلفة من العهدة", repaymentMode: "installments", repaymentStartMonth: 9, repaymentStartYear: 2026, installmentCount: 2, status: "pending", createdAt: new Date("2026-08-20") });
    const mostafa = appRouter.createCaller(context(13170001));
    const [leaves, advances] = await Promise.all([mostafa.erp.leaveRequests.list(), mostafa.erp.advanceRequests.list()]);
    expect(leaves).toEqual(expect.arrayContaining([expect.objectContaining({ id: 41, requesterName: "مدير الحسابات", employeeName: "أحمد العامل", employeeCode: "EMP-009" })]));
    expect(advances).toEqual(expect.arrayContaining([expect.objectContaining({ id: 42, requesterName: "مدير الحسابات", employeeName: "أحمد العامل", repaymentMode: "installments", installmentCount: 2 })]));
  });

  it("posts an administrative custody expense against the selected administrative cost item", async () => {
    const caller = appRouter.createCaller(context());
    const result = await caller.erp.custodyMovements.createAdministrativeExpense({ employeeCode: "EMP-001", employeeName: "أحمد", costItemId: 12, description: "رسوم تجديد رخصة", amount: 750, movementDate: "2026-08-25" });
    expect(state.custodyMovements.find((row) => row.id === result.id)).toMatchObject({ allocationType: "general_admin", expenseType: "administrative", signedAmount: "-750.00" });
    expect(state.expenses.find((row) => row.id === result.linkedExpenseId)).toMatchObject({ costItemId: 12, classification: "administrative", expenseType: "administrative", totalAmount: "750.00", paidAmount: "750.00" });
  });

  it("keeps the custody holder separate from the advance beneficiary", async () => {
    const caller = appRouter.createCaller(context());
    const result = await caller.erp.custodyMovements.create({ employeeCode: "CUST-001", employeeName: "أمين العهدة", movementType: "spend", allocationType: "general_cash", description: "سلفة مستفيد آخر", amount: 500, expenseType: "advance", payrollBeneficiaryType: "company_employee", payrollEmployeeId: 9, payrollBeneficiaryName: "أحمد العامل", repaymentMode: "single", repaymentStartMonth: 9, repaymentStartYear: 2026, installmentCount: 1 });
    expect(state.custodyMovements.find((row) => row.id === result.id)).toMatchObject({ employeeCode: "CUST-001", employeeName: "أمين العهدة", payrollEmployeeId: 9, payrollBeneficiaryName: "أحمد العامل" });
    expect(state.advanceRequests.find((row) => row.id === result.advanceRequestId)).toMatchObject({ employeeId: 9, amount: "500.00", repaymentMode: "single" });
  });

  it("persists configurable approval policy thresholds for administrators", async () => {
    const caller = appRouter.createCaller(context(1, "admin"));
    const created = await caller.erp.approvals.policies.upsert({ projectId: 1, entityType: "expense", thresholdAmount: 25000 });
    expect(created.updated).toBe(false);
    const policies = await caller.erp.approvals.policies.list({ projectId: 1 });
    expect(policies).toHaveLength(1);
    expect(policies[0]).toMatchObject({ projectId: 1, entityType: "expense", thresholdAmount: "25000.00" });
    const updated = await caller.erp.approvals.policies.upsert({ projectId: 1, entityType: "expense", thresholdAmount: 50000 });
    expect(updated.updated).toBe(true);
    expect(state.approvalPolicies[0].thresholdAmount).toBe("50000.00");
  });

  it("applies approval thresholds differently by transaction amount", async () => {
    const caller = appRouter.createCaller(context(1, "admin"));
    await caller.erp.approvals.policies.upsert({ projectId: 1, entityType: "expense", thresholdAmount: 25000 });
    const below = await caller.erp.expenses.create({ projectId: 1, description: "مصروف دون الحد", preTaxAmount: 10000, taxRate: 15, paidAmount: 0 });
    const above = await caller.erp.expenses.create({ projectId: 1, description: "مصروف فوق الحد", preTaxAmount: 50000, taxRate: 15, paidAmount: 0 });
    expect(state.expenses.find((row) => row.description === "مصروف دون الحد")).toMatchObject({ status: "approved" });
    expect(state.expenses.find((row) => row.description === "مصروف فوق الحد")).toMatchObject({ status: "pending" });
    expect(state.approvalRequests.find((row) => row.entityType === "expense" && row.status === "approved")).toBeTruthy();
    expect(state.approvalRequests.find((row) => row.entityType === "expense" && row.status === "pending")).toBeTruthy();

    await caller.erp.approvals.policies.upsert({ projectId: 1, entityType: "payroll", thresholdAmount: 25000 });
    await caller.erp.approvals.policies.upsert({ projectId: 1, entityType: "certificate", thresholdAmount: 25000 });
    await caller.erp.approvals.policies.upsert({ projectId: 1, entityType: "sale", thresholdAmount: 25000 });
    await caller.erp.approvals.policies.upsert({ projectId: 1, entityType: "collection", thresholdAmount: 25000 });
    await caller.erp.payroll.create({ projectId: 1, employeeName: "راتب دون الحد", month: 8, year: 2026, amount: 10000, paidAmount: 0 });
    await caller.erp.payroll.create({ projectId: 1, employeeName: "راتب فوق الحد", month: 8, year: 2026, amount: 50000, paidAmount: 0 });
    await caller.erp.certificates.create({ projectId: 1, certificateNumber: "CERT-BELOW", preTaxAmount: 10000, taxRate: 0, paidAmount: 0 });
    await caller.erp.certificates.create({ projectId: 1, certificateNumber: "CERT-ABOVE", preTaxAmount: 50000, taxRate: 0, paidAmount: 0 });
    await caller.erp.sales.create({ projectId: 1, unitId: 10, customerName: "بيع دون الحد", preTaxAmount: 10000, taxRate: 0 });
    await caller.erp.sales.create({ projectId: 1, unitId: 10, customerName: "بيع فوق الحد", preTaxAmount: 50000, taxRate: 0 });
    await caller.erp.collections.create({ projectId: 1, saleId: 101, amount: 10000 });
    await caller.erp.collections.create({ projectId: 1, saleId: 102, amount: 50000 });
    expect(state.payroll.find((row) => row.employeeName === "راتب دون الحد")).toMatchObject({ status: "approved" });
    expect(state.payroll.find((row) => row.employeeName === "راتب فوق الحد")).toMatchObject({ status: "pending" });
    expect(state.certificates.find((row) => row.certificateNumber === "CERT-BELOW")).toMatchObject({ status: "pending" });
    expect(state.certificates.find((row) => row.certificateNumber === "CERT-ABOVE")).toMatchObject({ status: "pending" });
    expect(state.approvalRequests.find((row) => row.entityType === "certificate" && row.approvalStage === "mostafa" && row.status === "pending")).toBeTruthy();
    expect(state.sales.find((row) => row.customerName === "بيع دون الحد")).toMatchObject({ status: "confirmed", recognizedRevenue: "10000.00" });
    expect(state.sales.find((row) => row.customerName === "بيع فوق الحد")).toMatchObject({ status: "reserved", recognizedRevenue: "0.00" });
    expect(state.collections.find((row) => row.amount === "10000.00")).toMatchObject({ status: "received" });
    expect(state.collections.find((row) => row.amount === "50000.00")).toMatchObject({ status: "draft" });
  });

  it("blocks read-only project roles from operational writes", async () => {
    state.projectMembers.splice(0);
    state.projectMembers.push({ id: 2, projectId: 1, userId: 2, projectRole: "viewer", createdAt: new Date() });
    const caller = appRouter.createCaller(context(2));
    await expect(caller.erp.custody.create({ projectId: 1, holderName: "مشاهد", issuedAmount: 100, settledAmount: 0 })).rejects.toThrow("لا يسمح بتسجيل حركة جديدة");
    await expect(caller.erp.certificates.create({ projectId: 1, certificateNumber: "VIEW-001", description: "محاولة", preTaxAmount: 100, taxRate: 15, paidAmount: 0 })).rejects.toThrow("لا يسمح بتسجيل حركة جديدة");
    await expect(caller.erp.attendance.create({ projectId: 1, employeeName: "مشاهد", attendanceDate: "2026-08-10", status: "present" })).rejects.toThrow("لا يسمح بتسجيل حركة جديدة");
    await expect(caller.erp.attachments.create({ projectId: 1, entityType: "certificate", entityId: 1, documentType: "محاولة", fileName: "view.pdf", fileUrl: "https://example.com/view.pdf" })).rejects.toThrow("لا يسمح بتسجيل حركة جديدة");
  });
});
