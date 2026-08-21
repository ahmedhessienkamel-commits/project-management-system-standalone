import type { Request, Response } from "express";
import { and, eq, gte } from "drizzle-orm";
import { getDb } from "./db";
import { sdk } from "./_core/sdk";
import { sendExecutiveDigestEmail, sendOverdueTaskEmail } from "./email";
import { approvalRequests, auditLogs, advanceRequests, dailyTasks, employees, leaveRequests, notifications, users } from "../drizzle/schema";

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

const managerRoles = ["admin", "general_manager"] as const;
const isManager = (role: string) => managerRoles.includes(role as (typeof managerRoles)[number]);
const dayKey = (value: Date | string | null | undefined) => value ? new Date(value).toISOString().slice(0, 10) : "";

export async function buildExecutiveSnapshot(db: Db, now = new Date()) {
  const [taskRows, employeeRows, approvalRows, leaveRows, advanceRows] = await Promise.all([
    db.select().from(dailyTasks),
    db.select({ id: employees.id, fullName: employees.fullName, employeeCode: employees.employeeCode, email: employees.email }).from(employees),
    db.select().from(approvalRequests),
    db.select().from(leaveRequests),
    db.select().from(advanceRequests),
  ]);
  const overdueTasks = taskRows.filter((task) => task.status !== "done" && task.status !== "cancelled" && task.dueDate && new Date(task.dueDate) < now);
  const pendingApprovals = approvalRows.filter((approval) => approval.status === "pending");
  const approvalAges = pendingApprovals.map((approval) => Math.max(0, now.getTime() - new Date(approval.createdAt).getTime()));
  const overdueApprovals = pendingApprovals.filter((approval) => now.getTime() - new Date(approval.createdAt).getTime() > 48 * 60 * 60 * 1000);
  const workload = employeeRows.map((employee) => {
    const employeeTasks = taskRows.filter((task) => task.assignedEmployeeId === employee.id);
    return { ...employee, total: employeeTasks.length, open: employeeTasks.filter((task) => task.status === "open").length, inProgress: employeeTasks.filter((task) => task.status === "in_progress").length, done: employeeTasks.filter((task) => task.status === "done").length, overdue: employeeTasks.filter((task) => overdueTasks.some((overdue) => overdue.id === task.id)).length };
  }).filter((employee) => employee.total > 0 || employee.overdue > 0).sort((a, b) => b.open + b.inProgress - (a.open + a.inProgress));
  return { workload, overdueTasks, pendingApprovals, overdueApprovals, averageApprovalHours: approvalAges.length ? approvalAges.reduce((sum, age) => sum + age, 0) / approvalAges.length / 3600000 : 0, pendingLeaves: leaveRows.filter((request) => request.status === "pending"), pendingAdvances: advanceRows.filter((request) => request.status === "pending") };
}

async function managerRecipients(db: Db) {
  const rows = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users);
  return rows.filter((row) => isManager(row.role));
}

export async function sendExecutiveDigest() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const snapshot = await buildExecutiveSnapshot(db);
  const recipients = await managerRecipients(db);
  const subject = `الملخص التنفيذي اليومي — ${dayKey(new Date())}`;
  await Promise.all(recipients.filter((recipient) => recipient.email).map((recipient) => sendExecutiveDigestEmail({ to: recipient.email!, recipientName: recipient.name, subject, snapshot })));
  return { recipients: recipients.length, overdueTasks: snapshot.overdueTasks.length, overdueApprovals: snapshot.overdueApprovals.length };
}

export async function alertOverdueTasks() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");
  const snapshot = await buildExecutiveSnapshot(db);
  const recipients = await managerRecipients(db);
  const today = dayKey(new Date());
  let alertsCreated = 0;
  for (const task of snapshot.overdueTasks) {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const existing = (await db.select({ id: notifications.id }).from(notifications).where(and(eq(notifications.type, "task_overdue"), eq(notifications.title, `مهمة متأخرة: ${task.title}`), gte(notifications.createdAt, startOfDay)))).some((row) => row.id);
    if (existing) continue;
    await Promise.all(recipients.map((recipient) => db.insert(notifications).values({ userId: recipient.id, type: "task_overdue", title: `مهمة متأخرة: ${task.title}`, message: `المهمة رقم ${task.id} تجاوزت موعد الاستحقاق المحدد.` })));
    const employee = task.assignedEmployeeId ? (await db.select({ email: employees.email, fullName: employees.fullName }).from(employees).where(eq(employees.id, task.assignedEmployeeId)).limit(1))[0] : undefined;
    if (employee?.email) await sendOverdueTaskEmail({ to: employee.email, recipientName: employee.fullName, taskTitle: task.title, dueDate: dayKey(task.dueDate) });
    alertsCreated += 1;
  }
  return { alertsCreated, checkedAt: today };
}

export async function executiveDigestHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    return res.json({ ok: true, taskUid: user.taskUid, ...(await sendExecutiveDigest()) });
  } catch (error) {
    console.error("[ExecutiveDigest] failed", error);
    return res.status(500).json({ error: String(error), context: { url: req.originalUrl, timestamp: new Date().toISOString() } });
  }
}

export async function overdueTaskAlertHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron || !user.taskUid) return res.status(403).json({ error: "cron-only" });
    return res.json({ ok: true, taskUid: user.taskUid, ...(await alertOverdueTasks()) });
  } catch (error) {
    console.error("[OverdueTaskAlert] failed", error);
    return res.status(500).json({ error: String(error), context: { url: req.originalUrl, timestamp: new Date().toISOString() } });
  }
}

export async function listExecutiveAudit(db: Db, limit = 100) {
  return db.select().from(auditLogs).orderBy(auditLogs.createdAt).limit(limit);
}
