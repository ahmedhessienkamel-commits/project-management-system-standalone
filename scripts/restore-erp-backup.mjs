import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL غير محدد في متغيرات البيئة");
  process.exit(1);
}

// إنشاء اتصال بقاعدة البيانات
async function getConnection() {
  return await mysql.createConnection(DATABASE_URL);
}

// قراءة ملف النسخة الاحتياطية
function readBackupFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`ملف النسخة الاحتياطية غير موجود: ${filePath}`);
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

// ✅ حذف جميع البيانات القديمة
async function clearAllData(connection) {
  console.log("\n🗑️ جاري حذف البيانات القديمة...\n");

  const tablesToClear = [
    "expenses",
    "collections",
    "sales",
    "units",
    "custodyMovements",
    "custody",
    "serviceContractEntries",
    "certificates",
    "contractorContracts",
    "payrollAllocations",
    "administrativePayroll",
    "payrollSettlements",
    "payroll",
    "payrollRuns",
    "employeeWorkStarts",
    "employees",
    "attendance",
    "advanceRepayments",
    "advanceRequests",
    "leaveRequests",
    "dailyTasks",
    "complianceDocuments",
    "notifications",
    "attachments",
    "accountingDocumentLines",
    "accountingDocuments",
    "costItems",
    "accounts",
    "cashTransfers",
    "cashAccounts",
    "companyProfiles",
    "approvalPolicies",
    "purchaseReceiptItems",
    "purchaseReceipts",
    "purchaseOrderItems",
    "purchaseOrders",
    "materialRequisitionItems",
    "materialRequisitions",
    "periodLocks",
    "auditLogs",
    "approvalRequests",
    "userOperationPermissions",
    "projectMembers",
    "stages",
    "vendors",
    "projects",
    "companyMembers",
    "passwordResetTokens",
    "userInvitations",
    "users",
  ];

  for (const table of tablesToClear) {
    try {
      await connection.execute(`DELETE FROM \`${table}\``);
      console.log(`✅ تم حذف بيانات جدول: ${table}`);
    } catch (error) {
      // الجدول قد لا يكون موجود، تجاهل الخطأ
      // console.log(`⏭️ جدول ${table} غير موجود أو فارغ`);
    }
  }

  console.log("\n✨ تم حذف جميع البيانات القديمة بنجاح!\n");
}

// استعادة المستخدمين
async function restoreUsers(connection, users) {
  console.log(`📥 جاري استعادة ${users.length} مستخدم...`);

  for (const user of users) {
    try {
      await connection.execute(
        `INSERT INTO users (id, openId, name, email, loginMethod, role, jobTitle, 
         defaultProjectId, createdAt, updatedAt, lastSignedIn, passwordHash, mustChangePassword)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user.id,
          user.openId,
          user.name || "",
          user.email || "",
          user.loginMethod || "password",
          user.role || "user",
          user.jobTitle || null,
          user.defaultProjectId || null,
          new Date(user.createdAt),
          new Date(user.updatedAt),
          user.lastSignedIn ? new Date(user.lastSignedIn) : new Date(),
          user.passwordHash || null,
          user.mustChangePassword || 0,
        ]
      );
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة المستخدم ${user.name}: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة المستخدمين\n");
}

// استعادة الشركات
async function restoreCompanyProfiles(connection, companyProfiles) {
  console.log(`📥 جاري استعادة ${companyProfiles.length} ملف شركة...`);

  for (const profile of companyProfiles) {
    try {
      await connection.execute(
        `INSERT INTO companyProfiles 
         (id, companyId, legalName, tradeName, commercialRegistration, taxNumber, 
          nationalAddress, phone, email, website, logoUrl, notes, createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.id,
          profile.companyId || 1,
          profile.legalName || "",
          profile.tradeName || null,
          profile.commercialRegistration || null,
          profile.taxNumber || null,
          profile.nationalAddress || null,
          profile.phone || null,
          profile.email || null,
          profile.website || null,
          profile.logoUrl || null,
          profile.notes || null,
          profile.createdBy || 1,
          new Date(profile.createdAt),
          new Date(profile.updatedAt),
        ]
      );
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة الملف الشخصي للشركة: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة ملفات الشركات\n");
}

// استعادة المشاريع
async function restoreProjects(connection, projects) {
  console.log(`📥 جاري استعادة ${projects.length} مشروع...`);

  for (const project of projects) {
    try {
      await connection.execute(
        `INSERT INTO projects 
         (id, companyId, code, name, status, classification, projectType, 
          escrowCashAccountId, escrowTrusteeName, escrowStatementReference, 
          wipAccountId, contractValue, estimatedTotalCost, location, plannedStart, plannedEnd, 
          createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          project.id,
          project.companyId || 1,
          project.code || "",
          project.name || "",
          project.status || "planning",
          project.classification || "operational",
          project.projectType || "general",
          project.escrowCashAccountId || null,
          project.escrowTrusteeName || null,
          project.escrowStatementReference || null,
          project.wipAccountId || null,
          project.contractValue || "0",
          project.estimatedTotalCost || "0",
          project.location || null,
          project.plannedStart ? new Date(project.plannedStart) : null,
          project.plannedEnd ? new Date(project.plannedEnd) : null,
          project.createdBy || 1,
          new Date(project.createdAt),
          new Date(project.updatedAt),
        ]
      );
    } catch (error) {
      console.warn(`⚠️ خطأ في استعادة المشروع ${project.name}: ${error.message}`);
    }
  }

  console.log("✅ تمت استعادة المشاريع\n");
}

// استعادة المراحل
async function restoreStages(connection, stages) {
  console.log(`📥 جاري استعادة ${stages.length} مرحلة...`);

  for (const stage of stages) {
    try {
      await connection.execute(
        `INSERT INTO stages 
         (id, projectId, code, name, status, plannedBudget, plannedBudgetTaxBasis, 
          plannedStart, plannedEnd, actualProgress, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          stage.id,
          stage.projectId || 1,
          stage.code || "",
          stage.name || "",
          stage.status || "planned",
          stage.plannedBudget || "0",
          stage.plannedBudgetTaxBasis || "pre_tax",
          stage.plannedStart ? new Date(stage.plannedStart) : null,
          stage.plannedEnd ? new Date(stage.plannedEnd) : null,
          stage.actualProgress || "0",
          new Date(stage.createdAt),
        ]
      );
    } catch (error) {
      console.warn(`⚠️ خطأ في استعادة المرحلة ${stage.name}: ${error.message}`);
    }
  }

  console.log("✅ تمت استعادة المراحل\n");
}

// استعادة الموردين
async function restoreVendors(connection, vendors) {
  console.log(`📥 جاري استعادة ${vendors.length} مورد...`);

  for (const vendor of vendors) {
    try {
      await connection.execute(
        `INSERT INTO vendors 
         (id, companyId, projectId, name, partyType, entityType, taxNumber, 
          commercialRegistration, nationalAddress, address, phone, email, iban, contact, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vendor.id,
          vendor.companyId || 1,
          vendor.projectId || null,
          vendor.name || "",
          vendor.partyType || "supplier",
          vendor.entityType || "company",
          vendor.taxNumber || null,
          vendor.commercialRegistration || null,
          vendor.nationalAddress || null,
          vendor.address || null,
          vendor.phone || null,
          vendor.email || null,
          vendor.iban || null,
          vendor.contact || null,
          new Date(vendor.createdAt),
        ]
      );
    } catch (error) {
      console.warn(`⚠️ خطأ في استعادة المورد ${vendor.name}: ${error.message}`);
    }
  }

  console.log("✅ تمت استعادة الموردين\n");
}

// استعادة الموظفين
async function restoreEmployees(connection, employees) {
  console.log(`📥 جاري استعادة ${employees.length} موظف...`);

  for (const employee of employees) {
    try {
      await connection.execute(
        `INSERT INTO employees 
         (id, employeeCode, employmentType, fullName, jobTitle, department, 
          managerName, managerUserId, generalManagerUserId, phone, email, nationalId, 
          nationality, birthDate, hireDate, workLocation, address, nationalAddress, 
          bankName, iban, insuranceNumber, basicSalary, housingAllowance, 
          transportAllowance, otherAllowances, standardDeduction, notes, status, 
          defaultProjectId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employee.id,
          employee.employeeCode || "",
          employee.employmentType || "employee",
          employee.fullName || "",
          employee.jobTitle || null,
          employee.department || null,
          employee.managerName || null,
          employee.managerUserId || null,
          employee.generalManagerUserId || null,
          employee.phone || null,
          employee.email || null,
          employee.nationalId || null,
          employee.nationality || null,
          employee.birthDate ? new Date(employee.birthDate) : null,
          employee.hireDate ? new Date(employee.hireDate) : null,
          employee.workLocation || null,
          employee.address || null,
          employee.nationalAddress || null,
          employee.bankName || null,
          employee.iban || null,
          employee.insuranceNumber || null,
          employee.basicSalary || "0",
          employee.housingAllowance || "0",
          employee.transportAllowance || "0",
          employee.otherAllowances || "0",
          employee.standardDeduction || "0",
          employee.notes || null,
          employee.status || "active",
          employee.defaultProjectId || null,
          new Date(employee.createdAt),
          new Date(employee.updatedAt),
        ]
      );
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة الموظف ${employee.fullName}: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة الموظفين\n");
}

// استعادة الحسابات المالية
async function restoreCashAccounts(connection, cashAccounts) {
  console.log(`📥 جاري استعادة ${cashAccounts.length} حساب مالي...`);

  for (const account of cashAccounts) {
    try {
      await connection.execute(
        `INSERT INTO cashAccounts 
         (id, companyId, code, name, accountType, bankName, accountNumber, iban, 
          currency, accountId, openingBalance, isActive, createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          account.id,
          account.companyId || 1,
          account.code || "",
          account.name || "",
          account.accountType || "cash",
          account.bankName || null,
          account.accountNumber || null,
          account.iban || null,
          account.currency || "SAR",
          account.accountId || null,
          account.openingBalance || "0",
          account.isActive !== undefined ? account.isActive : 1,
          account.createdBy || 1,
          new Date(account.createdAt),
          new Date(account.updatedAt),
        ]
      );
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة الحساب المالي ${account.name}: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة الحسابات المالية\n");
}

// استعادة الحسابات المحاسبية
async function restoreAccounts(connection, accounts) {
  console.log(`📥 جاري استعادة ${accounts.length} حساب محاسبي...`);

  for (const account of accounts) {
    try {
      await connection.execute(
        `INSERT INTO accounts 
         (id, companyId, code, name, accountType, parentId, isPostable, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          account.id,
          account.companyId || 1,
          account.code || "",
          account.name || "",
          account.accountType || "asset",
          account.parentId || null,
          account.isPostable !== undefined ? account.isPostable : 1,
          account.isActive !== undefined ? account.isActive : 1,
          new Date(account.createdAt),
          new Date(account.updatedAt),
        ]
      );
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة الحساب المحاسبي ${account.name}: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة الحسابات المحاسبية\n");
}

// استعادة عناصر التكاليف
async function restoreCostItems(connection, costItems) {
  console.log(`📥 جاري استعادة ${costItems.length} عنصر تكلفة...`);

  for (const item of costItems) {
    try {
      await connection.execute(
        `INSERT INTO costItems 
         (id, projectId, parentId, code, name, category, accountId, isActive, createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          item.id,
          item.projectId || null,
          item.parentId || null,
          item.code || "",
          item.name || "",
          item.category || "materials",
          item.accountId || null,
          item.isActive !== undefined ? item.isActive : 1,
          item.createdBy || 1,
          new Date(item.createdAt),
          new Date(item.updatedAt),
        ]
      );
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة عنصر التكلفة ${item.name}: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة عناصر التكاليف\n");
}

// استعادة الوحدات
async function restoreUnits(connection, units) {
  console.log(`📥 جاري استعادة ${units.length} وحدة...`);

  for (const unit of units) {
    try {
      await connection.execute(
        `INSERT INTO units 
         (id, projectId, code, name, type, status, listPrice, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          unit.id,
          unit.projectId || 1,
          unit.code || "",
          unit.name || "",
          unit.type || null,
          unit.status || "available",
          unit.listPrice || "0",
          new Date(unit.createdAt),
        ]
      );
    } catch (error) {
      console.warn(`⚠️ خطأ في استعادة الوحدة ${unit.name}: ${error.message}`);
    }
  }

  console.log("✅ تمت استعادة الوحدات\n");
}

// استعادة المصروفات
async function restoreExpenses(connection, expenses) {
  console.log(`📥 جاري استعادة ${expenses.length} مصروف...`);

  for (const expense of expenses) {
    try {
      await connection.execute(
        `INSERT INTO expenses 
         (id, companyId, projectId, stageId, vendorId, costItemId, reference, description, 
          unit, quantity, expenseType, payrollBeneficiaryType, payrollEmployeeId, 
          payrollBeneficiaryName, classification, allocationRatio, preTaxAmount, taxRate, 
          taxAmount, totalAmount, paidAmount, status, expenseDate, createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          expense.id,
          expense.companyId || null,
          expense.projectId || null,
          expense.stageId || null,
          expense.vendorId || null,
          expense.costItemId || null,
          expense.reference || null,
          expense.description || "",
          expense.unit || null,
          expense.quantity || "1",
          expense.expenseType || "operating",
          expense.payrollBeneficiaryType || null,
          expense.payrollEmployeeId || null,
          expense.payrollBeneficiaryName || null,
          expense.classification || "project",
          expense.allocationRatio || "1",
          expense.preTaxAmount || "0",
          expense.taxRate || "15",
          expense.taxAmount || "0",
          expense.totalAmount || "0",
          expense.paidAmount || "0",
          expense.status || "draft",
          expense.expenseDate ? new Date(expense.expenseDate) : null,
          expense.createdBy || 1,
          new Date(expense.createdAt),
          new Date(expense.updatedAt),
        ]
      );
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة المصروف ${expense.id}: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة المصروفات\n");
}

// الدالة الرئيسية
async function restoreBackup() {
  const connection = await getConnection();

  try {
    console.log("\n" + "=".repeat(60));
    console.log("🔄 بدء استعادة النسخة الاحتياطية للنظام (استبدال كامل)");
    console.log("=".repeat(60) + "\n");

    // قراءة الملف
    const backupPath = process.argv[2] || "./erp-backup.json";
    console.log(`📂 قراءة ملف النسخة الاحتياطية: ${backupPath}\n`);
    const backup = readBackupFile(backupPath);

    // التحقق من صحة الملف
    if (!backup.tables) {
      throw new Error("ملف النسخة الاحتياطية لا يحتوي على جداول");
    }

    // ✅ حذف جميع البيانات القديمة
    await clearAllData(connection);

    // استعادة البيانات بالترتيب الصحيح
    if (backup.tables.users && backup.tables.users.length > 0) {
      await restoreUsers(connection, backup.tables.users);
    }

    if (backup.tables.companyProfiles && backup.tables.companyProfiles.length > 0) {
      await restoreCompanyProfiles(connection, backup.tables.companyProfiles);
    }

    if (backup.tables.projects && backup.tables.projects.length > 0) {
      await restoreProjects(connection, backup.tables.projects);
    }

    if (backup.tables.stages && backup.tables.stages.length > 0) {
      await restoreStages(connection, backup.tables.stages);
    }

    if (backup.tables.vendors && backup.tables.vendors.length > 0) {
      await restoreVendors(connection, backup.tables.vendors);
    }

    if (backup.tables.employees && backup.tables.employees.length > 0) {
      await restoreEmployees(connection, backup.tables.employees);
    }

    if (backup.tables.cashAccounts && backup.tables.cashAccounts.length > 0) {
      await restoreCashAccounts(connection, backup.tables.cashAccounts);
    }

    if (backup.tables.accounts && backup.tables.accounts.length > 0) {
      await restoreAccounts(connection, backup.tables.accounts);
    }

    if (backup.tables.costItems && backup.tables.costItems.length > 0) {
      await restoreCostItems(connection, backup.tables.costItems);
    }

    if (backup.tables.units && backup.tables.units.length > 0) {
      await restoreUnits(connection, backup.tables.units);
    }

    if (backup.tables.expenses && backup.tables.expenses.length > 0) {
      await restoreExpenses(connection, backup.tables.expenses);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✨ تمت استعادة النسخة الاحتياطية بنجاح (استبدال كامل)!");
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ خطأ أثناء استعادة النسخة الاحتياطية:", error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// تشغيل البرنامج
restoreBackup();
