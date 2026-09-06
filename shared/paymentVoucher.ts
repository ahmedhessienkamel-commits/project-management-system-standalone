export type PaymentVoucherValidationInput = {
  amount: number;
  description: string;
  hasSource: boolean;
  hasDebitAccount: boolean;
  category: string;
  hasSupplier: boolean;
  hasParty: boolean;
};

export function getPaymentVoucherValidationMessage(input: PaymentVoucherValidationInput): string | null {
  if (!input.amount || input.amount < 0) return "أدخل قيمة الصرف قبل الحفظ.";
  if (!input.description.trim()) return "أدخل بيان الصرف قبل الحفظ.";
  if (!input.hasSource) return "اختر البنك أو الخزينة التي سيتم الصرف منها.";
  if (!input.hasDebitAccount) return "لا يوجد حساب مصروف صالح. اختر البند المدين أو أضف حساب مصروف مرحّل.";
  if (input.category === "supplier" && !input.hasSupplier) return "اختر المورد المرتبط بسند الصرف.";
  if (input.category === "payroll" && !input.hasParty) return "حدد مستفيد الراتب.";
  return null;
}
