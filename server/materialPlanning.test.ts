import { describe, expect, it } from "vitest";
import { calculateMaterialPlanning } from "../shared/materialPlanning";
import { normalizeMysqlValue } from "../scripts/portable-data-helpers.mjs";

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

  it("normalizes JSON export dates for MySQL date and timestamp columns", () => {
    expect(normalizeMysqlValue("2026-08-20T00:00:00.000Z", "date")).toBe("2026-08-20");
    expect(normalizeMysqlValue("2026-08-20T13:37:49.000Z", "timestamp")).toBe("2026-08-20 13:37:49");
  });
});
