import { beforeEach, describe, expect, it, vi } from "vitest";
import { projects, stages, expenses, collections, approvalRequests, attachments, sales, payroll, vendors, certificates, projectMembers, units, periodLocks, notifications, auditLogs, attendance } from "../drizzle/schema";

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
};

const tableState = new Map<any, keyof typeof state>([
  [projects, "projects"], [stages, "stages"], [expenses, "expenses"], [collections, "collections"], [approvalRequests, "approvalRequests"], [attachments, "attachments"], [sales, "sales"], [payroll, "payroll"], [vendors, "vendors"], [certificates, "certificates"], [projectMembers, "projectMembers"], [units, "units"], [periodLocks, "periodLocks"], [notifications, "notifications"], [auditLogs, "auditLogs"], [attendance, "attendance"],
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

function context(userId = 1): TrpcContext {
  return {
    user: { id: userId, openId: `integration-user-${userId}`, email: `integration-${userId}@example.com`, name: "Integration User", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
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
    const certificate = await caller.erp.certificates.create({ projectId: 1, stageId: 2, certificateNumber: "CERT-001", description: "مستخلص اختبار", preTaxAmount: 5000, taxRate: 15, paidAmount: 1000 });
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
    const report = await caller.erp.reports.financialSummary({ projectId: 1 });
    expect(sale.recognizedRevenue).toBe(250000);
    expect(state.sales[0]).toMatchObject({ projectId: 1, unitId: 10, stageId: 2, status: "confirmed", recognizedRevenue: "250000.00" });
    expect(state.collections[0]).toMatchObject({ projectId: 1, saleId: sale.id, status: "received", amount: "75000.00" });
    expect(state.payroll).toHaveLength(2);
    expect(state.payroll.find((row) => row.employeeCode === "EMP-001")).toMatchObject({ employeeName: "أحمد", classification: "project", taxAmount: "0.00" });
    expect(state.payroll.find((row) => row.employeeCode === "EMP-002")).toMatchObject({ employeeName: "سارة", classification: "administrative", taxAmount: "0.00" });
    expect(summary[0]).toMatchObject({ recognizedRevenue: 250000, collectionsReceived: 75000, actualCost: 13150, payrollOutstanding: 12000 });
    expect(summary[0].missingDocumentCount).toBeGreaterThanOrEqual(2);
    expect(report).toMatchObject({ revenue: 250000, collectionsReceived: 75000, expensesPreTax: 1000, payrollTotal: 12000, payrollOutstanding: 12000 });
    const cashFlow = await caller.erp.reports.cashFlow({ projectId: 1 });
    expect(cashFlow.stages.find((row) => row.stageId === 2)).toMatchObject({ stageName: "الحفر", cashIn: 75000, cashOut: 1500, net: 73500, cumulativeGap: -73500, fundingRequired: 0, allocation: "stage-linked-sales-and-outflows" });
    expect(cashFlow.stages.find((row) => row.stageId === null)).toBeUndefined();
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
