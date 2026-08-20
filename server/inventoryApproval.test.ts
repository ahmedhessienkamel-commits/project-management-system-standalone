import { describe, expect, it } from "vitest";
import { canReviewInventoryStage, nextInventoryApprovalStage } from "../shared/inventory";

describe("inventory approval chain", () => {
  it("allows Mostafa or the owner to review the first stage", () => {
    expect(canReviewInventoryStage("mostafa", { id: 13170001, role: "user" })).toBe(true);
    expect(canReviewInventoryStage("mostafa", { id: 1, role: "admin" })).toBe(true);
    expect(canReviewInventoryStage("mostafa", { id: 44, role: "user" })).toBe(false);
  });

  it("restricts the final stage to the owner", () => {
    expect(canReviewInventoryStage("owner", { id: 1, role: "admin" })).toBe(true);
    expect(canReviewInventoryStage("owner", { id: 13170001, role: "user" })).toBe(false);
  });

  it("moves from Mostafa to owner and then completes", () => {
    expect(nextInventoryApprovalStage("mostafa", "approved")).toBe("owner");
    expect(nextInventoryApprovalStage("owner", "approved")).toBe("complete");
    expect(nextInventoryApprovalStage("mostafa", "rejected")).toBe("rejected");
  });
});
