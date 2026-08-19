import {
  date,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["planning", "active", "paused", "completed", "archived"]).default("planning").notNull(),
  classification: mysqlEnum("classification", ["operational", "administrative"]).default("operational").notNull(),
  contractValue: decimal("contractValue", { precision: 14, scale: 2 }).default("0").notNull(),
  location: varchar("location", { length: 255 }),
  plannedStart: date("plannedStart"),
  plannedEnd: date("plannedEnd"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const projectMembers = mysqlTable("projectMembers", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  projectRole: mysqlEnum("projectRole", ["manager", "finance", "input", "reviewer", "viewer"]).default("viewer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const stages = mysqlTable("stages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  code: varchar("code", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["planned", "active", "completed", "delayed"]).default("planned").notNull(),
  plannedBudget: decimal("plannedBudget", { precision: 14, scale: 2 }).default("0").notNull(),
  plannedStart: date("plannedStart"),
  plannedEnd: date("plannedEnd"),
  actualProgress: decimal("actualProgress", { precision: 5, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  name: varchar("name", { length: 255 }).notNull(),
  taxNumber: varchar("taxNumber", { length: 128 }),
  commercialRegistration: varchar("commercialRegistration", { length: 128 }),
  iban: varchar("iban", { length: 128 }),
  contact: varchar("contact", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const expenses = mysqlTable("expenses", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  vendorId: int("vendorId"),
  reference: varchar("reference", { length: 128 }),
  description: text("description").notNull(),
  unit: varchar("unit", { length: 64 }),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).default("1").notNull(),
  expenseType: varchar("expenseType", { length: 64 }).default("operating").notNull(),
  classification: mysqlEnum("classification", ["project", "administrative"]).default("project").notNull(),
  preTaxAmount: decimal("preTaxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  taxRate: decimal("taxRate", { precision: 5, scale: 2 }).default("15").notNull(),
  taxAmount: decimal("taxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  paidAmount: decimal("paidAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "pending", "approved", "rejected", "posted"]).default("draft").notNull(),
  expenseDate: date("expenseDate"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const approvalRequests = mysqlTable("approvalRequests", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: int("entityId").notNull(),
  requestedBy: int("requestedBy").notNull(),
  reviewedBy: int("reviewedBy"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: int("entityId").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  actorId: int("actorId").notNull(),
  beforeJson: text("beforeJson"),
  afterJson: text("afterJson"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;
export type Stage = typeof stages.$inferSelect;
export type InsertStage = typeof stages.$inferInsert;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;
export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = typeof expenses.$inferInsert;
export type AdministrativePayroll = typeof administrativePayroll.$inferSelect;
export type PayrollAllocation = typeof payrollAllocations.$inferSelect;
export type CustodyMovement = typeof custodyMovements.$inferSelect;
export type InsertCustodyMovement = typeof custodyMovements.$inferInsert;

export const units = mysqlTable("units", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  code: varchar("code", { length: 64 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 128 }),
  status: mysqlEnum("status", ["available", "reserved", "sold", "cancelled"]).default("available").notNull(),
  listPrice: decimal("listPrice", { precision: 14, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  unitId: int("unitId").notNull(),
  stageId: int("stageId"),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 64 }),
  saleDate: date("saleDate"),
  preTaxAmount: decimal("preTaxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  taxAmount: decimal("taxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  recognizedRevenue: decimal("recognizedRevenue", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "reserved", "confirmed", "cancelled"]).default("draft").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const collections = mysqlTable("collections", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  saleId: int("saleId").notNull(),
  receiptReference: varchar("receiptReference", { length: 128 }),
  collectionDate: date("collectionDate"),
  amount: decimal("amount", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "received", "reversed"]).default("draft").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payroll = mysqlTable("payroll", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  employeeCode: varchar("employeeCode", { length: 64 }),
  month: int("month").notNull(),
  year: int("year").notNull(),
  classification: mysqlEnum("classification", ["project", "administrative"]).default("project").notNull(),
  preTaxAmount: decimal("preTaxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  taxAmount: decimal("taxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  paidAmount: decimal("paidAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "pending", "approved", "paid"]).default("draft").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const administrativePayroll = mysqlTable("administrativePayroll", {
  id: int("id").autoincrement().primaryKey(),
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  employeeCode: varchar("employeeCode", { length: 64 }),
  month: int("month").notNull(),
  year: int("year").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  paidAmount: decimal("paidAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "pending", "approved", "paid"]).default("pending").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const payrollAllocations = mysqlTable("payrollAllocations", {
  id: int("id").autoincrement().primaryKey(),
  administrativePayrollId: int("administrativePayrollId").notNull(),
  projectId: int("projectId").notNull(),
  ratio: decimal("ratio", { precision: 8, scale: 6 }).notNull(),
  allocatedAmount: decimal("allocatedAmount", { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  vendorId: int("vendorId"),
  certificateNumber: varchar("certificateNumber", { length: 128 }).notNull(),
  description: text("description"),
  preTaxAmount: decimal("preTaxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  taxAmount: decimal("taxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  paidAmount: decimal("paidAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "pending", "approved", "rejected", "paid"]).default("draft").notNull(),
  certificateDate: date("certificateDate"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const custody = mysqlTable("custody", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  holderName: varchar("holderName", { length: 255 }).notNull(),
  issueDate: date("issueDate"),
  issuedAmount: decimal("issuedAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  settledAmount: decimal("settledAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["open", "partially_settled", "settled"]).default("open").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const custodyMovements = mysqlTable("custodyMovements", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  stageId: int("stageId"),
  employeeCode: varchar("employeeCode", { length: 64 }).notNull(),
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  movementType: mysqlEnum("movementType", ["issue", "spend", "return", "settlement"]).notNull(),
  allocationType: mysqlEnum("allocationType", ["project", "general_cash", "general_admin"]).notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).default("0").notNull(),
  signedAmount: decimal("signedAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  movementDate: date("movementDate"),
  expenseType: varchar("expenseType", { length: 64 }),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const attendance = mysqlTable("attendance", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  employeeCode: varchar("employeeCode", { length: 64 }),
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  attendanceDate: date("attendanceDate").notNull(),
  checkIn: varchar("checkIn", { length: 16 }),
  checkOut: varchar("checkOut", { length: 16 }),
  status: mysqlEnum("status", ["present", "absent", "late", "leave"]).default("present").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const attachments = mysqlTable("attachments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  entityType: varchar("entityType", { length: 64 }).notNull(),
  entityId: int("entityId").notNull(),
  documentType: varchar("documentType", { length: 128 }).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const periodLocks = mysqlTable("periodLocks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  periodYear: int("periodYear").notNull(),
  periodMonth: int("periodMonth").notNull(),
  lockedBy: int("lockedBy").notNull(),
  lockedAt: timestamp("lockedAt").defaultNow().notNull(),
  reason: text("reason"),
});

export const approvalPolicies = mysqlTable("approvalPolicies", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  entityType: varchar("entityType", { length: 32 }).notNull(),
  thresholdAmount: decimal("thresholdAmount", { precision: 14, scale: 2 }).notNull().default("0"),
  createdBy: int("createdBy").notNull(),
  updatedBy: int("updatedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
