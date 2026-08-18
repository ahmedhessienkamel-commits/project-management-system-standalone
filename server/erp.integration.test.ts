import { beforeEach, describe, expect, it, vi } from "vitest";
import { projects, stages, expenses, collections, approvalRequests, attachments, sales, payroll, vendors, certificates, projectMembers, units, periodLocks, notifications, auditLogs } from "../drizzle/schema";

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
};

const tableState = new Map<any, keyof typeof state>([
  [projects, "projects"], [stages, "stages"], [expenses, "expenses"], [collections, "collections"], [approvalRequests, "approvalRequests"], [attachments, "attachments"], [sales, "sales"], [payroll, "payroll"], [vendors, "vendors"], [certificates, "certificates"], [projectMembers, "projectMembers"], [units, "units"], [periodLocks, "periodLocks"], [notifications, "notifications"], [auditLogs, "auditLogs"],
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

function context(): TrpcContext {
  return {
    user: { id: 1, openId: "integration-user", email: "integration@example.com", name: "Integration User", loginMethod: "manus", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("ERP sales and collections API flow", () => {
  beforeEach(() => {
    for (const key of Object.keys(state) as Array<keyof typeof state>) state[key].splice(0);
    state.projects.push({ id: 1, code: "WN-001", name: "وادي نمار", classification: "operational", status: "active", location: "الرياض", createdAt: new Date(), updatedAt: new Date() });
    state.projectMembers.push({ id: 1, projectId: 1, userId: 1, projectRole: "finance", createdAt: new Date() });
    state.units.push({ id: 10, projectId: 1, unitCode: "A-101", status: "available", createdAt: new Date(), updatedAt: new Date() });
  });

  it("creates a confirmed unit sale, received collection, and dashboard summary from the same state", async () => {
    const caller = appRouter.createCaller(context());
    const memberships = await caller.erp.members.mine();
    expect(memberships).toEqual(expect.arrayContaining([expect.objectContaining({ projectId: 1, userId: 1, projectRole: "finance" })]));
    const sale = await caller.erp.sales.create({ projectId: 1, unitId: 10, customerName: "عميل الاختبار", preTaxAmount: 250000, taxRate: 15 });
    await caller.erp.collections.create({ projectId: 1, saleId: sale.id, amount: 75000, receiptReference: "RC-001" });
    await caller.erp.payroll.create({ projectId: 1, employeeName: "أحمد", employeeCode: "EMP-001", month: 8, year: 2026, classification: "project", amount: 12000, paidAmount: 0 });
    await caller.erp.payroll.create({ projectId: 1, employeeName: "سارة", employeeCode: "EMP-002", month: 8, year: 2026, classification: "administrative", amount: 8000, paidAmount: 0 });
    const projectExpense = await caller.erp.expenses.create({ projectId: 1, description: "حديد", unit: "طن", quantity: 2, expenseType: "materials", classification: "project", preTaxAmount: 1000, taxRate: 15, paidAmount: 500 });
    await caller.erp.expenses.create({ projectId: 1, description: "إدارة", unit: "شهر", quantity: 1, expenseType: "administrative", classification: "administrative", preTaxAmount: 300, taxRate: 15, paidAmount: 300 });
    const trace = await caller.erp.controls.trace({ projectId: 1, entityType: "expense", entityId: projectExpense.id });
    expect(trace.approval).not.toBeNull();
    expect(trace.audits.length).toBeGreaterThan(0);
    state.payroll.forEach((row) => { row.status = "approved"; });
    state.expenses.forEach((row) => { row.status = "approved"; });
    const summary = await caller.erp.dashboard.summary();
    const report = await caller.erp.reports.financialSummary({ projectId: 1 });
    expect(sale.recognizedRevenue).toBe(250000);
    expect(state.sales[0]).toMatchObject({ projectId: 1, unitId: 10, status: "confirmed", recognizedRevenue: "250000.00" });
    expect(state.collections[0]).toMatchObject({ projectId: 1, saleId: sale.id, status: "received", amount: "75000.00" });
    expect(state.payroll).toHaveLength(2);
    expect(state.payroll.find((row) => row.employeeCode === "EMP-001")).toMatchObject({ employeeName: "أحمد", classification: "project", taxAmount: "0.00" });
    expect(state.payroll.find((row) => row.employeeCode === "EMP-002")).toMatchObject({ employeeName: "سارة", classification: "administrative", taxAmount: "0.00" });
    expect(summary[0]).toMatchObject({ recognizedRevenue: 250000, collectionsReceived: 75000, actualCost: 13150, payrollOutstanding: 12000 });
    expect(report).toMatchObject({ revenue: 250000, collectionsReceived: 75000, expensesPreTax: 1000, payrollTotal: 12000, payrollOutstanding: 12000 });
  });
});
