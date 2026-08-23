import { afterEach, describe, expect, it } from "vitest";
import type { Request } from "express";
import { getAuthMode, isLocalAuthMode } from "./_core/runtimeMode";
import { authorizeScheduledRequest } from "./_core/schedulerAuth";

const originalAuthMode = process.env.AUTH_MODE;
const originalScheduleSecret = process.env.SCHEDULE_SECRET;

afterEach(() => {
  if (originalAuthMode === undefined) delete process.env.AUTH_MODE;
  else process.env.AUTH_MODE = originalAuthMode;
  if (originalScheduleSecret === undefined) delete process.env.SCHEDULE_SECRET;
  else process.env.SCHEDULE_SECRET = originalScheduleSecret;
});

function requestWithHeaders(headers: Record<string, string>): Request {
  return { header: (name: string) => headers[name.toLowerCase()] } as unknown as Request;
}

describe("وضع التشغيل المستقل", () => {
  it("يثبت وضع Local حتى لو بقي متغير قديم من بيئة سابقة", () => {
    process.env.AUTH_MODE = "local";
    expect(getAuthMode()).toBe("local");
    expect(isLocalAuthMode()).toBe(true);
    process.env.AUTH_MODE = "legacy";
    expect(getAuthMode()).toBe("local");
  });

  it("يتحقق من سر الجدولة الخارجي بدون SDK", async () => {
    process.env.AUTH_MODE = "local";
    process.env.SCHEDULE_SECRET = "schedule-test-secret";
    await expect(authorizeScheduledRequest(requestWithHeaders({ "x-schedule-secret": "schedule-test-secret" }))).resolves.toMatchObject({ allowed: true, taskId: "external-schedule" });
    await expect(authorizeScheduledRequest(requestWithHeaders({ "x-schedule-secret": "wrong" }))).resolves.toMatchObject({ allowed: false });
  });
});
