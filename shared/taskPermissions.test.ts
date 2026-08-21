import { describe, expect, it } from "vitest";
import { canAssignTeamTasks } from "./taskPermissions";

describe("team task assignment permissions", () => {
  it("allows only the owner and general manager", () => {
    expect(canAssignTeamTasks("admin")).toBe(true);
    expect(canAssignTeamTasks("general_manager")).toBe(true);
    expect(canAssignTeamTasks("project_manager")).toBe(false);
    expect(canAssignTeamTasks("procurement_manager")).toBe(false);
    expect(canAssignTeamTasks("user")).toBe(false);
  });
});
