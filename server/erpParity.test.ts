import { describe, expect, it } from "vitest";
import { calculateExpenseTotals, calculatePayrollTotals, projectHealthStatus } from "./erpCalculations";

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
});
