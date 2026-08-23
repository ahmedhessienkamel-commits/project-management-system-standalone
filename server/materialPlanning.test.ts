import { describe, expect, it } from "vitest";
import { calculateMaterialPlanning } from "../shared/materialPlanning";

describe("مراقبة طلب مواد مقابل المخطط", () => {
  it("يحسب الرصيد المخطط المتاح بعد الطلبات السابقة", () => {
    expect(calculateMaterialPlanning({ plannedQuantity: 100, requestedBeforeQuantity: 35, suppliedQuantity: 20, requestedQuantity: 40 })).toMatchObject({ status: "within_plan", remainingQuantity: 65, requestedAfterQuantity: 75, varianceQuantity: 0, isWithinPlan: true });
  });

  it("يعلّم الزيادة كطلب يتجاوز المخطط مع إظهار فرق الكمية", () => {
    expect(calculateMaterialPlanning({ plannedQuantity: 100, requestedBeforeQuantity: 70, suppliedQuantity: 55, requestedQuantity: 45 })).toMatchObject({ status: "over_plan", committedQuantity: 70, requestedAfterQuantity: 115, varianceQuantity: 15, isWithinPlan: false });
  });

  it("لا يتظاهر بوجود مخطط عند غياب عقد خامة مرتبط", () => {
    expect(calculateMaterialPlanning({ requestedQuantity: 12 })).toMatchObject({ status: "unplanned", plannedQuantity: 0, requestedAfterQuantity: 12, varianceQuantity: 12, isWithinPlan: false });
  });
});
