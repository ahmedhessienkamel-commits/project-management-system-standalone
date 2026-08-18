import { describe, expect, it } from "vitest";
import { calculateDashboardShortcutTotals, calculateDocumentCompleteness, calculateExpenseTotals, calculateFinancialSummaryTotals, calculatePayrollTotals, canAccessProject, projectHealthStatus, projectNotificationTriggers } from "./erpCalculations";

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

  it("aggregates homepage shortcut totals from project summaries", () => {
    expect(calculateDashboardShortcutTotals([{ plannedBudget: 1000, actualCost: 700, outstandingCost: 200, recognizedRevenue: 1500, collectionsReceived: 900, payrollOutstanding: 80, cashGap: 120, pendingApprovals: 2 }, { plannedBudget: 500, actualCost: 300, outstandingCost: 50, recognizedRevenue: 700, collectionsReceived: 400, payrollOutstanding: 20, cashGap: 0, pendingApprovals: 1 }])).toEqual({ plannedBudget: 1500, actualCost: 1000, outstandingCost: 250, recognizedRevenue: 2200, collectionsReceived: 1300, payrollOutstanding: 100, cashGap: 120, pendingApprovals: 3 });
  });

  it("flags missing contractor tax, registration, and official attachment documents", () => {
    const result = calculateDocumentCompleteness({ vendors: [{ id: 1, name: "مقاول", taxNumber: "", commercialRegistration: null }], attachments: [] });
    expect(result.complete).toBe(false);
    expect(result.missing.map((item) => item.document)).toEqual(["الرقم الضريبي", "السجل التجاري", "مرفق رسمي"]);
    expect(projectNotificationTriggers({ projectName: "وادي نمار", pendingApprovals: 0, budgetUsage: 20, cashGap: 0, hasAttachments: true, missingDocumentCount: result.missing.length }).some((item) => item.type === "documents_detail")).toBe(true);
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

  it("propagates a unit sale and received collection into executive shortcut totals", () => {
    const financial = calculateFinancialSummaryTotals({
      sales: [{ recognizedRevenue: "250000" }],
      collections: [{ amount: "75000", status: "received" }],
      expenses: [{ preTaxAmount: "40000", taxAmount: "6000", totalAmount: "46000", paidAmount: "30000" }],
      payroll: [{ totalAmount: "12000", paidAmount: "9000" }],
    });
    expect(calculateDashboardShortcutTotals([{ plannedBudget: 300000, actualCost: financial.expensesTotal + financial.payrollTotal, outstandingCost: financial.expensesTotal - financial.expensesPaid, recognizedRevenue: financial.revenue, collectionsReceived: financial.collectionsReceived, payrollOutstanding: financial.payrollOutstanding, cashGap: 0, pendingApprovals: 0 }])).toEqual({ plannedBudget: 300000, actualCost: 58000, outstandingCost: 16000, recognizedRevenue: 250000, collectionsReceived: 75000, payrollOutstanding: 3000, cashGap: 0, pendingApprovals: 0 });
  });
});
