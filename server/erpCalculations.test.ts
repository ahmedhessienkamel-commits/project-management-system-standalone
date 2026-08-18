import { describe, expect, it } from "vitest";
import { calculateExpenseTotals, calculatePayrollTotals, projectHealthStatus } from "./erpCalculations";

describe("ERP financial rules", () => {
  it("calculates pre-tax, VAT, and total for expenses", () => {
    expect(calculateExpenseTotals(1000, 15)).toEqual({ preTaxAmount: 1000, taxRate: 15, taxAmount: 150, totalAmount: 1150 });
  });

  it("keeps payroll tax-free", () => {
    expect(calculatePayrollTotals(1000)).toEqual({ preTaxAmount: 1000, taxAmount: 0, totalAmount: 1000 });
  });

  it("returns critical when a stage is delayed or budget is exceeded", () => {
    expect(projectHealthStatus({ budgetUsage: 70, progress: 80, delayedStages: 1 })).toBe("critical");
    expect(projectHealthStatus({ budgetUsage: 105, progress: 80, delayedStages: 0 })).toBe("critical");
  });

  it("returns warning before critical thresholds", () => {
    expect(projectHealthStatus({ budgetUsage: 82, progress: 60, delayedStages: 0 })).toBe("warning");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 10, delayedStages: 0 })).toBe("warning");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, cashGapRatio: 0.1 })).toBe("warning");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, pendingApprovals: 1 })).toBe("warning");
  });

  it("returns critical for a large cash gap or approval backlog", () => {
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, cashGapRatio: 0.5 })).toBe("critical");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, pendingApprovals: 3 })).toBe("critical");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, overdueApprovals: 1 })).toBe("critical");
  });
});
