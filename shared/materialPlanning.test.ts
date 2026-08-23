import { describe, expect, it } from "vitest";
import { calculateMaterialPlanning } from "./materialPlanning";

describe("calculateMaterialPlanning", () => {
  it("marks a request within the contracted quantity", () => {
    expect(calculateMaterialPlanning({ plannedQuantity: 100, requestedBeforeQuantity: 20, suppliedQuantity: 10, requestedQuantity: 30 })).toMatchObject({ status: "within_plan", remainingQuantity: 80, requestedAfterQuantity: 50, varianceQuantity: 0 });
  });

  it("flags a request that exceeds the plan", () => {
    expect(calculateMaterialPlanning({ plannedQuantity: 100, requestedBeforeQuantity: 90, requestedQuantity: 20 })).toMatchObject({ status: "over_plan", remainingQuantity: 10, requestedAfterQuantity: 110, varianceQuantity: 10 });
  });

  it("keeps unplanned requests visible for review", () => {
    expect(calculateMaterialPlanning({ requestedQuantity: 7 })).toMatchObject({ status: "unplanned", plannedQuantity: 0, varianceQuantity: 7, isWithinPlan: false });
  });
});
