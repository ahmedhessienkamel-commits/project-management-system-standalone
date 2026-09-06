import { describe, expect, it } from "vitest";
import { getPaymentVoucherValidationMessage } from "../shared/paymentVoucher";

describe("payment voucher validation", () => {
  const valid = { amount: 100, description: "مصروف تشغيل", hasSource: true, hasDebitAccount: true, category: "administrative", hasSupplier: false, hasParty: true };

  it("accepts a complete owner voucher", () => {
    expect(getPaymentVoucherValidationMessage(valid)).toBeNull();
  });

  it("explains missing source and supplier fields", () => {
    expect(getPaymentVoucherValidationMessage({ ...valid, hasSource: false })).toContain("البنك أو الخزينة");
    expect(getPaymentVoucherValidationMessage({ ...valid, category: "supplier", hasSupplier: false })).toContain("المورد");
  });
});
