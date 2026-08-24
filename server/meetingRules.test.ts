import { describe, expect, it } from "vitest";
import { canManageMeetings, isValidMeetingWindow } from "../shared/meetingRules";

describe("meeting rules", () => {
  it("limits creation and status changes to the general manager", () => {
    expect(canManageMeetings("general_manager")).toBe(true);
    expect(canManageMeetings("admin")).toBe(false);
    expect(canManageMeetings("user")).toBe(false);
  });

  it("accepts only a valid chronological window", () => {
    const start = new Date("2026-08-25T09:00:00Z");
    expect(isValidMeetingWindow(start, new Date("2026-08-25T10:00:00Z"))).toBe(true);
    expect(isValidMeetingWindow(start, start)).toBe(false);
    expect(isValidMeetingWindow(start, new Date("2026-08-25T08:59:00Z"))).toBe(false);
  });
});
