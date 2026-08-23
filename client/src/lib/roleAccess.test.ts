import { describe, expect, it } from "vitest";
import { canAccessRoute, canDeleteOwnerManagedDocument, defaultRouteForRole, isOperationalOnlyRole } from "./roleAccess";

describe("قيود مسؤول المشتريات", () => {
  it("يوجه الأدوار التشغيلية إلى تقرير الكميات ولا يعرض لوحة المشروع", () => {
    expect(defaultRouteForRole("procurement_manager")).toBe("/inventory");
    expect(defaultRouteForRole("site_worker")).toBe("/inventory");
    expect(canAccessRoute("procurement_manager", "/")).toBe(false);
    expect(canAccessRoute("procurement_manager", "/expenses")).toBe(false);
    expect(canAccessRoute("procurement_manager", "/accounting")).toBe(false);
    expect(canAccessRoute("procurement_manager", "/reports")).toBe(false);
  });

  it("يسمح لمسؤول المشتريات فقط بمسارات الكميات وطلبات المواد وطلباته", () => {
    expect(canAccessRoute("procurement_manager", "/inventory?mode=receipt")).toBe(true);
    expect(canAccessRoute("procurement_manager", "/inventory?mode=issue")).toBe(true);
    expect(canAccessRoute("procurement_manager", "/operations?tab=procurement")).toBe(true);
    expect(canAccessRoute("procurement_manager", "/my-requests")).toBe(true);
    expect(isOperationalOnlyRole("procurement_manager")).toBe(true);
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
