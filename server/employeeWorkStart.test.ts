import { beforeEach, describe, expect, it, vi } from "vitest";
import { auditLogs, employeeWorkStarts, employees, notifications, users } from "../drizzle/schema";

const state = { employees: [] as any[], employeeWorkStarts: [] as any[], auditLogs: [] as any[], notifications: [] as any[], users: [] as any[] };
const tableState = new Map<any, keyof typeof state>([[employees, "employees"], [employeeWorkStarts, "employeeWorkStarts"], [auditLogs, "auditLogs"], [notifications, "notifications"], [users, "users"]]);
const rowsFor = (table: any) => state[tableState.get(table)!] ?? [];

function fakeDb() {
  let id = 800;
  return {
    select: () => ({ from: (table: any) => { const rows = rowsFor(table); const query: any = Promise.resolve(rows); query.where = () => query; query.limit = (count: number) => Promise.resolve(rows.slice(0, count)); query.orderBy = () => query; return query; } }),
    insert: (table: any) => ({ values: (value: any) => { const row = { ...value, id: ++id, createdAt: new Date(), updatedAt: new Date() }; rowsFor(table).push(row); return Promise.resolve([{ insertId: row.id }]); } }),
    update: (table: any) => ({ set: (changes: any) => ({ where: async () => { if (rowsFor(table)[0]) Object.assign(rowsFor(table)[0], changes); return []; } }) }),
  };
}

vi.mock("./db", () => ({ getDb: vi.fn(async () => fakeDb()) }));
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(role: "admin" | "general_manager"): TrpcContext {
  return { user: { id: role === "admin" ? 1 : 2, openId: `employee-${role}`, email: `${role}@example.com`, name: role === "admin" ? "المالك" : "المدير العام", loginMethod: "password", role, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("employee work-start workflow", () => {
  beforeEach(() => { for (const rows of Object.values(state)) rows.splice(0); state.employees.push({ id: 10, employeeCode: "EMP-010", fullName: "موظف اختبار", jobTitle: "مهندس موقع", workLocation: "مشروع نمار", defaultProjectId: 1, status: "active" }); });

  it("creates an employee-signed work start then lets only the general manager sign it", async () => {
    const owner = appRouter.createCaller(context("admin"));
    const created = await owner.erp.employees.workStarts.create({ employeeId: 10, workStartDate: "2026-08-22", employeeSignatureName: "موظف اختبار" });
    expect(created.status).toBe("pending_general_manager");
    expect(state.employeeWorkStarts[0]).toMatchObject({ employeeId: 10, employeeSignatureName: "موظف اختبار" });
    const generalManager = appRouter.createCaller(context("general_manager"));
    await generalManager.erp.employees.workStarts.sign({ id: created.id, decision: "signed" });
    expect(state.employeeWorkStarts[0]).toMatchObject({ status: "signed", generalManagerUserId: 2 });
    expect(state.auditLogs.some((row) => row.action === "general_manager_signed")).toBe(true);
  });
});
