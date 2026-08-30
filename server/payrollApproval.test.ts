import { describe, expect, it } from "vitest";
import { canApprovePayrollRun } from "./routers/erp";

describe("payroll_run owner-only approval", () => {
  it("allows the admin/owner at the owner stage", () => {
    expect(canApprovePayrollRun({ role: "admin" }, { entityType: "payroll_run", approvalStage: "owner" })).toBe(true);
  });

  it("blocks general-manager and admin attempts at the pending general-manager stage", () => {
    expect(canApprovePayrollRun({ role: "general_manager" }, { entityType: "payroll_run", approvalStage: "general_manager" })).toBe(false);
    expect(canApprovePayrollRun({ role: "admin" }, { entityType: "payroll_run", approvalStage: "general_manager" })).toBe(false);
  });

  it("blocks ordinary users and keeps the rule scoped to payroll_run", () => {
    expect(canApprovePayrollRun({ role: "user" }, { entityType: "payroll_run", approvalStage: "owner" })).toBe(false);
    expect(canApprovePayrollRun({ role: "general_manager" }, { entityType: "purchase_payment", approvalStage: "general_manager" })).toBe(true);
  });
});
