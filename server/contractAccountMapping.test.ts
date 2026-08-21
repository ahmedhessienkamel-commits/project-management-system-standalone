import { describe, expect, it } from "vitest";
import { resolveMaterialCostAccount } from "../shared/inventory";

describe("automatic material cost account mapping", () => {
  const accounts = [
    { id: 15, isActive: 1, isPostable: 1, accountType: "expense" },
    { id: 21, isActive: 1, isPostable: 1, accountType: "liability" },
    { id: 22, isActive: 0, isPostable: 1, accountType: "expense" },
  ];

  it("resolves the mapped postable expense account without a user-selected account", () => {
    expect(resolveMaterialCostAccount({ accountId: 15 }, accounts)).toMatchObject({ id: 15, accountType: "expense" });
  });

  it("rejects missing, inactive, liability, or non-postable mappings", () => {
    expect(resolveMaterialCostAccount({}, accounts)).toBeNull();
    expect(resolveMaterialCostAccount({ accountId: 21 }, accounts)).toBeNull();
    expect(resolveMaterialCostAccount({ accountId: 22 }, accounts)).toBeNull();
  });
});
