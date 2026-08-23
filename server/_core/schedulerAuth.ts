import { timingSafeEqual } from "node:crypto";
import type { Request } from "express";

function secureEquals(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function authorizeScheduledRequest(req: Request): Promise<{ allowed: boolean; taskId: string }> {
  const expected = process.env.SCHEDULE_SECRET;
  const supplied = req.header("x-schedule-secret") || req.header("authorization")?.replace(/^Bearer\s+/i, "");
  return { allowed: Boolean(expected && supplied && secureEquals(expected, supplied)), taskId: "external-schedule" };
}
