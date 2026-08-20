import { describe, expect, it } from "vitest";
import { allocateAdministrativeExpense, validateExpenseAllocation } from "../shared/expenseAllocation";

describe("expense allocation rules", () => {
  it("requires a project only for project allocation", () => {
    expect(validateExpenseAllocation({ classification: "project" })).toEqual({ ok: false, message: "اختر المشروع عند تحميل المصروف على مشروع أو كمصروف تشغيلي للمشروع" });
    expect(validateExpenseAllocation({ classification: "project", projectId: 3 })).toEqual({ ok: true });
  });

  it("requires a project for project operating expenses", () => {
    expect(validateExpenseAllocation({ classification: "project", expenseType: "operating" })).toEqual({ ok: false, message: "اختر المشروع عند تحميل المصروف على مشروع أو كمصروف تشغيلي للمشروع" });
    expect(validateExpenseAllocation({ classification: "project", expenseType: "operating", projectId: 12 })).toEqual({ ok: true });
  });

  it("allows general and petty-cash expenses without a project", () => {
    expect(validateExpenseAllocation({ classification: "administrative", expenseType: "administrative" })).toEqual({ ok: true });
    expect(validateExpenseAllocation({ classification: "general_cash" })).toEqual({ ok: true });
    expect(validateExpenseAllocation({ classification: "petty_cash" })).toEqual({ ok: true });
  });

  it("keeps stages optional and project-scoped", () => {
    expect(validateExpenseAllocation({ classification: "administrative", stageId: 2 })).toEqual({ ok: false, message: "المرحلة متاحة فقط للمصروف المحمل على مشروع" });
    expect(validateExpenseAllocation({ classification: "project", projectId: 3, stageId: 2 })).toEqual({ ok: true });
  });

  it("allocates administrative expenses by contract value without rounding loss", () => {
    const allocations = allocateAdministrativeExpense(1500, [{ projectId: 1, contractValue: 10000000 }, { projectId: 2, contractValue: 5000000 }]);
    expect(allocations.map((row) => row.allocatedAmount)).toEqual([1000, 500]);
    expect(allocations.reduce((sum, row) => sum + row.allocatedAmount, 0)).toBe(1500);
    expect(allocations[0]?.ratio).toBeCloseTo(2 / 3, 6);
  });
});
