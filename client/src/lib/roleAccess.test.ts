import { describe, expect, it } from "vitest";
import { canAccessRoute, canDeleteOwnerManagedDocument, defaultRouteForRole, isOperationalOnlyRole } from "./roleAccess";

describe("قيود مسؤول المشتريات", () => {
  it("يوجه الأدوار التشغيلية إلى صفحة طلب المواد المستقلة ولا يعرض لوحة المشروع", () => {
    expect(defaultRouteForRole("procurement_manager")).toBe("/material-requests");
    expect(defaultRouteForRole("site_worker")).toBe("/material-requests");
    expect(canAccessRoute("procurement_manager", "/")).toBe(false);
    expect(canAccessRoute("procurement_manager", "/expenses")).toBe(false);
    expect(canAccessRoute("procurement_manager", "/accounting")).toBe(false);
    expect(canAccessRoute("procurement_manager", "/reports")).toBe(false);
  });

  it("يسمح لمسؤول المشتريات فقط بمسارات الكميات وصفحة طلب المواد وطلباته", () => {
    expect(canAccessRoute("procurement_manager", "/inventory?mode=receipt")).toBe(true);
    expect(canAccessRoute("procurement_manager", "/inventory?mode=issue")).toBe(true);
    expect(canAccessRoute("procurement_manager", "/operations?tab=procurement")).toBe(true);
    expect(canAccessRoute("procurement_manager", "/material-requests")).toBe(true);
    expect(canAccessRoute("procurement_manager", "/my-requests")).toBe(true);
    expect(isOperationalOnlyRole("procurement_manager")).toBe(true);
  });
});

describe("مصفوفة أدوار ERP الأساسية", () => {
  it("تسمح للأدوار الإدارية والتقريرية بالوصول إلى التقارير والموافقات", () => {
    for (const role of ["admin", "general_manager", "project_manager", "finance", "hr", "employee", "approver"]) {
      expect(canAccessRoute(role, "/reports")).toBe(true);
      expect(canAccessRoute(role, "/approvals")).toBe(true);
      expect(canAccessRoute(role, "/users")).toBe(true);
    }
  });

  it("تحصر الأدوار التشغيلية في المواد وطلباتها ولا تمنحها مسارات المالية", () => {
    for (const role of ["procurement_manager", "site_worker"]) {
      expect(canAccessRoute(role, "/material-requests")).toBe(true);
      expect(canAccessRoute(role, "/inventory?mode=receipt")).toBe(true);
      expect(canAccessRoute(role, "/reports")).toBe(false);
      expect(canAccessRoute(role, "/approvals")).toBe(false);
      expect(canAccessRoute(role, "/users")).toBe(false);
    }
  });
});

describe("حذف المستندات المرجعية", () => {
  it("يقصر حذف ملفات الموردين على المالك", () => {
    expect(canDeleteOwnerManagedDocument("admin")).toBe(true);
    expect(canDeleteOwnerManagedDocument("procurement_manager")).toBe(false);
    expect(canDeleteOwnerManagedDocument("general_manager")).toBe(false);
    expect(canDeleteOwnerManagedDocument("project_manager")).toBe(false);
  });
});
