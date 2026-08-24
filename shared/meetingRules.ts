export function canManageMeetings(role?: string | null) {
  return role === "general_manager";
}

export function isValidMeetingWindow(start: Date, end: Date) {
  return Number.isFinite(start.getTime()) && Number.isFinite(end.getTime()) && end.getTime() > start.getTime();
}
