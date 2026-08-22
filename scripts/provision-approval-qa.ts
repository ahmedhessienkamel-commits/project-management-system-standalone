import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { companyMembers, projects, projectMembers, users, vendors } from "../drizzle/schema";
import { getDb } from "../server/db";

const QA_TAG = "[QA-APPROVAL-20260822]";
const QA_PASSWORD = "QaApproval2026!";
const COMPANY_ID = 1;
const MOSTAFA_USER_ID = 13170001;

const testAccounts = [
  { key: "general-manager", name: "مدير عام تجريبي", email: "qa.general.manager@example.invalid", role: "general_manager" as const, companyRole: "general_manager" as const, projectRole: "manager" as const },
  { key: "project-manager", name: "مدير مشاريع تجريبي", email: "qa.project.manager@example.invalid", role: "project_manager" as const, companyRole: "project_manager" as const, projectRole: "manager" as const },
  { key: "site-worker", name: "موظف موقع تجريبي", email: "qa.site.worker@example.invalid", role: "site_worker" as const, companyRole: "user" as const, projectRole: "input" as const },
];

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

async function main() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة");

  let qaProject = (await db.select().from(projects).where(eq(projects.code, "QA-APPROVAL-20260822")).limit(1))[0];
  if (!qaProject) {
    const result = await db.insert(projects).values({
      companyId: COMPANY_ID,
      code: "QA-APPROVAL-20260822",
      name: `${QA_TAG} مشروع اختبار دورة الموافقات`,
      status: "planning",
      classification: "administrative",
      projectType: "general",
      contractValue: "0.00",
      location: "بيئة اختبار داخلية — لا تستخدم للتشغيل",
      createdBy: 1,
    });
    qaProject = (await db.select().from(projects).where(eq(projects.id, Number(result[0].insertId))).limit(1))[0]!;
  }

  const accountIds: Record<string, number> = {};
  for (const account of testAccounts) {
    let user = (await db.select().from(users).where(eq(users.email, account.email)).limit(1))[0];
    if (!user) {
      const result = await db.insert(users).values({
        openId: `qa-${account.key}-${randomUUID()}`,
        name: account.name,
        email: account.email,
        loginMethod: "password",
        role: account.role,
        jobTitle: `${QA_TAG} حساب اختبار`,
        defaultProjectId: qaProject.id,
        passwordHash: hashPassword(QA_PASSWORD),
        lastSignedIn: new Date(),
      });
      user = (await db.select().from(users).where(eq(users.id, Number(result[0].insertId))).limit(1))[0]!;
    } else {
      await db.update(users).set({
        name: account.name,
        role: account.role,
        jobTitle: `${QA_TAG} حساب اختبار`,
        defaultProjectId: qaProject.id,
        loginMethod: "password",
        passwordHash: hashPassword(QA_PASSWORD),
      }).where(eq(users.id, user.id));
      user = (await db.select().from(users).where(eq(users.id, user!.id)).limit(1))[0]!;
    }
    accountIds[account.key] = user.id;

    const companyMembership = (await db.select().from(companyMembers).where(and(eq(companyMembers.companyId, COMPANY_ID), eq(companyMembers.userId, user.id))).limit(1))[0];
    if (companyMembership) {
      await db.update(companyMembers).set({ role: account.companyRole, status: "active" }).where(eq(companyMembers.id, companyMembership.id));
    } else {
      await db.insert(companyMembers).values({ companyId: COMPANY_ID, userId: user.id, role: account.companyRole, status: "active" });
    }

    const projectMembership = (await db.select().from(projectMembers).where(and(eq(projectMembers.projectId, qaProject.id), eq(projectMembers.userId, user.id))).limit(1))[0];
    if (projectMembership) {
      await db.update(projectMembers).set({ projectRole: account.projectRole }).where(eq(projectMembers.id, projectMembership.id));
    } else {
      await db.insert(projectMembers).values({ projectId: qaProject.id, userId: user.id, projectRole: account.projectRole });
    }
  }

  const mostafaProjectMembership = (await db.select().from(projectMembers).where(and(eq(projectMembers.projectId, qaProject.id), eq(projectMembers.userId, MOSTAFA_USER_ID))).limit(1))[0];
  if (!mostafaProjectMembership) await db.insert(projectMembers).values({ projectId: qaProject.id, userId: MOSTAFA_USER_ID, projectRole: "input" });

  let vendor = (await db.select().from(vendors).where(eq(vendors.name, `${QA_TAG} مورد اختبار`)).limit(1))[0];
  if (!vendor) {
    const result = await db.insert(vendors).values({ companyId: COMPANY_ID, projectId: qaProject.id, name: `${QA_TAG} مورد اختبار`, partyType: "supplier", entityType: "company", contact: "بيئة الاختبار", email: "qa.vendor@example.invalid" });
    vendor = (await db.select().from(vendors).where(eq(vendors.id, Number(result[0].insertId))).limit(1))[0]!;
  }

  console.log(JSON.stringify({
    qaTag: QA_TAG,
    project: { id: qaProject.id, code: qaProject.code, name: qaProject.name, status: qaProject.status },
    accounts: {
      owner: { id: 1, note: "الحساب الفعلي للمالك — لا تُغير كلمة مروره" },
      mostafa: { id: MOSTAFA_USER_ID, note: "الحساب الفعلي لمصطفى — لا تُغير كلمة مروره" },
      generalManager: { id: accountIds["general-manager"], email: testAccounts[0].email },
      projectManager: { id: accountIds["project-manager"], email: testAccounts[1].email },
      siteWorker: { id: accountIds["site-worker"], email: testAccounts[2].email },
    },
    testPassword: QA_PASSWORD,
    vendor: { id: vendor.id, name: vendor.name },
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
