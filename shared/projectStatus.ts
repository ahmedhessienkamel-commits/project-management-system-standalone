export type ProjectActivityInput = {
  status?: string | null;
  plannedStart?: string | Date | null;
  plannedEnd?: string | Date | null;
};

export function isProjectActive(project: ProjectActivityInput, now = new Date()) {
  if (["paused", "completed", "archived"].includes(String(project.status))) return false;
  if (project.status === "active") return true;
  if (!project.plannedStart || !project.plannedEnd) return false;
  const nowTime = now.getTime();
  const start = new Date(project.plannedStart).getTime();
  const end = new Date(project.plannedEnd).getTime();
  return start <= nowTime && nowTime <= end;
}
