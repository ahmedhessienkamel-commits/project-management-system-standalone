import { describe, expect, it } from "vitest";
import { calculateMaterialPlanning } from "./materialPlanning";

describe("رقابة كمية طلبات المواد", () => {
  it("يقبل طلب الخامة عندما يبقى ضمن الكمية المتعاقد عليها بعد الطلبات السابقة", () => {
    expect(calculateMaterialPlanning({ plannedQuantity: 100, requestedBeforeQuantity: 35, suppliedQuantity: 20, requestedQuantity: 40 })).toMatchObject({ status: "within_plan", remainingQuantity: 65, requestedAfterQuantity: 75, varianceQuantity: 0, isWithinPlan: true });
  });

  it("يرصد الزيادة عن المخطط بوضوح دون إخفاء الطلب", () => {
    expect(calculateMaterialPlanning({ plannedQuantity: 100, requestedBeforeQuantity: 70, suppliedQuantity: 55, requestedQuantity: 45 })).toMatchObject({ status: "over_plan", committedQuantity: 70, requestedAfterQuantity: 115, varianceQuantity: 15, isWithinPlan: false });
  });

  it("يصنف المادة التي لا تملك بند عقد أو كمية مخططة كغير مرتبطة بمخطط", () => {
    expect(calculateMaterialPlanning({ requestedQuantity: 12 })).toMatchObject({ status: "unplanned", plannedQuantity: 0, requestedAfterQuantity: 12, varianceQuantity: 12, isWithinPlan: false });
  });
});
