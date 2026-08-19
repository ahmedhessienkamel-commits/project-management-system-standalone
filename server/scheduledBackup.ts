import type { Request, Response } from "express";
import { sdk } from "./_core/sdk";
import { sendDailyBackupEmail } from "./backupEmail";

export async function scheduledBackupHandler(req: Request, res: Response) {
  const context = { url: req.originalUrl, timestamp: new Date().toISOString() };
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    const result = await sendDailyBackupEmail();
    return res.json({ ok: true, taskUid: user.taskUid, ...result });
  } catch (error) {
    console.error("[ScheduledBackup] failed", error);
    return res.status(500).json({ error: String(error), context });
  }
}
