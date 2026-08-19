import { sql } from "drizzle-orm";
import { z } from "zod";
import {
  accounts,
  accountingDocumentLines,
  accountingDocuments,
  administrativePayroll,
  approvalPolicies,
  approvalRequests,
  attendance,
  attachments,
  cashAccounts,
  certificates,
  collections,
  companyProfiles,
  costItems,
  custody,
  custodyMovements,
  dailyTasks,
  employees,
  expenses,
  fixedAssetDepreciation,
  fixedAssets,
  materialRequisitionItems,
  materialRequisitions,
  notifications,
  payroll,
  payrollAllocations,
  periodLocks,
  projectMembers,
  projects,
  purchaseOrderItems,
  purchaseOrders,
  purchaseReceiptItems,
  purchaseReceipts,
  sales,
  stages,
  units,
  users,
  vendors,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

const BACKUP_VERSION = 1;

// The order follows the schema's parent-to-child relationships. Users are exported
// without credentials or session data; authentication is always managed by Manus.
const backupTables = [
  ["users", users],
  ["projects", projects],
  ["projectMembers", projectMembers],
  ["stages", stages],
  ["vendors", vendors],
  ["employees", employees],
  ["companyProfiles", companyProfiles],
  ["cashAccounts", cashAccounts],
  ["accounts", accounts],
  ["costItems", costItems],
  ["units", units],
  ["sales", sales],
  ["collections", collections],
  ["expenses", expenses],
  ["payroll", payroll],
  ["administrativePayroll", administrativePayroll],
  ["payrollAllocations", payrollAllocations],
  ["certificates", certificates],
  ["custody", custody],
  ["custodyMovements", custodyMovements],
  ["attendance", attendance],
  ["attachments", attachments],
  ["dailyTasks", dailyTasks],
  ["periodLocks", periodLocks],
  ["materialRequisitions", materialRequisitions],
  ["materialRequisitionItems", materialRequisitionItems],
  ["purchaseOrders", purchaseOrders],
  ["purchaseOrderItems", purchaseOrderItems],
  ["purchaseReceipts", purchaseReceipts],
  ["purchaseReceiptItems", purchaseReceiptItems],
  ["approvalPolicies", approvalPolicies],
  ["approvalRequests", approvalRequests],
  ["accountingDocuments", accountingDocuments],
  ["accountingDocumentLines", accountingDocumentLines],
  ["fixedAssets", fixedAssets],
  ["fixedAssetDepreciation", fixedAssetDepreciation],
] as const;

const tableByName = new Map(backupTables.map(([name, table]) => [name, table]));
const restoreTables = backupTables.filter(([name]) => name !== "users");
const backupInput = z.object({
  format: z.literal("meta-ads-erp-backup"),
  version: z.number().int().positive(),
  generatedAt: z.string().min(1),
  tables: z.record(z.string(), z.array(z.record(z.string(), z.unknown()))),
});

export function validateBackupDocument(value: unknown) {
  return backupInput.parse(value);
}

function requireDb(db: Awaited<ReturnType<typeof getDb>>) {
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "قاعدة البيانات غير متاحة حاليًا" });
  return db;
}

export async function createBackupDocument() {
  const db = requireDb(await getDb());
  const entries = await Promise.all(
    backupTables.map(async ([name, table]) => [name, await db.select().from(table as never)] as const),
  );
  return {
    format: "meta-ads-erp-backup" as const,
    version: BACKUP_VERSION,
    generatedAt: new Date().toISOString(),
    note: "نسخة بيانات تشغيلية. لا تتضمن كلمات المرور أو الجلسات أو مفاتيح الأسرار.",
    tables: Object.fromEntries(entries),
  };
}

export const backupRouter = router({
  export: adminProcedure.query(createBackupDocument),

  restore: adminProcedure.input(backupInput).mutation(async ({ input }) => {
    if (input.version !== BACKUP_VERSION) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "إصدار ملف النسخة الاحتياطية غير مدعوم" });
    }
    const db = requireDb(await getDb());
    const missing = Object.keys(input.tables).filter((name) => !tableByName.has(name as typeof backupTables[number][0]));
    if (missing.length) throw new TRPCError({ code: "BAD_REQUEST", message: `يحتوي الملف على جداول غير معروفة: ${missing.join(", ")}` });
    const tx = await db.transaction(async (transaction) => {
      await transaction.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 0"));
      try {
        for (const [, table] of [...restoreTables].reverse()) await transaction.delete(table as never);
        for (const [name, table] of restoreTables) {
          const rows = input.tables[name];
          if (rows?.length) await transaction.insert(table as never).values(rows as never);
        }
      } finally {
        await transaction.execute(sql.raw("SET FOREIGN_KEY_CHECKS = 1"));
      }
      return { restoredTables: Object.keys(input.tables), generatedAt: input.generatedAt };
    });
    return { success: true, ...tx };
  }),
});
