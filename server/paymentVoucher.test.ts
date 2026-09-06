import { describe, expect, it } from "vitest";
import { getAssetPaymentVoucherValidationMessage, getPaymentVoucherValidationMessage } from "../shared/paymentVoucher";

describe("payment voucher validation", () => {
  const valid = { amount: 100, description: "مصروف تشغيل", hasSource: true, hasDebitAccount: true, category: "administrative", hasSupplier: false, hasParty: true };

  it("accepts a complete owner voucher", () => {
    expect(getPaymentVoucherValidationMessage(valid)).toBeNull();
  });

  it("explains missing source and supplier fields", () => {
    expect(getPaymentVoucherValidationMessage({ ...valid, hasSource: false })).toContain("البنك أو الخزينة");
    expect(getPaymentVoucherValidationMessage({ ...valid, category: "supplier", hasSupplier: false })).toContain("المورد");
  });

  it("requires an asset card and its account while leaving supplier linkage optional", () => {
    const asset = { ...valid, category: "asset", hasSupplier: false, hasAssetCard: true, hasAssetAccount: true };
    expect(getPaymentVoucherValidationMessage(asset)).toBeNull();
    expect(getPaymentVoucherValidationMessage({ ...asset, hasAssetCard: false })).toContain("بطاقة الأصل");
    expect(getPaymentVoucherValidationMessage({ ...asset, hasAssetAccount: false })).toContain("حساب الأصل");
    expect(getAssetPaymentVoucherValidationMessage({ hasAssetCard: true, assetAccountId: 701, debitAccountId: 701, debitLineCount: 1, creditLineCount: 1, hasCostItem: false })).toBeNull();
    expect(getAssetPaymentVoucherValidationMessage({ hasAssetCard: true, assetAccountId: 701, debitAccountId: 702, debitLineCount: 1, creditLineCount: 1, hasCostItem: false })).toContain("حساب الأصل");
    expect(getAssetPaymentVoucherValidationMessage({ hasAssetCard: true, assetAccountId: 701, debitAccountId: 701, debitLineCount: 1, creditLineCount: 1, hasCostItem: true })).toContain("بند تكلفة");
  });
});
