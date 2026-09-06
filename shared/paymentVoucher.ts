export type PaymentVoucherValidationInput = {
  amount: number;
  description: string;
  hasSource: boolean;
  hasDebitAccount: boolean;
  category: string;
  hasSupplier: boolean;
  hasParty: boolean;
  hasAssetCard?: boolean;
  hasAssetAccount?: boolean;
};

export type AssetPaymentVoucherLinesInput = {
  hasAssetCard: boolean;
  assetAccountId?: number | null;
  debitAccountId?: number | null;
  debitLineCount: number;
  creditLineCount: number;
  hasCostItem: boolean;
};

export function getAssetPaymentVoucherValidationMessage(input: AssetPaymentVoucherLinesInput): string | null {
  if (!input.hasAssetCard) return "اختر بطاقة الأصل المرتبط بسند الصرف.";
  if (!input.assetAccountId || input.debitAccountId !== input.assetAccountId) return "سند الأصل يجب أن يوجّه المدين إلى حساب الأصل مباشرةً.";
  if (input.debitLineCount !== 1 || input.creditLineCount !== 1) return "سند الأصل يجب أن يحتوي على سطر مدين وسطر دائن فقط.";
  if (input.hasCostItem) return "لا يمكن ربط سند الأصل ببند تكلفة.";
  return null;
}

export function getPaymentVoucherValidationMessage(input: PaymentVoucherValidationInput): string | null {
  if (!input.amount || input.amount < 0) return "أدخل قيمة الصرف قبل الحفظ.";
  if (!input.description.trim()) return "أدخل بيان الصرف قبل الحفظ.";
  if (!input.hasSource) return "اختر البنك أو الخزينة التي سيتم الصرف منها.";
  if (!input.hasDebitAccount) return "لا يوجد حساب مصروف صالح. اختر البند المدين أو أضف حساب مصروف مرحّل.";
  if (input.category === "asset" && !input.hasAssetCard) return "اختر بطاقة الأصل المرتبط بسند الصرف.";
  if (input.category === "asset" && !input.hasAssetAccount) return "حساب الأصل المرتبط غير صالح.";
  if (input.category === "supplier" && !input.hasSupplier) return "اختر المورد المرتبط بسند الصرف.";
  if (input.category === "payroll" && !input.hasParty) return "حدد مستفيد الراتب.";
  return null;
}
