export type MaterialPlanningStatus = "within_plan" | "over_plan" | "unplanned";

export type MaterialPlanningInput = {
  plannedQuantity?: number | null;
  requestedBeforeQuantity?: number | null;
  suppliedQuantity?: number | null;
  requestedQuantity: number;
};

export function calculateMaterialPlanning(input: MaterialPlanningInput) {
  const plannedQuantity = Math.max(Number(input.plannedQuantity || 0), 0);
  const requestedBeforeQuantity = Math.max(Number(input.requestedBeforeQuantity || 0), 0);
  const suppliedQuantity = Math.max(Number(input.suppliedQuantity || 0), 0);
  const requestedQuantity = Math.max(Number(input.requestedQuantity || 0), 0);
  if (!plannedQuantity) {
    return { status: "unplanned" as const, plannedQuantity: 0, committedQuantity: Math.max(requestedBeforeQuantity, suppliedQuantity), remainingQuantity: 0, requestedAfterQuantity: requestedQuantity, varianceQuantity: requestedQuantity, isWithinPlan: false };
  }
  const committedQuantity = Math.max(requestedBeforeQuantity, suppliedQuantity);
  const requestedAfterQuantity = committedQuantity + requestedQuantity;
  const remainingQuantity = Math.max(plannedQuantity - committedQuantity, 0);
  const varianceQuantity = Math.max(requestedAfterQuantity - plannedQuantity, 0);
  return { status: (varianceQuantity > 0 ? "over_plan" : "within_plan") as MaterialPlanningStatus, plannedQuantity, committedQuantity, remainingQuantity, requestedAfterQuantity, varianceQuantity, isWithinPlan: varianceQuantity === 0 };
}
