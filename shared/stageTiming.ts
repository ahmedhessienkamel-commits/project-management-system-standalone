export type StageTimeStatus = "completed" | "delayed" | "on_time";

export function calculateStageTimeVariance(plannedEnd: Date | string | null | undefined, status: string, now: Date = new Date()): { timeVarianceDays: number; timeStatus: StageTimeStatus } {
  const endTime = plannedEnd ? new Date(plannedEnd).getTime() : null;
  const completed = status === "completed";
  const varianceDays = endTime && !completed ? Math.max(0, Math.ceil((now.getTime() - endTime) / 86400000)) : 0;
  return { timeVarianceDays: varianceDays, timeStatus: completed ? "completed" : varianceDays > 0 ? "delayed" : "on_time" };
}
