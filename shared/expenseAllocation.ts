export type ExpenseAllocation = "project" | "administrative" | "general_cash" | "petty_cash";

export function validateExpenseAllocation(input: { projectId?: number; stageId?: number; classification: ExpenseAllocation }) {
  if (input.classification === "project" && !input.projectId) {
    return { ok: false as const, message: "اختر المشروع عند تحميل المصروف على مشروع" };
  }
  if (input.classification !== "project" && input.stageId) {
    return { ok: false as const, message: "المرحلة متاحة فقط للمصروف المحمل على مشروع" };
  }
  return { ok: true as const };
}
