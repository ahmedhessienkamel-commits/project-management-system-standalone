import { describe, expect, it } from "vitest";
import { calculateExpenseTotals, calculateFinancialSummaryTotals, calculatePayrollTotals, canAccessProject, projectHealthStatus, projectNotificationTriggers } from "./erpCalculations";

describe("Excel parity financial rules", () => {
  it("calculates material cost before tax, tax, and after tax", () => {
    expect(calculateExpenseTotals(1000, 15)).toEqual({ preTaxAmount: 1000, taxRate: 15, taxAmount: 150, totalAmount: 1150 });
  });

  it("keeps payroll tax-free", () => {
    expect(calculatePayrollTotals(3200)).toEqual({ preTaxAmount: 3200, taxAmount: 0, totalAmount: 3200 });
  });

  it("never permits negative payment or payroll amounts", () => {
    expect(calculateExpenseTotals(-50, 15).totalAmount).toBe(0);
    expect(calculatePayrollTotals(-50).totalAmount).toBe(0);
  });

  it("marks a project critical when a stage is delayed or budget is exceeded", () => {
    expect(projectHealthStatus({ budgetUsage: 101, progress: 65, delayedStages: 0 })).toBe("critical");
    expect(projectHealthStatus({ budgetUsage: 70, progress: 65, delayedStages: 1 })).toBe("critical");
  });

  it("marks an 80-percent budget usage as warning", () => {
    expect(projectHealthStatus({ budgetUsage: 80, progress: 65, delayedStages: 0 })).toBe("warning");
  });

  it("enforces project access boundaries", () => {
    expect(canAccessProject("admin", new Set([1]), 99)).toBe(true);
    expect(canAccessProject("user", new Set([1]), 1)).toBe(true);
    expect(canAccessProject("user", new Set([1]), 2)).toBe(false);
  });

  it("creates notification triggers for project risks", () => {
    expect(projectNotificationTriggers({ projectName: "وادي نمار", pendingApprovals: 2, budgetUsage: 85, cashGap: 300, hasAttachments: false }).map((trigger) => trigger.type)).toEqual(["approval", "budget", "cash", "documents"]);
    expect(projectNotificationTriggers({ projectName: "وادي نمار", pendingApprovals: 0, budgetUsage: 50, cashGap: 0, hasAttachments: true })).toEqual([]);
  });

  it("reconciles explicit financial report totals without double counting", () => {
    expect(calculateFinancialSummaryTotals({
      sales: [{ recognizedRevenue: "5000" }],
      collections: [{ amount: "1200", status: "received" }, { amount: "300", status: "pending" }],
      expenses: [{ preTaxAmount: "1000", taxAmount: "150", totalAmount: "1150", paidAmount: "500" }],
      payroll: [{ totalAmount: "800", paidAmount: "300" }],
    })).toEqual({ revenue: 5000, collectionsReceived: 1200, expensesPreTax: 1000, expensesTax: 150, expensesTotal: 1150, expensesPaid: 500, payrollTotal: 800, payrollPaid: 300, payrollOutstanding: 500 });
  });
});
