import { describe, expect, it } from "vitest";
import { calculateInventoryBalance, selectPurchaseInvoiceForIssue } from "../shared/inventory";

describe("inventory balance calculations", () => {
  it("calculates received, issued, available quantity, and value", () => {
    const result = calculateInventoryBalance([
      { movementType: "receipt", quantity: "100", totalAmount: "25000" },
      { movementType: "issue", quantity: "30", totalAmount: "7500" },
      { movementType: "adjustment_in", quantity: 2.5, totalAmount: 625 },
      { movementType: "adjustment_out", quantity: 1.5, totalAmount: 375 },
    ]);

    expect(result).toEqual({ received: 102.5, issued: 31.5, quantity: 71, value: 17750 });
  });

  it("returns a zero balance when there are no movements", () => {
    expect(calculateInventoryBalance([])).toEqual({ received: 0, issued: 0, quantity: 0, value: 0 });
  });

  it("links an issue to the first available purchase invoice for the material", () => {
    expect(selectPurchaseInvoiceForIssue([{ purchaseInvoiceId: null }, { purchaseInvoiceId: 42, reference: "GRN-42" }])).toBe(42);
    expect(selectPurchaseInvoiceForIssue([{ purchaseInvoiceId: null }])).toBeNull();
  });
});
