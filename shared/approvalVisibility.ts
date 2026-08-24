export type ApprovalViewerRole = "admin" | "general_manager" | "project_manager" | "user" | string;

export function canViewPendingApproval(input: {
  viewerId: number;
  viewerRole: ApprovalViewerRole;
  requesterId?: number | null;
  recipientIds: number[];
}) {
  if (input.viewerRole === "admin" || input.viewerRole === "general_manager") return true;
  return input.requesterId === input.viewerId || input.recipientIds.includes(input.viewerId);
}
