import { describe, expect, it } from "vitest";
import { menuItems } from "./DashboardLayout";

describe("DashboardLayout HR navigation", () => {
  it("groups employee-related pages under the HR heading without changing their routes", () => {
    const hrStart = menuItems.findIndex((item) => "section" in item && item.label === "الموارد البشرية HR");
    expect(hrStart).toBeGreaterThan(-1);

    const hrItems = menuItems.slice(hrStart + 1, hrStart + 8);
    expect(hrItems.map((item) => ("path" in item ? item.path : ""))).toEqual([
      "/employees",
      "/employee-advances",
      "/compliance-documents",
      "/payroll",
      "/attendance",
      "/custody",
      "/custody?tab=custodyStatement",
    ]);
  });
});
