import { describe, expect, it } from "vitest";
import { canViewPendingApproval } from "../shared/approvalVisibility";

describe("approval visibility", () => {
  it("allows management roles to monitor all pending workflows", () => {
    expect(canViewPendingApproval({ viewerId: 10, viewerRole: "admin", requesterId: 20, recipientIds: [30] })).toBe(true);
    expect(canViewPendingApproval({ viewerId: 10, viewerRole: "general_manager", requesterId: 20, recipientIds: [30] })).toBe(true);
  });

  it("allows the requester and current recipient", () => {
    expect(canViewPendingApproval({ viewerId: 20, viewerRole: "project_manager", requesterId: 20, recipientIds: [30] })).toBe(true);
    expect(canViewPendingApproval({ viewerId: 30, viewerRole: "project_manager", requesterId: 20, recipientIds: [30] })).toBe(true);
  });

  it("hides a workflow from unrelated users", () => {
    expect(canViewPendingApproval({ viewerId: 40, viewerRole: "user", requesterId: 20, recipientIds: [30] })).toBe(false);
  });
});
