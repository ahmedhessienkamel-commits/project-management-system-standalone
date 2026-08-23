import { describe, expect, it } from "vitest";
import { advanceOutstandingAmount, buildAdvanceSchedule, calculateAdvanceDeduction, calculatePayrollAdvanceAccrualAmounts, isRepaymentDue } from "../shared/advanceRepayment";

describe("جدولة سلف الموظفين", () => {
  it("يضع السلفة الكاملة في شهر واحد عند اختيار خصم كامل", () => {
    expect(buildAdvanceSchedule(1200, 8, 2026, 1)).toEqual([{ scheduledMonth: 8, scheduledYear: 2026, scheduledAmount: 1200 }]);
  });

  it("يقسم السلفة مع معالجة فرق التقريب في القسط الأخير", () => {
    expect(buildAdvanceSchedule(1000, 11, 2026, 3)).toEqual([
      { scheduledMonth: 11, scheduledYear: 2026, scheduledAmount: 333.33 },
      { scheduledMonth: 12, scheduledYear: 2026, scheduledAmount: 333.33 },
      { scheduledMonth: 1, scheduledYear: 2027, scheduledAmount: 333.34 },
    ]);
  });

  it("يعرض فقط القسط المجدول أو المؤجل حتى شهر المسير", () => {
    expect(isRepaymentDue({ scheduledMonth: 9, scheduledYear: 2026, status: "scheduled" }, 8, 2026)).toBe(false);
    expect(isRepaymentDue({ scheduledMonth: 8, scheduledYear: 2026, status: "deferred" }, 9, 2026)).toBe(true);
    expect(isRepaymentDue({ scheduledMonth: 8, scheduledYear: 2026, status: "applied" }, 9, 2026)).toBe(false);
  });

  it("يحسب الرصيد المتبقي بعد خصومات مسير الرواتب", () => {
    expect(advanceOutstandingAmount(1500, [500, "250.5"])).toBe(749.5);
  });

  it("يحدد الخصم الجزئي ويرحّل الباقي إلى القسط التالي دون تجاوز صافي الراتب", () => {
    expect(calculateAdvanceDeduction({ grossPayrollAmount: 1000, otherDeductionAmount: 100, dueAmount: 600, requestedAmount: 250 })).toEqual({ appliedAmount: 250, carryForwardAmount: 350, netPayrollAmount: 650 });
    expect(calculateAdvanceDeduction({ grossPayrollAmount: 700, otherDeductionAmount: 200, dueAmount: 600, requestedAmount: 600 })).toEqual({ appliedAmount: 500, carryForwardAmount: 100, netPayrollAmount: 0 });
  });

  it("يثبت تكلفة الراتب قبل خصم السلفة ويترك صافيًا قابلًا للصرف", () => {
    expect(calculatePayrollAdvanceAccrualAmounts(750, 250)).toEqual({ payrollExpenseAmount: 1000, payrollPayableCredit: 1000, advanceSettlementDebit: 250, advanceSettlementCredit: 250, outstandingPayrollPayable: 750 });
  });
});
