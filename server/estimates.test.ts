import { describe, expect, it } from "vitest";
import { calculateEstimateLine, calculateEstimateTotal } from "../shared/estimateMath";

describe("estimate calculations", () => {
  it("derives unit rate from cost components when no rate is entered", () => {
    expect(calculateEstimateLine({ quantity: 3, materialCost: 100, laborCost: 50, equipmentCost: 25, otherCost: 5, unitRate: 0 })).toEqual({ unitRate: 180, totalCost: 540 });
  });

  it("uses the explicitly entered unit rate and totals multiple lines", () => {
    expect(calculateEstimateLine({ quantity: 2.5, materialCost: 100, laborCost: 50, equipmentCost: 25, otherCost: 5, unitRate: 250 })).toEqual({ unitRate: 250, totalCost: 625 });
    expect(calculateEstimateTotal([
      { quantity: 2, materialCost: 0, laborCost: 0, equipmentCost: 0, otherCost: 0, unitRate: 100 },
      { quantity: 4, materialCost: 10, laborCost: 5, equipmentCost: 0, otherCost: 0, unitRate: 0 },
    ])).toBe(260);
  });
});
