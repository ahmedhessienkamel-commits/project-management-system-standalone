import { describe, expect, it } from "vitest";
import { calculateInventoryBalance, getContractLineRemaining, isMaterialContractType } from "../shared/inventory";

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

  it("limits material linkage to supply contract types", () => {
    expect(isMaterialContractType("supply")).toBe(true);
    expect(isMaterialContractType("supply_installation")).toBe(true);
    expect(isMaterialContractType("building_stage")).toBe(false);
    expect(isMaterialContractType("equipment_rental")).toBe(false);
    expect(getContractLineRemaining(100, 35)).toBe(65);
  });
});
