import * as fs from "fs";
import * as path from "path";
import mysql from "mysql2/promise";
import * as crypto from "crypto";
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

// استعادة المستخدمين
async function restoreUsers(connection, users) {
  console.log(`📥 جاري استعادة ${users.length} مستخدم...`);

  for (const user of users) {
    try {
      const existingUser = await connection.execute(
        "SELECT id FROM users WHERE openId = ?",
        [user.openId]
      );

      if (existingUser[0].length > 0) {
        // تحديث المستخدم الموجود
        await connection.execute(
          `UPDATE users SET name = ?, email = ?, role = ?, jobTitle = ?, 
           defaultProjectId = ?, lastSignedIn = ?, passwordHash = ?, 
           mustChangePassword = ?, updatedAt = NOW() 
           WHERE openId = ?`,
          [
            user.name || "",
            user.email || "",
            user.role || "user",
            user.jobTitle || null,
            user.defaultProjectId || null,
            user.lastSignedIn ? new Date(user.lastSignedIn) : new Date(),
            user.passwordHash || null,
            user.mustChangePassword || 0,
            user.openId,
          ]
        );
      } else {
        // إدراج مستخدم جديد
        await connection.execute(
          `INSERT INTO users (openId, name, email, loginMethod, role, jobTitle, 
           defaultProjectId, createdAt, updatedAt, lastSignedIn, passwordHash, mustChangePassword)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
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
      }
    } catch (error) {
      console.warn(
        `⚠️ خطأ في استعادة المستخدم ${user.name}: ${error.message}`
      );
    }
  }

  console.log("✅ تمت استعادة المستخدمين");
}

// استعادة الشركات
async function restoreCompanyProfiles(connection, companyProfiles) {
  console.log(`📥 جاري استعادة ${companyProfiles.length} ملف ملف الشركة...`);

  for (const profile of companyProfiles) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO companyProfiles 
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

  console.log("✅ تمت استعادة ملفات الشركات");
}

// استعادة المشاريع
async function restoreProjects(connection, projects) {
  console.log(`📥 جاري استعادة ${projects.length} مشروع...`);

  for (const project of projects) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO projects 
         (id, companyId, code, name, status, classification, projectType, 
          escrowCashAccountId, escrowTrusteeName, escrowStatementReference, 
          wipAccountId, contractValue, location, plannedStart, plannedEnd, 
          createdBy, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

  console.log("✅ تمت استعادة المشاريع");
}

// استعادة المراحل
async function restoreStages(connection, stages) {
  console.log(`📥 جاري استعادة ${stages.length} مرحلة...`);

  for (const stage of stages) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO stages 
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

  console.log("✅ تمت استعادة المراحل");
}

// استعادة الموردين
async function restoreVendors(connection, vendors) {
  console.log(`📥 جاري استعادة ${vendors.length} مورد...`);

  for (const vendor of vendors) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO vendors 
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

  console.log("✅ تمت استعادة الموردين");
}

// استعادة الموظفين
async function restoreEmployees(connection, employees) {
  console.log(`📥 جاري استعادة ${employees.length} موظف...`);

  for (const employee of employees) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO employees 
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

  console.log("✅ تمت استعادة الموظفين");
}

// استعادة الحسابات المالية
async function restoreCashAccounts(connection, cashAccounts) {
  console.log(`📥 جاري استعادة ${cashAccounts.length} حساب مالي...`);

  for (const account of cashAccounts) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO cashAccounts 
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

  console.log("✅ تمت استعادة الحسابات المالية");
}

// استعادة الحسابات المحاسبية
async function restoreAccounts(connection, accounts) {
  console.log(`📥 جاري استعادة ${accounts.length} حساب محاسبي...`);

  for (const account of accounts) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO accounts 
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

  console.log("✅ تمت استعادة الحسابات المحاسبية");
}

// استعادة عناصر التكاليف
async function restoreCostItems(connection, costItems) {
  console.log(`📥 جاري استعادة ${costItems.length} عنصر تكلفة...`);

  for (const item of costItems) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO costItems 
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

  console.log("✅ تمت استعادة عناصر التكاليف");
}

// استعادة الوحدات
async function restoreUnits(connection, units) {
  console.log(`📥 جاري استعادة ${units.length} وحدة...`);

  for (const unit of units) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO units 
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

  console.log("✅ تمت استعادة الوحدات");
}

// استعادة المصروفات
async function restoreExpenses(connection, expenses) {
  console.log(`📥 جاري استعادة ${expenses.length} مصروف...`);

  for (const expense of expenses) {
    try {
      await connection.execute(
        `INSERT IGNORE INTO expenses 
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

  console.log("✅ تمت استعادة المصروفات");
}

// الدالة الرئيسية
async function restoreBackup() {
  const connection = await getConnection();

  try {
    console.log("\n🔄 بدء استعادة النسخة الاحتياطية للنظام...\n");

    // قراءة الملف
    const backupPath = process.argv[2] || "./erp-backup.json";
    console.log(`📂 قراءة ملف النسخة الاحتياطية: ${backupPath}\n`);
    const backup = readBackupFile(backupPath);

    // التحقق من صحة الملف
    if (!backup.tables) {
      throw new Error("ملف النسخة الاحتياطية لا يحتوي على جداول");
    }

    // حذف البيانات القديمة (خياري - قم بإلغاء التعليق إذا أردت)
    console.log(
      "⚠️ ملاحظة: البيانات الموجودة سيتم دمجها مع البيانات الجديدة\n"
    );

    // استعادة البيانات
    if (backup.tables.users) {
      await restoreUsers(connection, backup.tables.users);
    }

    if (backup.tables.companyProfiles) {
      await restoreCompanyProfiles(connection, backup.tables.companyProfiles);
    }

    if (backup.tables.projects) {
      await restoreProjects(connection, backup.tables.projects);
    }

    if (backup.tables.stages) {
      await restoreStages(connection, backup.tables.stages);
    }

    if (backup.tables.vendors) {
      await restoreVendors(connection, backup.tables.vendors);
    }

    if (backup.tables.employees) {
      await restoreEmployees(connection, backup.tables.employees);
    }

    if (backup.tables.cashAccounts) {
      await restoreCashAccounts(connection, backup.tables.cashAccounts);
    }

    if (backup.tables.accounts) {
      await restoreAccounts(connection, backup.tables.accounts);
    }

    if (backup.tables.costItems) {
      await restoreCostItems(connection, backup.tables.costItems);
    }

    if (backup.tables.units) {
      await restoreUnits(connection, backup.tables.units);
    }

    if (backup.tables.expenses) {
      await restoreExpenses(connection, backup.tables.expenses);
    }

    console.log("\n✨ تمت استعادة النسخة الاحتياطية بنجاح!\n");
  } catch (error) {
    console.error("❌ خطأ أثناء استعادة النسخة الاحتياطية:", error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// تشغيل البرنامج
restoreBackup();
