import { eq } from "drizzle-orm";
import { z } from "zod";
import { approvalRequests, auditLogs, collections, expenses, payroll, projectMembers, projects, sales, stages, units, users } from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { calculateExpenseTotals, calculatePayrollTotals, projectHealthReasons, projectHealthStatus } from "../erpCalculations";

const projectStatus = z.enum(["planning", "active", "paused", "completed", "archived"]);

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "قاعدة البيانات غير متاحة حاليًا" });
  return db;
}

async function getAllowedProjectIds(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, role: string) {
  if (role === "admin") return null;
  const rows = await db.select({ projectId: projectMembers.projectId }).from(projectMembers).where(eq(projectMembers.userId, userId));
  return new Set(rows.map((row) => row.projectId));
}

async function assertProjectAccess(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ctx: { user: { id: number; role: string } }, projectId: number) {
  const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
  if (allowed && !allowed.has(projectId)) throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية على هذا المشروع" });
}

export const erpRouter = router({
  users: router({
    list: adminProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, lastSignedIn: users.lastSignedIn }).from(users).orderBy(users.name);
    }),
  }),

  members: router({
    list: adminProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(projectMembers).orderBy(projectMembers.createdAt);
    }),
    assign: adminProcedure.input(z.object({ projectId: z.number().int().positive(), userId: z.number().int().positive(), projectRole: z.enum(["manager", "finance", "input", "reviewer", "viewer"]) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const result = await db.insert(projectMembers).values(input);
      await db.insert(auditLogs).values({ entityType: "projectMember", entityId: Number(result[0].insertId), action: "assigned", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id: Number(result[0].insertId) };
    }),
  }),

  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(projects).orderBy(projects.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.id)) : rows;
    }),
    create: protectedProcedure
      .input(z.object({
        code: z.string().trim().min(2).max(64),
        name: z.string().trim().min(2).max(255),
        location: z.string().trim().max(255).optional(),
        status: projectStatus.default("planning"),
        plannedStart: z.string().optional(),
        plannedEnd: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const result = await db.insert(projects).values({
          ...input,
          location: input.location || null,
          plannedStart: input.plannedStart ? new Date(input.plannedStart) : null,
          plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null,
          createdBy: ctx.user.id,
        });
        const projectId = Number(result[0].insertId);
        await db.insert(auditLogs).values({
          entityType: "project",
          entityId: projectId,
          action: "created",
          actorId: ctx.user.id,
          afterJson: JSON.stringify(input),
        });
        return { id: projectId };
      }),
  }),

  units: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(units).orderBy(units.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), code: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), type: z.string().max(128).optional(), listPrice: z.number().nonnegative() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const result = await db.insert(units).values({ projectId: input.projectId, code: input.code, name: input.name, type: input.type || null, listPrice: input.listPrice.toFixed(2), status: "available" });
        const unitId = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "unit", entityId: unitId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id: unitId };
      }),
  }),

  stages: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(stages).orderBy(stages.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), code: z.string().trim().min(1).max(64), name: z.string().trim().min(2).max(255), plannedBudget: z.number().nonnegative(), plannedStart: z.string().optional(), plannedEnd: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const result = await db.insert(stages).values({ projectId: input.projectId, code: input.code, name: input.name, plannedBudget: input.plannedBudget.toFixed(2), plannedStart: input.plannedStart ? new Date(input.plannedStart) : null, plannedEnd: input.plannedEnd ? new Date(input.plannedEnd) : null, actualProgress: "0", status: "planned" });
        const stageId = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "stage", entityId: stageId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id: stageId };
      }),
    updateProgress: protectedProcedure
      .input(z.object({ id: z.number().int().positive(), actualProgress: z.number().min(0).max(100), status: z.enum(["planned", "active", "completed", "delayed"]).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const stage = (await db.select().from(stages).where(eq(stages.id, input.id)).limit(1))[0];
        if (!stage) throw new TRPCError({ code: "NOT_FOUND", message: "المرحلة غير موجودة" });
        await assertProjectAccess(db, ctx, stage.projectId);
        const status = input.status || (input.actualProgress >= 100 ? "completed" : input.actualProgress > 0 ? "active" : "planned");
        await db.update(stages).set({ actualProgress: input.actualProgress.toFixed(2), status }).where(eq(stages.id, input.id));
        await db.insert(auditLogs).values({ entityType: "stage", entityId: input.id, action: "progress_updated", actorId: ctx.user.id, afterJson: JSON.stringify({ actualProgress: input.actualProgress, status }) });
        return { success: true } as const;
      }),
  }),

  dashboard: router({
    summary: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const [allProjectRows, stageRows, expenseRows, collectionRows, approvalRows] = await Promise.all([
        db.select().from(projects),
        db.select().from(stages),
        db.select().from(expenses),
        db.select().from(collections),
        db.select().from(approvalRequests),
      ]);
      const projectRows = allowed ? allProjectRows.filter((row) => allowed.has(row.id)) : allProjectRows;
      return projectRows.map((project) => {
        const projectStages = stageRows.filter((stage) => stage.projectId === project.id);
        const projectExpenses = expenseRows.filter((expense) => expense.projectId === project.id && ["approved", "posted"].includes(expense.status));
        const projectCollections = collectionRows.filter((collection) => collection.projectId === project.id && collection.status === "received");
        const projectApprovals = approvalRows.filter((approval) => approval.projectId === project.id && approval.status === "pending");
        const now = new Date();
        const approvalSlaMs = 3 * 24 * 60 * 60 * 1000;
        const overdueApprovals = projectApprovals.filter((approval) => approval.createdAt && now.getTime() - new Date(approval.createdAt).getTime() > approvalSlaMs).length;
        const overdueStages = projectStages.filter((stage) => stage.status !== "completed" && stage.plannedEnd && new Date(stage.plannedEnd) < now);
        const timeline = projectStages.reduce((acc, stage) => {
          const weight = Number(stage.plannedBudget || 0) || 1;
          const actualRatio = Math.min(1, Math.max(0, Number(stage.actualProgress || (stage.status === "completed" ? 100 : 0)) / 100));
          let expectedRatio = 0;
          if (stage.plannedStart && stage.plannedEnd) {
            const start = new Date(stage.plannedStart).getTime();
            const end = new Date(stage.plannedEnd).getTime();
            expectedRatio = end > start ? Math.min(1, Math.max(0, (now.getTime() - start) / (end - start))) : 0;
          }
          return { weight: acc.weight + weight, actual: acc.actual + actualRatio * weight, expected: acc.expected + expectedRatio * weight };
        }, { weight: 0, actual: 0, expected: 0 });
        const progress = timeline.weight ? Math.round((timeline.actual / timeline.weight) * 100) : 0;
        const expectedScheduleProgress = timeline.weight ? Math.round((timeline.expected / timeline.weight) * 100) : 0;
        const scheduleVariancePct = Math.max(expectedScheduleProgress - progress, 0);
        const planned = projectStages.reduce((sum, stage) => sum + Number(stage.plannedBudget || 0), 0);
        const actual = projectExpenses.reduce((sum, expense) => sum + Number(expense.totalAmount || 0), 0);
        const paid = projectExpenses.reduce((sum, expense) => sum + Number(expense.paidAmount || 0), 0);
        const collectionsReceived = projectCollections.reduce((sum, collection) => sum + Number(collection.amount || 0), 0);
        const cashGap = Math.max(paid - collectionsReceived, 0);
        const budgetUsage = planned ? Math.round((actual / planned) * 100) : 0;
        const delayedStages = projectStages.filter((stage) => stage.status === "delayed").length + overdueStages.length;
        const status = projectHealthStatus({ budgetUsage, progress, delayedStages, cashGapRatio: actual ? cashGap / actual : 0, pendingApprovals: projectApprovals.length, overdueApprovals, scheduleVariancePct });
        const reasons = projectHealthReasons({ budgetUsage, progress, delayedStages, cashGap, pendingApprovals: projectApprovals.length, overdueApprovals, scheduleVariancePct });
        return {
          project,
          plannedBudget: planned,
          actualCost: actual,
          paidCost: paid,
          outstandingCost: Math.max(actual - paid, 0),
          collectionsReceived,
          cashGap,
          pendingApprovals: projectApprovals.length,
          overdueApprovals,
          expectedScheduleProgress,
          scheduleVariancePct,
          progress,
          budgetUsage,
          status,
          reasons,
          stageCount: projectStages.length,
          delayedStages,
        };
      });
    }),
  }),

  expenses: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(expenses).orderBy(expenses.createdAt);
    }),
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().int().positive(),
        stageId: z.number().int().positive().optional(),
        description: z.string().trim().min(2),
        classification: z.enum(["project", "administrative"]).default("project"),
        preTaxAmount: z.number().nonnegative(),
        taxRate: z.number().min(0).max(100).default(15),
        paidAmount: z.number().nonnegative().default(0),
        expenseDate: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
        const taxRate = totals.taxRate;
        const taxAmount = totals.taxAmount;
        const totalAmount = totals.totalAmount;
        const result = await db.insert(expenses).values({
          projectId: input.projectId,
          stageId: input.stageId || null,
          description: input.description,
          classification: input.classification,
          preTaxAmount: input.preTaxAmount.toFixed(2),
          taxRate: taxRate.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paidAmount: input.paidAmount.toFixed(2),
          expenseDate: input.expenseDate ? new Date(input.expenseDate) : null,
          status: "pending",
          createdBy: ctx.user.id,
        });
        const expenseId = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "expense", entityId: expenseId, requestedBy: ctx.user.id, status: "pending" });
        await db.insert(auditLogs).values({
          entityType: "expense",
          entityId: expenseId,
          action: "created",
          actorId: ctx.user.id,
          afterJson: JSON.stringify({ ...input, taxAmount, totalAmount }),
        });
        return { id: expenseId, taxAmount, totalAmount };
      }),
  }),

  sales: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(sales).orderBy(sales.createdAt);
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), unitId: z.number().int().positive(), customerName: z.string().trim().min(2), customerPhone: z.string().max(64).optional(), saleDate: z.string().optional(), preTaxAmount: z.number().positive(), taxRate: z.number().min(0).max(100).default(15) }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
        const result = await db.insert(sales).values({ projectId: input.projectId, unitId: input.unitId, customerName: input.customerName, customerPhone: input.customerPhone || null, saleDate: input.saleDate ? new Date(input.saleDate) : null, preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), recognizedRevenue: totals.preTaxAmount.toFixed(2), status: "confirmed", createdBy: ctx.user.id });
        const saleId = Number(result[0].insertId);
        await db.update(units).set({ status: "sold" }).where(eq(units.id, input.unitId));
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "sale", entityId: saleId, requestedBy: ctx.user.id, status: "pending" });
        await db.insert(auditLogs).values({ entityType: "sale", entityId: saleId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, ...totals, recognizedRevenue: totals.preTaxAmount }) });
        return { id: saleId, recognizedRevenue: totals.preTaxAmount, totalAmount: totals.totalAmount };
      }),
  }),

  collections: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(collections).orderBy(collections.createdAt);
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), saleId: z.number().int().positive(), amount: z.number().positive(), receiptReference: z.string().max(128).optional(), collectionDate: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const result = await db.insert(collections).values({ projectId: input.projectId, saleId: input.saleId, amount: input.amount.toFixed(2), receiptReference: input.receiptReference || null, collectionDate: input.collectionDate ? new Date(input.collectionDate) : null, status: "received", createdBy: ctx.user.id });
        const collectionId = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "collection", entityId: collectionId, requestedBy: ctx.user.id, status: "pending" });
        await db.insert(auditLogs).values({ entityType: "collection", entityId: collectionId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id: collectionId };
      }),
  }),

  approvals: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(approvalRequests).orderBy(approvalRequests.createdAt);
    }),
    decide: adminProcedure
      .input(z.object({ id: z.number().int().positive(), decision: z.enum(["approved", "rejected"]), note: z.string().max(1000).optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const request = (await db.select().from(approvalRequests).where(eq(approvalRequests.id, input.id)).limit(1))[0];
        if (!request) throw new TRPCError({ code: "NOT_FOUND", message: "طلب الموافقة غير موجود" });
        await db.update(approvalRequests).set({ status: input.decision, reviewedBy: ctx.user.id, note: input.note || null, reviewedAt: new Date() }).where(eq(approvalRequests.id, input.id));
        const approved = input.decision === "approved";
        if (request.entityType === "expense") await db.update(expenses).set({ status: approved ? "approved" : "rejected" }).where(eq(expenses.id, request.entityId));
        if (request.entityType === "payroll") await db.update(payroll).set({ status: approved ? "approved" : "draft" }).where(eq(payroll.id, request.entityId));
        if (request.entityType === "sale") await db.update(sales).set({ status: approved ? "confirmed" : "cancelled" }).where(eq(sales.id, request.entityId));
        if (request.entityType === "collection") await db.update(collections).set({ status: approved ? "received" : "reversed" }).where(eq(collections.id, request.entityId));
        await db.insert(auditLogs).values({ entityType: "approval", entityId: input.id, action: input.decision, actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { success: true } as const;
      }),
  }),

  payroll: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(payroll).orderBy(payroll.createdAt);
    }),
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().int().positive(),
        employeeName: z.string().trim().min(2),
        employeeCode: z.string().trim().max(64).optional(),
        month: z.number().int().min(1).max(12),
        year: z.number().int().min(2000).max(2100),
        classification: z.enum(["project", "administrative"]).default("project"),
        amount: z.number().nonnegative(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const totals = calculatePayrollTotals(input.amount);
        const result = await db.insert(payroll).values({
          projectId: input.projectId,
          employeeName: input.employeeName,
          employeeCode: input.employeeCode || null,
          month: input.month,
          year: input.year,
          classification: input.classification,
          preTaxAmount: totals.preTaxAmount.toFixed(2),
          taxAmount: totals.taxAmount.toFixed(2),
          totalAmount: totals.totalAmount.toFixed(2),
          createdBy: ctx.user.id,
          status: "pending",
        });
        const payrollId = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "payroll", entityId: payrollId, requestedBy: ctx.user.id, status: "pending" });
        await db.insert(auditLogs).values({
          entityType: "payroll",
          entityId: payrollId,
          action: "created",
          actorId: ctx.user.id,
          afterJson: JSON.stringify({ ...input, ...totals }),
        });
        return { id: payrollId, taxAmount: totals.taxAmount, totalAmount: totals.totalAmount };
      }),
  }),
});
