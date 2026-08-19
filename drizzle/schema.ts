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
  projectType: mysqlEnum("projectType", ["real_estate_development", "off_plan_sales", "main_contractor", "subcontractor", "general"]).default("general").notNull(),
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
  costItemId: int("costItemId"),
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
  approvalStage: varchar("approvalStage", { length: 32 }),
  stageOrder: int("stageOrder"),
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
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;
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
  saleId: int("saleId"),
  collectionType: mysqlEnum("collectionType", ["unit_sale", "owner_payment", "contract_payment", "other"]).default("other").notNull(),
  partyName: varchar("partyName", { length: 255 }),
  receiptReference: varchar("receiptReference", { length: 128 }),
  collectionDate: date("collectionDate"),
  amount: decimal("amount", { precision: 14, scale: 2 }).default("0").notNull(),
  status: mysqlEnum("status", ["draft", "received", "reversed"]).default("draft").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  employeeCode: varchar("employeeCode", { length: 64 }).notNull().unique(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  jobTitle: varchar("jobTitle", { length: 255 }),
  department: varchar("department", { length: 255 }),
  managerName: varchar("managerName", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  email: varchar("email", { length: 255 }),
  nationalId: varchar("nationalId", { length: 64 }),
  nationality: varchar("nationality", { length: 128 }),
  birthDate: date("birthDate"),
  hireDate: date("hireDate"),
  workLocation: varchar("workLocation", { length: 255 }),
  bankName: varchar("bankName", { length: 255 }),
  iban: varchar("iban", { length: 128 }),
  insuranceNumber: varchar("insuranceNumber", { length: 128 }),
  basicSalary: decimal("basicSalary", { precision: 14, scale: 2 }).default("0").notNull(),
  housingAllowance: decimal("housingAllowance", { precision: 14, scale: 2 }).default("0").notNull(),
  transportAllowance: decimal("transportAllowance", { precision: 14, scale: 2 }).default("0").notNull(),
  otherAllowances: decimal("otherAllowances", { precision: 14, scale: 2 }).default("0").notNull(),
  standardDeduction: decimal("standardDeduction", { precision: 14, scale: 2 }).default("0").notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  defaultProjectId: int("defaultProjectId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const payroll = mysqlTable("payroll", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  employeeId: int("employeeId"),
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  employeeCode: varchar("employeeCode", { length: 64 }),
  month: int("month").notNull(),
  year: int("year").notNull(),
  classification: mysqlEnum("classification", ["project", "administrative"]).default("project").notNull(),
  preTaxAmount: decimal("preTaxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  taxAmount: decimal("taxAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  paidAmount: decimal("paidAmount", { precision: 14, scale: 2 }).default("0").notNull(),
  absenceDays: int("absenceDays").default(0).notNull(),
  deductionAmount: decimal("deductionAmount", { precision: 14, scale: 2 }).default("0").notNull(),
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
  employeeId: int("employeeId"),
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  movementType: mysqlEnum("movementType", ["issue", "spend", "return", "settlement"]).notNull(),
  allocationType: mysqlEnum("allocationType", ["project", "general_cash", "general_admin", "petty_cash", "operating_expense"]).notNull(),
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
  employeeId: int("employeeId"),
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

export const dailyTasks = mysqlTable("dailyTasks", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  assignedEmployeeId: int("assignedEmployeeId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  dueDate: timestamp("dueDate"),
  priority: varchar("priority", { length: 16 }).notNull().default("normal"),
  status: varchar("status", { length: 16 }).notNull().default("open"),
  createdBy: int("createdBy"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
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

export const materialRequisitions = mysqlTable("materialRequisitions", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  requestedBy: int("requestedBy").notNull(),
  requestNumber: varchar("requestNumber", { length: 128 }).notNull().unique(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "pending_approval", "approved", "rejected", "converted", "cancelled"]).default("draft").notNull(),
  requiredBy: date("requiredBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const materialRequisitionItems = mysqlTable("materialRequisitionItems", {
  id: int("id").autoincrement().primaryKey(),
  requisitionId: int("requisitionId").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  unit: varchar("unit", { length: 64 }),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull().default("1"),
  estimatedUnitCost: decimal("estimatedUnitCost", { precision: 14, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
});

export const purchaseOrders = mysqlTable("purchaseOrders", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  vendorId: int("vendorId").notNull(),
  requisitionId: int("requisitionId"),
  orderNumber: varchar("orderNumber", { length: 128 }).notNull().unique(),
  status: mysqlEnum("status", ["draft", "pending_approval", "approved", "partially_received", "received", "cancelled"]).default("draft").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 128 }),
  invoiceStatus: mysqlEnum("invoiceStatus", ["not_received", "received", "partially_paid", "paid"]).default("not_received").notNull(),
  invoicedAmount: decimal("invoicedAmount", { precision: 14, scale: 2 }).notNull().default("0"),
  paidAmount: decimal("paidAmount", { precision: 14, scale: 2 }).notNull().default("0"),
  subtotal: decimal("subtotal", { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("taxAmount", { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).notNull().default("0"),
  orderDate: date("orderDate"),
  expectedDate: date("expectedDate"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const purchaseOrderItems = mysqlTable("purchaseOrderItems", {
  id: int("id").autoincrement().primaryKey(),
  purchaseOrderId: int("purchaseOrderId").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  unit: varchar("unit", { length: 64 }),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull().default("1"),
  unitCost: decimal("unitCost", { precision: 14, scale: 2 }).notNull().default("0"),
  receivedQuantity: decimal("receivedQuantity", { precision: 14, scale: 3 }).notNull().default("0"),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).notNull().default("0"),
});

export const purchaseReceipts = mysqlTable("purchaseReceipts", {
  id: int("id").autoincrement().primaryKey(),
  purchaseOrderId: int("purchaseOrderId").notNull(),
  projectId: int("projectId").notNull(),
  stageId: int("stageId"),
  receiptNumber: varchar("receiptNumber", { length: 128 }).notNull().unique(),
  receivedDate: date("receivedDate"),
  notes: text("notes"),
  status: mysqlEnum("status", ["draft", "posted", "cancelled"]).default("draft").notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const purchaseReceiptItems = mysqlTable("purchaseReceiptItems", {
  id: int("id").autoincrement().primaryKey(),
  receiptId: int("receiptId").notNull(),
  purchaseOrderItemId: int("purchaseOrderItemId").notNull(),
  quantity: decimal("quantity", { precision: 14, scale: 3 }).notNull().default("0"),
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


export const accounts = mysqlTable("accounts", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  accountType: mysqlEnum("accountType", ["asset", "liability", "equity", "revenue", "expense"]).notNull(),
  parentId: int("parentId"),
  isPostable: int("isPostable").notNull().default(1),
  isActive: int("isActive").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const accountingDocuments = mysqlTable("accountingDocuments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  documentType: mysqlEnum("documentType", ["sales_invoice", "purchase_invoice", "journal_entry", "payment_voucher", "receipt_voucher", "quotation", "purchase_order"]).notNull(),
  documentNumber: varchar("documentNumber", { length: 128 }).notNull().unique(),
  partyName: varchar("partyName", { length: 255 }),
  documentDate: date("documentDate"),
  dueDate: date("dueDate"),
  sourceAccountId: int("sourceAccountId"),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("taxAmount", { precision: 14, scale: 2 }).notNull().default("0"),
  totalAmount: decimal("totalAmount", { precision: 14, scale: 2 }).notNull().default("0"),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "bank"]),
  status: mysqlEnum("status", ["draft", "posted", "cancelled"]).notNull().default("draft"),
  notes: text("notes"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const costItems = mysqlTable("costItems", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  parentId: int("parentId"),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 64 }).notNull().default("materials"),
  isActive: int("isActive").notNull().default(1),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const accountingDocumentLines = mysqlTable("accountingDocumentLines", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  accountId: int("accountId").notNull(),
  costItemId: int("costItemId"),
  projectId: int("projectId"),
  stageId: int("stageId"),
  description: text("description"),
  debit: decimal("debit", { precision: 14, scale: 2 }).notNull().default("0"),
  credit: decimal("credit", { precision: 14, scale: 2 }).notNull().default("0"),
});


export const fixedAssets = mysqlTable("fixedAssets", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId"),
  assetCode: varchar("assetCode", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 128 }).notNull().default("معدات وأصول تشغيلية"),
  acquisitionDate: date("acquisitionDate").notNull(),
  inServiceDate: date("inServiceDate").notNull(),
  acquisitionCost: decimal("acquisitionCost", { precision: 14, scale: 2 }).notNull(),
  residualValue: decimal("residualValue", { precision: 14, scale: 2 }).notNull().default("0"),
  usefulLifeMonths: int("usefulLifeMonths").notNull(),
  depreciationMethod: mysqlEnum("depreciationMethod", ["straight_line"]).notNull().default("straight_line"),
  assetAccountId: int("assetAccountId").notNull(),
  depreciationExpenseAccountId: int("depreciationExpenseAccountId").notNull(),
  accumulatedDepreciationAccountId: int("accumulatedDepreciationAccountId").notNull(),
  sourceDocumentId: int("sourceDocumentId"),
  status: mysqlEnum("status", ["active", "disposed"]).notNull().default("active"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const fixedAssetDepreciation = mysqlTable("fixedAssetDepreciation", {
  id: int("id").autoincrement().primaryKey(),
  assetId: int("assetId").notNull(),
  periodStart: date("periodStart").notNull(),
  periodEnd: date("periodEnd").notNull(),
  depreciationAmount: decimal("depreciationAmount", { precision: 14, scale: 2 }).notNull(),
  accumulatedAmount: decimal("accumulatedAmount", { precision: 14, scale: 2 }).notNull(),
  netBookValue: decimal("netBookValue", { precision: 14, scale: 2 }).notNull(),
  journalDocumentId: int("journalDocumentId"),
  status: mysqlEnum("status", ["planned", "posted"]).notNull().default("planned"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
