import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { approvalPolicies, approvalRequests, auditLogs, attendance, attachments, certificates, collections, custody, custodyMovements, employees, expenses, notifications, payroll, administrativePayroll, payrollAllocations, periodLocks, projectMembers, projects, sales, stages, units, users, vendors } from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { calculateDocumentCompleteness, calculateExpenseTotals, calculateFinancialSummaryTotals, calculatePayrollTotals, canAccessProject, canWriteProject, projectHealthReasons, projectHealthStatus, projectNotificationTriggers } from "../erpCalculations";

const projectStatus = z.enum(["planning", "active", "paused", "completed", "archived"]);
const projectClassification = z.enum(["operational", "administrative"]);

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
  if (!canAccessProject(ctx.user.role, allowed, projectId)) throw new TRPCError({ code: "FORBIDDEN", message: "ليس لديك صلاحية على هذا المشروع" });
}

async function assertProjectWrite(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ctx: { user: { id: number; role: string } }, projectId: number) {
  if (ctx.user.role === "admin") return;
  const member = (await db.select({ projectRole: projectMembers.projectRole }).from(projectMembers).where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, ctx.user.id))).limit(1))[0];
  if (!member || !canWriteProject(ctx.user.role, member.projectRole)) throw new TRPCError({ code: "FORBIDDEN", message: "دور المستخدم لا يسمح بتسجيل حركة جديدة في هذا المشروع" });
}

async function assertPeriodOpen(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, ctx: { user: { role: string } }, projectId: number, date: Date) {
  if (ctx.user.role === "admin") return;
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const matching = await db.select().from(periodLocks).where(eq(periodLocks.projectId, projectId));
  if (matching.some((lock) => lock.periodYear === year && lock.periodMonth === month)) throw new TRPCError({ code: "FORBIDDEN", message: "الفترة مقفلة ولا يمكن تسجيل حركة جديدة" });
}

async function notifyOnce(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, userId: number, type: string, title: string, message: string) {
  const existing = await db.select().from(notifications).where(eq(notifications.userId, userId));
  if (existing.some((note) => note.type === type && note.title === title && note.message === message && !note.readAt)) return;
  await db.insert(notifications).values({ userId, type, title, message });
}

async function findApprovalPolicy(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, projectId: number, entityType: "expense" | "payroll" | "certificate" | "collection" | "sale") {
  const rows = await db.select().from(approvalPolicies).where(eq(approvalPolicies.projectId, projectId));
  return rows.find((row) => row.projectId === projectId && row.entityType === entityType) ?? null;
}

async function resolveApprovalStatus(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, projectId: number, entityType: "expense" | "payroll" | "certificate" | "collection" | "sale", amount: number) {
  const policy = await findApprovalPolicy(db, projectId, entityType);
  return policy && amount <= Number(policy.thresholdAmount) ? "approved" as const : "pending" as const;
}

export const erpRouter = router({
  employees: router({
    list: protectedProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(employees).orderBy(employees.fullName);
    }),
    create: adminProcedure.input(z.object({ employeeCode: z.string().min(1), fullName: z.string().min(1), jobTitle: z.string().optional(), phone: z.string().optional(), nationalId: z.string().optional(), defaultProjectId: z.number().int().positive().nullable().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const result = await db.insert(employees).values({ ...input, jobTitle: input.jobTitle || null, phone: input.phone || null, nationalId: input.nationalId || null, defaultProjectId: input.defaultProjectId ?? null });
      await db.insert(auditLogs).values({ entityType: "employee", entityId: Number(result[0].insertId), action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id: Number(result[0].insertId) };
    }),
    updateStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["active", "inactive"]) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await db.update(employees).set({ status: input.status }).where(eq(employees.id, input.id));
      await db.insert(auditLogs).values({ entityType: "employee", entityId: input.id, action: "status_updated", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { success: true } as const;
    }),
  }),
  users: router({
    list: adminProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select({ id: users.id, name: users.name, email: users.email, role: users.role, lastSignedIn: users.lastSignedIn }).from(users).orderBy(users.name);
    }),
  }),

  members: router({
    mine: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      return db.select().from(projectMembers).where(eq(projectMembers.userId, ctx.user.id));
    }),
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
        classification: projectClassification.default("operational"),
        contractValue: z.number().nonnegative().default(0),
        plannedStart: z.string().optional(),
        plannedEnd: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const result = await db.insert(projects).values({
          ...input,
          contractValue: input.contractValue.toFixed(2),
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
      const [allProjectRows, stageRows, expenseRows, collectionRows, approvalRows, attachmentRows, salesRows, payrollRows, vendorRows, certificateRows, administrativePayrollRows, payrollAllocationRows] = await Promise.all([
        db.select().from(projects),
        db.select().from(stages),
        db.select().from(expenses),
        db.select().from(collections),
        db.select().from(approvalRequests),
        db.select().from(attachments),
        db.select().from(sales),
        db.select().from(payroll),
        db.select().from(vendors),
        db.select().from(certificates),
        db.select().from(administrativePayroll),
        db.select().from(payrollAllocations),
      ]);
      const projectRows = allowed ? allProjectRows.filter((row) => allowed.has(row.id)) : allProjectRows;
      const summary = projectRows.map((project) => {
        const projectStages = stageRows.filter((stage) => stage.projectId === project.id);
        const projectExpenses = expenseRows.filter((expense) => expense.projectId === project.id && expense.classification !== "administrative" && ["approved", "posted"].includes(expense.status));
        const projectCollections = collectionRows.filter((collection) => collection.projectId === project.id && collection.status === "received");
        const projectSales = salesRows.filter((sale) => sale.projectId === project.id && sale.status === "confirmed");
        const projectPayroll = payrollRows.filter((row) => row.projectId === project.id && row.classification !== "administrative" && ["approved", "posted"].includes(row.status));
        const administrativePayrollIds = new Set(administrativePayrollRows.filter((row) => ["approved", "paid"].includes(row.status)).map((row) => row.id));
        const projectAdministrativePayroll = payrollAllocationRows.filter((row) => row.projectId === project.id && administrativePayrollIds.has(row.administrativePayrollId));
        const projectApprovals = approvalRows.filter((approval) => approval.projectId === project.id && approval.status === "pending");
        const projectVendors = vendorRows.filter((vendor) => vendor.projectId === null || vendor.projectId === project.id);
        const projectAttachments = attachmentRows.filter((attachment) => attachment.projectId === project.id);
        const documentCompleteness = calculateDocumentCompleteness({ vendors: projectVendors, attachments: projectAttachments });
        const projectCertificates = certificateRows.filter((certificate) => certificate.projectId === project.id);
        const missingCertificateDocuments = projectCertificates.filter((certificate) => !certificate.vendorId || !projectAttachments.some((attachment) => attachment.entityType === "certificate" && attachment.entityId === certificate.id)).length;
        const paymentRequests = approvalRows.filter((approval) => approval.projectId === project.id && ["expense", "collection"].includes(approval.entityType));
        const missingPaymentDocuments = paymentRequests.filter((request) => !projectAttachments.some((attachment) => attachment.entityType === request.entityType && attachment.entityId === request.entityId)).length;
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
        const completedStageCount = projectStages.filter((stage) => stage.status === "completed" || Number(stage.actualProgress || 0) >= 100).length;
        const progress = projectStages.length ? Math.round((completedStageCount / projectStages.length) * 100) : 0;
        const expectedScheduleProgress = timeline.weight ? Math.round((timeline.expected / timeline.weight) * 100) : 0;
        const scheduleVariancePct = Math.max(expectedScheduleProgress - progress, 0);
        const planned = projectStages.reduce((sum, stage) => sum + Number(stage.plannedBudget || 0), 0);
        const activeStage = [...projectStages].sort((a, b) => (a.plannedStart ? new Date(a.plannedStart).getTime() : Number.MAX_SAFE_INTEGER) - (b.plannedStart ? new Date(b.plannedStart).getTime() : Number.MAX_SAFE_INTEGER)).find((stage) => stage.status !== "completed" && Number(stage.actualProgress || 0) < 100) ?? null;
        const financialTotals = calculateFinancialSummaryTotals({ sales: projectSales, collections: projectCollections, expenses: projectExpenses, payroll: [...projectPayroll, ...projectAdministrativePayroll.map((row) => ({ preTaxAmount: row.allocatedAmount, totalAmount: row.allocatedAmount, paidAmount: "0", status: "approved" as const }))] });
        const actual = financialTotals.expensesTotal + financialTotals.payrollTotal;
        const paid = financialTotals.expensesPaid + financialTotals.payrollPaid;
        const collectionsReceived = financialTotals.collectionsReceived;
        const recognizedRevenue = financialTotals.revenue;
        const payrollOutstanding = financialTotals.payrollOutstanding;
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
          recognizedRevenue,
          payrollOutstanding,
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
          missingDocumentCount: documentCompleteness.missing.length + missingCertificateDocuments + missingPaymentDocuments,
          activeStage: activeStage ? { id: activeStage.id, code: activeStage.code, name: activeStage.name, status: activeStage.status, plannedStart: activeStage.plannedStart, plannedEnd: activeStage.plannedEnd, actualProgress: Number(activeStage.actualProgress || 0) } : null,
        };
      });
      for (const item of summary) {
        const triggers = projectNotificationTriggers({ projectName: item.project.name, pendingApprovals: item.pendingApprovals, overdueApprovals: item.overdueApprovals, scheduleVariancePct: item.scheduleVariancePct, budgetUsage: item.budgetUsage, cashGap: item.cashGap, hasAttachments: attachmentRows.some((attachment) => attachment.projectId === item.project.id), missingDocumentCount: item.missingDocumentCount });
        for (const trigger of triggers) await notifyOnce(db, ctx.user.id, trigger.type, trigger.title, trigger.message);
      }
      return summary;
    }),
  }),

  expenses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(expenses).orderBy(expenses.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().int().positive(),
        stageId: z.number().int().positive().optional(),
        vendorId: z.number().int().positive().optional(),
        description: z.string().trim().min(2),
        unit: z.string().trim().max(64).optional(),
        quantity: z.number().nonnegative().default(1),
        expenseType: z.enum(["materials", "operating_tools", "equipment_rental", "contractor", "transport", "maintenance", "services", "operating", "administrative"]).default("operating"),
        classification: z.enum(["project", "administrative"]).default("project"),
        preTaxAmount: z.number().nonnegative(),
        taxRate: z.number().min(0).max(100).default(15),
        paidAmount: z.number().nonnegative().default(0),
        expenseDate: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
        await assertPeriodOpen(db, ctx, input.projectId, input.expenseDate ? new Date(input.expenseDate) : new Date());
        const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
        const approvalStatus = await resolveApprovalStatus(db, input.projectId, "expense", totals.preTaxAmount);
        const taxRate = totals.taxRate;
        const taxAmount = totals.taxAmount;
        const totalAmount = totals.totalAmount;
        const result = await db.insert(expenses).values({
          projectId: input.projectId,
          stageId: input.stageId || null,
          vendorId: input.vendorId || null,
          description: input.description,
          unit: input.unit || null,
          quantity: input.quantity.toFixed(3),
          expenseType: input.expenseType,
          classification: input.classification,
          preTaxAmount: input.preTaxAmount.toFixed(2),
          taxRate: taxRate.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          totalAmount: totalAmount.toFixed(2),
          paidAmount: input.paidAmount.toFixed(2),
          expenseDate: input.expenseDate ? new Date(input.expenseDate) : null,
          status: approvalStatus,
          createdBy: ctx.user.id,
        });
        const expenseId = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "expense", entityId: expenseId, requestedBy: ctx.user.id, status: approvalStatus });
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
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(sales).orderBy(sales.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), unitId: z.number().int().positive(), stageId: z.number().int().positive().optional(), customerName: z.string().trim().min(2), customerPhone: z.string().max(64).optional(), saleDate: z.string().optional(), preTaxAmount: z.number().positive(), taxRate: z.number().min(0).max(100).default(15) }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
        await assertPeriodOpen(db, ctx, input.projectId, input.saleDate ? new Date(input.saleDate) : new Date());
        if (input.stageId) {
          const stage = (await db.select().from(stages).where(eq(stages.id, input.stageId)).limit(1))[0];
          if (!stage || stage.projectId !== input.projectId) throw new TRPCError({ code: "BAD_REQUEST", message: "المرحلة لا تتبع المشروع المحدد" });
        }
        const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
        const approvalPolicy = await findApprovalPolicy(db, input.projectId, "sale");
        const approvalStatus = approvalPolicy && totals.preTaxAmount <= Number(approvalPolicy.thresholdAmount) ? "approved" as const : "pending" as const;
        const finalized = !approvalPolicy || approvalStatus === "approved";
        const result = await db.insert(sales).values({ projectId: input.projectId, unitId: input.unitId, stageId: input.stageId || null, customerName: input.customerName, customerPhone: input.customerPhone || null, saleDate: input.saleDate ? new Date(input.saleDate) : null, preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), recognizedRevenue: finalized ? totals.preTaxAmount.toFixed(2) : "0.00", status: finalized ? "confirmed" : "reserved", createdBy: ctx.user.id });
        const saleId = Number(result[0].insertId);
        await db.update(units).set({ status: finalized ? "sold" : "reserved" }).where(eq(units.id, input.unitId));
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "sale", entityId: saleId, requestedBy: ctx.user.id, status: approvalStatus });
        await db.insert(auditLogs).values({ entityType: "sale", entityId: saleId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, ...totals, recognizedRevenue: totals.preTaxAmount }) });
        return { id: saleId, recognizedRevenue: totals.preTaxAmount, totalAmount: totals.totalAmount };
      }),
  }),

  collections: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(collections).orderBy(collections.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure
      .input(z.object({ projectId: z.number().int().positive(), saleId: z.number().int().positive(), amount: z.number().positive(), receiptReference: z.string().max(128).optional(), collectionDate: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
        await assertPeriodOpen(db, ctx, input.projectId, input.collectionDate ? new Date(input.collectionDate) : new Date());
        const approvalPolicy = await findApprovalPolicy(db, input.projectId, "collection");
        const approvalStatus = approvalPolicy && input.amount <= Number(approvalPolicy.thresholdAmount) ? "approved" as const : "pending" as const;
        const finalized = !approvalPolicy || approvalStatus === "approved";
        const result = await db.insert(collections).values({ projectId: input.projectId, saleId: input.saleId, amount: input.amount.toFixed(2), receiptReference: input.receiptReference || null, collectionDate: input.collectionDate ? new Date(input.collectionDate) : null, status: finalized ? "received" : "draft", createdBy: ctx.user.id });
        const collectionId = Number(result[0].insertId);
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "collection", entityId: collectionId, requestedBy: ctx.user.id, status: approvalStatus });
        await db.insert(auditLogs).values({ entityType: "collection", entityId: collectionId, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id: collectionId };
      }),
  }),

  approvals: router({
    policies: router({
      list: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        const rows = await db.select().from(approvalPolicies).where(eq(approvalPolicies.projectId, input.projectId));
        return rows.filter((row) => row.projectId === input.projectId);
      }),
      upsert: adminProcedure.input(z.object({ projectId: z.number().int().positive(), entityType: z.enum(["expense", "payroll", "certificate", "collection", "sale"]), thresholdAmount: z.number().nonnegative() })).mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        const existingRows = await db.select().from(approvalPolicies).where(eq(approvalPolicies.projectId, input.projectId));
        const existing = existingRows.find((row) => row.projectId === input.projectId && row.entityType === input.entityType);
        if (existing) {
          await db.update(approvalPolicies).set({ thresholdAmount: input.thresholdAmount.toFixed(2), updatedBy: ctx.user.id }).where(eq(approvalPolicies.id, existing.id));
          await db.insert(auditLogs).values({ entityType: "approvalPolicy", entityId: existing.id, action: "updated", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
          return { id: existing.id, updated: true } as const;
        }
        const result = await db.insert(approvalPolicies).values({ projectId: input.projectId, entityType: input.entityType, thresholdAmount: input.thresholdAmount.toFixed(2), createdBy: ctx.user.id, updatedBy: ctx.user.id });
        const id = Number(result[0].insertId);
        await db.insert(auditLogs).values({ entityType: "approvalPolicy", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { id, updated: false } as const;
      }),
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(approvalRequests).orderBy(approvalRequests.createdAt);
      return allowed ? rows.filter((row) => row.projectId === null || allowed.has(row.projectId)) : rows;
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
        if (request.entityType === "certificate") await db.update(certificates).set({ status: approved ? "approved" : "rejected" }).where(eq(certificates.id, request.entityId));
        await db.insert(auditLogs).values({ entityType: "approval", entityId: input.id, action: input.decision, actorId: ctx.user.id, afterJson: JSON.stringify(input) });
        return { success: true } as const;
      }),
  }),

  payroll: router({
    createAdministrative: protectedProcedure.input(z.object({ employeeName: z.string().trim().min(1), employeeCode: z.string().trim().max(64).optional(), month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100), amount: z.number().positive(), paidAmount: z.number().nonnegative().default(0) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(projects).where(eq(projects.status, "active"));
      const visible = (allowed ? rows.filter((row) => allowed.has(row.id)) : rows).filter((row) => Number(row.contractValue || 0) > 0 && row.classification === "operational");
      const totalContractValue = visible.reduce((sum, row) => sum + Number(row.contractValue || 0), 0);
      if (!totalContractValue) throw new TRPCError({ code: "BAD_REQUEST", message: "لا توجد مشاريع نشطة بقيم عقود صالحة للتوزيع" });
      const inserted = await db.insert(administrativePayroll).values({ employeeName: input.employeeName, employeeCode: input.employeeCode || null, month: input.month, year: input.year, totalAmount: input.amount.toFixed(2), paidAmount: input.paidAmount.toFixed(2), createdBy: ctx.user.id, status: "pending" });
      const administrativePayrollId = Number(inserted[0].insertId);
      await db.insert(payrollAllocations).values(visible.map((project) => { const ratio = Number(project.contractValue || 0) / totalContractValue; return { administrativePayrollId, projectId: project.id, ratio: ratio.toFixed(6), allocatedAmount: (input.amount * ratio).toFixed(2) }; }));
      return { id: administrativePayrollId, allocations: visible.map((project) => { const ratio = Number(project.contractValue || 0) / totalContractValue; return { projectId: project.id, projectName: project.name, ratio, allocatedAmount: input.amount * ratio }; }) };
    }),
    administrativeList: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(administrativePayroll).orderBy(administrativePayroll.createdAt);
      const allocations = await db.select().from(payrollAllocations);
      return (allowed ? rows : rows).map((row) => ({ ...row, allocations: allocations.filter((allocation) => allocation.administrativePayrollId === row.id && (!allowed || allowed.has(allocation.projectId))) }));
    }),
    adminAllocationPreview: protectedProcedure.input(z.object({ amount: z.number().nonnegative() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(projects).where(eq(projects.status, "active"));
      const visible = (allowed ? rows.filter((row) => allowed.has(row.id)) : rows).filter((row) => Number(row.contractValue || 0) > 0);
      const totalContractValue = visible.reduce((sum, row) => sum + Number(row.contractValue || 0), 0);
      return visible.map((project) => { const ratio = totalContractValue ? Number(project.contractValue || 0) / totalContractValue : 0; return { projectId: project.id, projectName: project.name, contractValue: Number(project.contractValue || 0), ratio, allocatedAmount: input.amount * ratio }; });
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(payroll).orderBy(payroll.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    attendanceSummary: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), month: z.number().int().min(1).max(12), year: z.number().int().min(2000).max(2100) })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const rows = await db.select().from(attendance);
      const monthly = rows.filter((row) => {
        if (row.projectId !== input.projectId) return false;
        const date = new Date(row.attendanceDate);
        return date.getUTCFullYear() === input.year && date.getUTCMonth() + 1 === input.month;
      });
      return { total: monthly.length, present: monthly.filter((row) => row.status === "present").length, absent: monthly.filter((row) => row.status === "absent").length, late: monthly.filter((row) => row.status === "late").length, leave: monthly.filter((row) => row.status === "leave").length };
    }),
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().int().positive(),
        stageId: z.number().int().positive().optional(),
        employeeName: z.string().trim().min(2),
        employeeCode: z.string().trim().max(64).optional(),
        month: z.number().int().min(1).max(12),
        year: z.number().int().min(2000).max(2100),
        classification: z.enum(["project", "administrative"]).default("project"),
        amount: z.number().nonnegative(),
        paidAmount: z.number().nonnegative().default(0),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = requireDb(await getDb());
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
        await assertPeriodOpen(db, ctx, input.projectId, new Date(input.year, input.month - 1, 1));
        const totals = calculatePayrollTotals(input.amount);
        const result = await db.insert(payroll).values({
          projectId: input.projectId,
          stageId: input.stageId || null,
          employeeName: input.employeeName,
          employeeCode: input.employeeCode || null,
          month: input.month,
          year: input.year,
          classification: input.classification,
          preTaxAmount: totals.preTaxAmount.toFixed(2),
          taxAmount: totals.taxAmount.toFixed(2),
          totalAmount: totals.totalAmount.toFixed(2),
          paidAmount: Math.min(input.paidAmount, totals.totalAmount).toFixed(2),
          createdBy: ctx.user.id,
          status: "pending",
        });
        const payrollId = Number(result[0].insertId);
        const approvalStatus = await resolveApprovalStatus(db, input.projectId, "payroll", totals.totalAmount);
        if (approvalStatus === "approved") await db.update(payroll).set({ status: "approved" }).where(eq(payroll.id, payrollId));
        await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "payroll", entityId: payrollId, requestedBy: ctx.user.id, status: approvalStatus });
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

  vendors: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(vendors).orderBy(vendors.name);
      return allowed ? rows.filter((row) => !row.projectId || allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), name: z.string().trim().min(2), taxNumber: z.string().max(128).optional(), commercialRegistration: z.string().max(128).optional(), iban: z.string().max(128).optional(), contact: z.string().max(255).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.projectId) {
        await assertProjectAccess(db, ctx, input.projectId);
        await assertProjectWrite(db, ctx, input.projectId);
      }
      const result = await db.insert(vendors).values({ ...input, projectId: input.projectId || null, taxNumber: input.taxNumber || null, commercialRegistration: input.commercialRegistration || null, iban: input.iban || null, contact: input.contact || null });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "vendor", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
  }),

  certificates: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(certificates).orderBy(certificates.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), vendorId: z.number().int().positive().optional(), certificateNumber: z.string().trim().min(1), description: z.string().max(2000).optional(), preTaxAmount: z.number().nonnegative(), taxRate: z.number().min(0).max(100).default(15), paidAmount: z.number().nonnegative().default(0), certificateDate: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      await assertPeriodOpen(db, ctx, input.projectId, input.certificateDate ? new Date(input.certificateDate) : new Date());
      const totals = calculateExpenseTotals(input.preTaxAmount, input.taxRate);
      const result = await db.insert(certificates).values({ projectId: input.projectId, stageId: input.stageId || null, vendorId: input.vendorId || null, certificateNumber: input.certificateNumber, description: input.description || null, preTaxAmount: totals.preTaxAmount.toFixed(2), taxAmount: totals.taxAmount.toFixed(2), totalAmount: totals.totalAmount.toFixed(2), paidAmount: Math.min(input.paidAmount, totals.totalAmount).toFixed(2), status: "pending", certificateDate: input.certificateDate ? new Date(input.certificateDate) : null, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      const approvalStatus = await resolveApprovalStatus(db, input.projectId, "certificate", totals.totalAmount);
      if (approvalStatus === "approved") await db.update(certificates).set({ status: "approved" }).where(eq(certificates.id, id));
      await db.insert(approvalRequests).values({ projectId: input.projectId, entityType: "certificate", entityId: id, requestedBy: ctx.user.id, status: approvalStatus });
      await db.insert(auditLogs).values({ entityType: "certificate", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, ...totals }) });
      return { id, totalAmount: totals.totalAmount };
    }),
  }),

  custody: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(custody).orderBy(custody.createdAt);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), holderName: z.string().trim().min(2), issueDate: z.string().optional(), issuedAmount: z.number().nonnegative(), settledAmount: z.number().nonnegative().default(0) })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      const settled = Math.min(input.settledAmount, input.issuedAmount);
      const status = settled >= input.issuedAmount ? "settled" : settled > 0 ? "partially_settled" : "open";
      const result = await db.insert(custody).values({ projectId: input.projectId, stageId: input.stageId || null, holderName: input.holderName, issueDate: input.issueDate ? new Date(input.issueDate) : null, issuedAmount: input.issuedAmount.toFixed(2), settledAmount: settled.toFixed(2), status, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "custody", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id, outstanding: input.issuedAmount - settled };
    }),
    settle: protectedProcedure.input(z.object({ id: z.number().int().positive(), settledAmount: z.number().nonnegative() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const row = (await db.select().from(custody).where(eq(custody.id, input.id)).limit(1))[0];
      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "العهدة غير موجودة" });
      await assertProjectAccess(db, ctx, row.projectId);
      await assertProjectWrite(db, ctx, row.projectId);
      const settled = Math.min(input.settledAmount, Number(row.issuedAmount));
      const status = settled >= Number(row.issuedAmount) ? "settled" : settled > 0 ? "partially_settled" : "open";
      await db.update(custody).set({ settledAmount: settled.toFixed(2), status }).where(eq(custody.id, input.id));
      await db.insert(auditLogs).values({ entityType: "custody", entityId: input.id, action: "settled", actorId: ctx.user.id, afterJson: JSON.stringify({ settledAmount: settled, status }) });
      return { success: true, outstanding: Number(row.issuedAmount) - settled } as const;
    }),
  }),

  custodyMovements: router({
    list: protectedProcedure.input(z.object({ employeeCode: z.string().trim().min(1).optional(), projectId: z.number().int().positive().optional(), allocationType: z.enum(["project", "general_cash", "general_admin"]).optional() }).default({})).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(custodyMovements).orderBy(custodyMovements.movementDate, custodyMovements.createdAt);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      return rows.filter((row) => {
        if (row.projectId && allowed && !allowed.has(row.projectId)) return false;
        if (input.employeeCode && row.employeeCode !== input.employeeCode) return false;
        if (input.projectId && row.projectId !== input.projectId) return false;
        if (input.allocationType && row.allocationType !== input.allocationType) return false;
        return true;
      });
    }),
    statement: protectedProcedure.input(z.object({ employeeCode: z.string().trim().min(1), projectId: z.number().int().positive().optional(), allocationType: z.enum(["project", "general_cash", "general_admin"]).optional() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(custodyMovements).orderBy(custodyMovements.movementDate, custodyMovements.createdAt);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const filtered = rows.filter((row) => row.employeeCode === input.employeeCode && (!row.projectId || !allowed || allowed.has(row.projectId)) && (!input.projectId || row.projectId === input.projectId) && (!input.allocationType || row.allocationType === input.allocationType));
      let balance = 0;
      return filtered.map((row) => { balance += Number(row.signedAmount); return { ...row, balance }; });
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), stageId: z.number().int().positive().optional(), employeeCode: z.string().trim().min(1), employeeName: z.string().trim().min(2), movementType: z.enum(["issue", "spend", "return", "settlement"]), allocationType: z.enum(["project", "general_cash", "general_admin"]), description: z.string().trim().min(2), amount: z.number().positive(), movementDate: z.string().optional(), expenseType: z.string().trim().max(64).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.projectId) { await assertProjectAccess(db, ctx, input.projectId); await assertProjectWrite(db, ctx, input.projectId); await assertPeriodOpen(db, ctx, input.projectId, input.movementDate ? new Date(input.movementDate) : new Date()); }
      const signedAmount = ["issue", "return"].includes(input.movementType) ? input.amount : -input.amount;
      const result = await db.insert(custodyMovements).values({ projectId: input.projectId || null, stageId: input.stageId || null, employeeCode: input.employeeCode, employeeName: input.employeeName, movementType: input.movementType, allocationType: input.allocationType, description: input.description, amount: input.amount.toFixed(2), signedAmount: signedAmount.toFixed(2), movementDate: input.movementDate ? new Date(input.movementDate) : null, expenseType: input.expenseType || null, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "custodyMovement", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify({ ...input, signedAmount }) });
      return { id, signedAmount };
    }),
  }),

  attendance: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      const rows = await db.select().from(attendance).orderBy(attendance.attendanceDate);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), stageId: z.number().int().positive().optional(), employeeCode: z.string().max(64).optional(), employeeName: z.string().trim().min(2), attendanceDate: z.string(), checkIn: z.string().max(16).optional(), checkOut: z.string().max(16).optional(), status: z.enum(["present", "absent", "late", "leave"]).default("present"), notes: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      const result = await db.insert(attendance).values({ projectId: input.projectId, stageId: input.stageId || null, employeeCode: input.employeeCode || null, employeeName: input.employeeName, attendanceDate: new Date(input.attendanceDate), checkIn: input.checkIn || null, checkOut: input.checkOut || null, status: input.status, notes: input.notes || null });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "attendance", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
  }),

  attachments: router({
    list: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      return db.select().from(attachments).where(eq(attachments.projectId, input.projectId)).orderBy(attachments.createdAt);
    }),
    create: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), entityType: z.string().trim().min(1), entityId: z.number().int().positive(), documentType: z.string().trim().min(1), fileName: z.string().trim().min(1), fileUrl: z.string().url() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      await assertProjectWrite(db, ctx, input.projectId);
      const result = await db.insert(attachments).values({ ...input, createdBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "attachment", entityId: id, action: "created", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
  }),

  controls: router({
    trace: protectedProcedure.input(z.object({ projectId: z.number().int().positive().optional(), entityType: z.string().trim().min(1), entityId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      if (input.projectId) await assertProjectAccess(db, ctx, input.projectId);
      const [approvalRows, auditRows] = await Promise.all([
        db.select().from(approvalRequests).where(input.projectId
          ? and(eq(approvalRequests.projectId, input.projectId), eq(approvalRequests.entityType, input.entityType), eq(approvalRequests.entityId, input.entityId))
          : and(eq(approvalRequests.entityType, input.entityType), eq(approvalRequests.entityId, input.entityId))).orderBy(approvalRequests.createdAt),
        db.select().from(auditLogs).where(and(eq(auditLogs.entityType, input.entityType), eq(auditLogs.entityId, input.entityId))).orderBy(auditLogs.createdAt),
      ]);
      const supportedEntity = ["expense", "payroll", "certificate", "collection", "sale"].includes(input.entityType) ? input.entityType as "expense" | "payroll" | "certificate" | "collection" | "sale" : null;
      const policy = input.projectId && supportedEntity ? await findApprovalPolicy(db, input.projectId, supportedEntity) : null;
      return { approval: approvalRows[approvalRows.length - 1] || null, audits: auditRows, approvalPolicy: policy ? { entityType: policy.entityType, thresholdAmount: policy.thresholdAmount } : null };
    }),
    audit: adminProcedure.query(async () => {
      const db = requireDb(await getDb());
      return db.select().from(auditLogs).orderBy(auditLogs.createdAt);
    }),
    notifications: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      return db.select().from(notifications).where(eq(notifications.userId, ctx.user.id)).orderBy(notifications.createdAt);
    }),
    markNotificationRead: protectedProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await db.update(notifications).set({ readAt: new Date() }).where(eq(notifications.id, input.id));
      await db.insert(auditLogs).values({ entityType: "notification", entityId: input.id, action: "read", actorId: ctx.user.id, afterJson: JSON.stringify({ id: input.id }) });
      return { success: true } as const;
    }),
    locks: protectedProcedure.query(async ({ ctx }) => {
      const db = requireDb(await getDb());
      const rows = await db.select().from(periodLocks).orderBy(periodLocks.lockedAt);
      const allowed = await getAllowedProjectIds(db, ctx.user.id, ctx.user.role);
      return allowed ? rows.filter((row) => allowed.has(row.projectId)) : rows;
    }),
    lockPeriod: adminProcedure.input(z.object({ projectId: z.number().int().positive(), periodYear: z.number().int().min(2000).max(2100), periodMonth: z.number().int().min(1).max(12), reason: z.string().max(1000).optional() })).mutation(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const result = await db.insert(periodLocks).values({ ...input, reason: input.reason || null, lockedBy: ctx.user.id });
      const id = Number(result[0].insertId);
      await db.insert(auditLogs).values({ entityType: "periodLock", entityId: id, action: "locked", actorId: ctx.user.id, afterJson: JSON.stringify(input) });
      return { id };
    }),
  }),

  reports: router({
    costCenter: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [stageRows, expenseRows, payrollRows, custodyRows, certificateRows, collectionRows] = await Promise.all([
        db.select().from(stages).where(eq(stages.projectId, input.projectId)),
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(payroll).where(eq(payroll.projectId, input.projectId)),
        db.select().from(custody).where(eq(custody.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
        db.select().from(collections).where(eq(collections.projectId, input.projectId)),
      ]);
      return stageRows.map((stage) => {
        const stageExpenses = expenseRows.filter((row) => row.stageId === stage.id);
        const stagePayroll = payrollRows.filter((row) => row.stageId === stage.id);
        const stageCustody = custodyRows.filter((row) => row.stageId === stage.id);
        const stageCertificates = certificateRows.filter((row) => row.stageId === stage.id);
        return { stage, byType: stageExpenses.reduce<Record<string, { total: number; paid: number; outstanding: number }>>((acc, row) => { const key = row.expenseType || "operating"; const current = acc[key] || { total: 0, paid: 0, outstanding: 0 }; current.total += Number(row.totalAmount); current.paid += Number(row.paidAmount); current.outstanding += Math.max(Number(row.totalAmount) - Number(row.paidAmount), 0); acc[key] = current; return acc; }, {}), expenses: stageExpenses, payroll: stagePayroll, custody: stageCustody, certificates: stageCertificates, collections: collectionRows.filter((row) => row.status === "received") };
      });
    }),
    cashFlow: protectedProcedure.input(z.object({ projectId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [expenseRows, payrollRows, custodyRows, collectionRows, stageRows, salesRows, certificateRows] = await Promise.all([
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(payroll).where(eq(payroll.projectId, input.projectId)),
        db.select().from(custody).where(eq(custody.projectId, input.projectId)),
        db.select().from(collections).where(eq(collections.projectId, input.projectId)),
        db.select().from(stages).where(eq(stages.projectId, input.projectId)),
        db.select().from(sales).where(eq(sales.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
      ]);
      const cashOut = expenseRows.reduce((sum, row) => sum + (row.classification === "project" ? Number(row.paidAmount) : 0), 0) + payrollRows.reduce((sum, row) => sum + (row.classification === "project" ? Number(row.paidAmount) : 0), 0) + custodyRows.reduce((sum, row) => sum + Number(row.settledAmount), 0) + certificateRows.reduce((sum, row) => sum + Number(row.paidAmount), 0);
      const receivedCollections = collectionRows.filter((row) => row.status === "received");
      const cashIn = receivedCollections.reduce((sum, row) => sum + Number(row.amount), 0);
      let cumulativeGap = 0;
      const stageCashFlow: Array<{ stageId: number | null; stageName: string; cashIn: number; cashOut: number; net: number; cumulativeGap: number; fundingRequired: number; allocation: string }> = stageRows.map((stage) => {
        const stageOut = expenseRows.filter((row) => row.stageId === stage.id && row.classification === "project").reduce((sum, row) => sum + Number(row.paidAmount), 0) + payrollRows.filter((row) => row.stageId === stage.id && row.classification === "project").reduce((sum, row) => sum + Number(row.paidAmount), 0) + custodyRows.filter((row) => row.stageId === stage.id).reduce((sum, row) => sum + Number(row.settledAmount), 0) + certificateRows.filter((row) => row.stageId === stage.id).reduce((sum, row) => sum + Number(row.paidAmount), 0);
        const stageIn = receivedCollections.filter((collection) => salesRows.some((sale) => sale.id === collection.saleId && sale.stageId === stage.id)).reduce((sum, collection) => sum + Number(collection.amount), 0);
        cumulativeGap += stageOut - stageIn;
        return { stageId: stage.id, stageName: stage.name, cashIn: stageIn, cashOut: stageOut, net: stageIn - stageOut, cumulativeGap, fundingRequired: Math.max(cumulativeGap, 0), allocation: stageIn > 0 ? "stage-linked-sales-and-outflows" : "stage-linked-outflow" };
      });
      const unallocatedCashIn = receivedCollections.filter((collection) => !salesRows.some((sale) => sale.id === collection.saleId && sale.stageId)).reduce((sum, collection) => sum + Number(collection.amount), 0);
      if (unallocatedCashIn) {
        cumulativeGap -= unallocatedCashIn;
        stageCashFlow.push({ stageId: null, stageName: "غير مصنف — يحتاج ربطًا بمرحلة", cashIn: unallocatedCashIn, cashOut: 0, net: unallocatedCashIn, cumulativeGap, fundingRequired: Math.max(cumulativeGap, 0), allocation: "collections-unallocated-because-sales-unlinked-to-stage" });
      }
      return { cashIn, cashOut, net: cashIn - cashOut, fundingRequired: Math.max(cashOut - cashIn, 0), collections: collectionRows, expensePayments: expenseRows, payrollPayments: payrollRows, custodySettlements: custodyRows, certificatePayments: certificateRows, stages: stageCashFlow };
    }),
    supplierStatement: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), vendorId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [expenseRows, certificateRows] = await Promise.all([
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(certificates).where(eq(certificates.projectId, input.projectId)),
      ]);
      const vendorExpenses = expenseRows.filter((row) => row.vendorId === input.vendorId);
      const vendorCertificates = certificateRows.filter((row) => row.vendorId === input.vendorId);
      const debit = vendorExpenses.reduce((sum, row) => sum + Number(row.totalAmount), 0) + vendorCertificates.reduce((sum, row) => sum + Number(row.totalAmount), 0);
      const credit = vendorExpenses.reduce((sum, row) => sum + Number(row.paidAmount), 0) + vendorCertificates.reduce((sum, row) => sum + Number(row.paidAmount), 0);
      return { debit, credit, balance: debit - credit, expenses: vendorExpenses, certificates: vendorCertificates };
    }),
    financialSummary: protectedProcedure.input(z.object({ projectId: z.number().int().positive(), from: z.string().optional(), to: z.string().optional() })).query(async ({ ctx, input }) => {
      const db = requireDb(await getDb());
      await assertProjectAccess(db, ctx, input.projectId);
      const [salesRows, collectionRows, expenseRows, payrollRows] = await Promise.all([
        db.select().from(sales).where(eq(sales.projectId, input.projectId)),
        db.select().from(collections).where(eq(collections.projectId, input.projectId)),
        db.select().from(expenses).where(eq(expenses.projectId, input.projectId)),
        db.select().from(payroll).where(eq(payroll.projectId, input.projectId)),
      ]);
      const from = input.from ? new Date(input.from).getTime() : Number.NEGATIVE_INFINITY;
      const to = input.to ? new Date(input.to).getTime() + 86400000 : Number.POSITIVE_INFINITY;
      const inRange = (date: Date | null) => !date || (new Date(date).getTime() >= from && new Date(date).getTime() <= to);
      const scopedExpenses = expenseRows.filter((row) => row.classification !== "administrative" && inRange(row.expenseDate));
      const scopedPayroll = payrollRows.filter((row) => row.classification !== "administrative" && inRange(row.createdAt));
      const scopedSales = salesRows.filter((row) => inRange(row.saleDate));
      const scopedCollections = collectionRows.filter((row) => inRange(row.collectionDate));
      const totals = calculateFinancialSummaryTotals({ sales: scopedSales, collections: scopedCollections, expenses: scopedExpenses, payroll: scopedPayroll });
      return { ...totals, expenseRows: scopedExpenses, payrollRows: scopedPayroll, salesRows: scopedSales, collectionRows: scopedCollections };
    }),
  }),
});
