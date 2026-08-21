export function canAssignTeamTasks(role: string): boolean {
  return role === "admin" || role === "general_manager";
}
