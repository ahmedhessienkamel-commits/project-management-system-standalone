import { describe, expect, it } from "vitest";
import { validateExpenseAllocation } from "../shared/expenseAllocation";

describe("expense allocation rules", () => {
  it("requires a project only for project allocation", () => {
    expect(validateExpenseAllocation({ classification: "project" })).toEqual({ ok: false, message: "اختر المشروع عند تحميل المصروف على مشروع" });
    expect(validateExpenseAllocation({ classification: "project", projectId: 3 })).toEqual({ ok: true });
  });

  it("allows general and petty-cash expenses without a project", () => {
    expect(validateExpenseAllocation({ classification: "administrative" })).toEqual({ ok: true });
    expect(validateExpenseAllocation({ classification: "general_cash" })).toEqual({ ok: true });
    expect(validateExpenseAllocation({ classification: "petty_cash" })).toEqual({ ok: true });
  });

  it("keeps stages optional and project-scoped", () => {
    expect(validateExpenseAllocation({ classification: "administrative", stageId: 2 })).toEqual({ ok: false, message: "المرحلة متاحة فقط للمصروف المحمل على مشروع" });
    expect(validateExpenseAllocation({ classification: "project", projectId: 3, stageId: 2 })).toEqual({ ok: true });
  });
});
