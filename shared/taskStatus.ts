export type TaskStatus = "open" | "planned" | "in_progress" | "blocked" | "review" | "done" | "cancelled";

export function isArchivedTaskStatus(status: string): boolean {
  return status === "done" || status === "cancelled";
}

export function taskStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    open: "لم تبدأ",
    planned: "مخططة",
    in_progress: "قيد التنفيذ",
    blocked: "متوقفة",
    review: "للمراجعة",
    done: "مكتملة",
    cancelled: "ملغاة",
  };
  return labels[status] || status;
}
