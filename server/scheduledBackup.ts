import type { Request, Response } from "express";
import { sendDailyBackupEmail } from "./backupEmail";
import { authorizeScheduledRequest } from "./_core/schedulerAuth";

export async function scheduledBackupHandler(req: Request, res: Response) {
  const context = { url: req.originalUrl, timestamp: new Date().toISOString() };
  try {
    const schedule = await authorizeScheduledRequest(req);
    if (!schedule.allowed) return res.status(403).json({ error: "cron-only" });
    const result = await sendDailyBackupEmail();
    return res.json({ ok: true, taskUid: schedule.taskId, ...result });
  } catch (error) {
    console.error("[ScheduledBackup] failed", error);
    return res.status(500).json({ error: String(error), context });
  }
}
