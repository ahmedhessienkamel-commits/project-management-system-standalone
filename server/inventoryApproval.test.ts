import { describe, expect, it } from "vitest";
import { canReviewInventoryStage, nextInventoryApprovalStage, requiresSupplierInvoicePaymentApproval } from "../shared/inventory";

describe("inventory approval chain", () => {
  it("allows Mostafa or the owner to review the first stage", () => {
    expect(canReviewInventoryStage("mostafa", { id: 13170001, role: "user" })).toBe(true);
    expect(canReviewInventoryStage("mostafa", { id: 1, role: "admin" })).toBe(true);
    expect(canReviewInventoryStage("mostafa", { id: 44, role: "user" })).toBe(false);
  });

  it("allows only the owner to review the second stage", () => {
    expect(canReviewInventoryStage("owner", { id: 1, role: "admin" })).toBe(true);
    expect(canReviewInventoryStage("owner", { id: 22, role: "project_manager" })).toBe(false);
    expect(canReviewInventoryStage("owner", { id: 44, role: "site_worker" })).toBe(false);
  });

  it("moves from Mostafa to owner and then completes", () => {
    expect(nextInventoryApprovalStage("mostafa", "approved")).toBe("owner");
    expect(nextInventoryApprovalStage("owner", "approved")).toBe("complete");
    expect(nextInventoryApprovalStage("mostafa", "rejected")).toBe("rejected");
  });
});

describe("supplier invoice payment approval", () => {
  it("requires approval only for supplier payment vouchers linked to a purchase invoice", () => {
    expect(requiresSupplierInvoicePaymentApproval({ documentType: "payment_voucher", voucherCategory: "supplier", settlementType: "invoice", purchaseInvoiceId: 10 })).toBe(true);
    expect(requiresSupplierInvoicePaymentApproval({ documentType: "payment_voucher", voucherCategory: "supplier", settlementType: "direct", purchaseInvoiceId: 10 })).toBe(false);
    expect(requiresSupplierInvoicePaymentApproval({ documentType: "payment_voucher", voucherCategory: "contractor", settlementType: "invoice", purchaseInvoiceId: 10 })).toBe(false);
  });
});
