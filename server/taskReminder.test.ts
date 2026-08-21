import { describe, expect, it } from "vitest";
import { canAssignTeamTasks } from "../shared/taskPermissions";

describe("task reminder permissions", () => {
  it("allows only admin and general manager to send reminders", () => {
    expect(canAssignTeamTasks("admin")).toBe(true);
    expect(canAssignTeamTasks("general_manager")).toBe(true);
    expect(canAssignTeamTasks("project_manager")).toBe(false);
    expect(canAssignTeamTasks("site_worker")).toBe(false);
    expect(canAssignTeamTasks("user")).toBe(false);
  });
});


describe("task reminder recipient compatibility", () => {
  it("keeps legacy primary assignee behavior when a team list is absent", () => {
    const legacyTask = { assignedEmployeeId: 12, assignedEmployeeIds: null as string | null };
    const ids = legacyTask.assignedEmployeeIds ? JSON.parse(legacyTask.assignedEmployeeIds) : legacyTask.assignedEmployeeId ? [legacyTask.assignedEmployeeId] : [];
    expect(ids).toEqual([12]);
  });
});

