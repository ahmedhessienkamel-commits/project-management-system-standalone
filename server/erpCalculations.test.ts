import { describe, expect, it } from "vitest";
import { allocateAdministrativeAmount, calculateExpenseTotals, calculatePayrollTotals, projectHealthStatus } from "./erpCalculations";
import { calculateAttendanceHours, filterAttendanceByMonth, summarizeAttendanceExceptions } from "../shared/attendance";

describe("ERP financial rules", () => {
  it("calculates pre-tax, VAT, and total for expenses", () => {
    expect(calculateExpenseTotals(1000, 15)).toEqual({ preTaxAmount: 1000, taxRate: 15, taxAmount: 150, totalAmount: 1150 });
  });

  it("keeps payroll tax-free", () => {
    expect(calculatePayrollTotals(1000)).toEqual({ preTaxAmount: 1000, taxAmount: 0, totalAmount: 1000 });
  });

  it("returns critical when a stage is delayed or budget is exceeded", () => {
    expect(projectHealthStatus({ budgetUsage: 70, progress: 80, delayedStages: 1 })).toBe("critical");
    expect(projectHealthStatus({ budgetUsage: 105, progress: 80, delayedStages: 0 })).toBe("critical");
  });

  it("returns warning before critical thresholds", () => {
    expect(projectHealthStatus({ budgetUsage: 82, progress: 60, delayedStages: 0 })).toBe("warning");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 10, delayedStages: 0 })).toBe("warning");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, cashGapRatio: 0.1 })).toBe("warning");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, pendingApprovals: 1 })).toBe("warning");
  });

  it("filters the monthly attendance register and calculates hours", () => {
    const rows = filterAttendanceByMonth([
      { id: 1, projectId: 1, attendanceDate: "2026-08-05", checkIn: "08:00", checkOut: "17:00", employeeName: "أحمد", stageId: 2, status: "present", notes: "" },
      { id: 2, projectId: 1, attendanceDate: "2026-09-05", checkIn: "08:00", checkOut: "16:00", employeeName: "أحمد", stageId: 2, status: "present", notes: "" },
      { id: 3, projectId: 2, attendanceDate: "2026-08-05", checkIn: "08:00", checkOut: "17:00", employeeName: "سارة", stageId: 3, status: "late", notes: "" },
    ], 1, 8, 2026);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toEqual(expect.objectContaining({ id: 1, projectId: 1, attendanceDate: "2026-08-05", checkIn: "08:00", checkOut: "17:00", employeeName: "أحمد", stageId: 2, status: "present", notes: "" }));
    expect(calculateAttendanceHours(rows[0].checkIn, rows[0].checkOut)).toBe(9);
    expect(summarizeAttendanceExceptions([{ projectId: 1, attendanceDate: "2026-08-05", status: "late" }, { projectId: 1, attendanceDate: "2026-08-06", status: "absent" }, { projectId: 2, attendanceDate: "2026-08-06", status: "late" }], 1)).toEqual({ total: 2, absent: 1, late: 1 });
  });

  it("allocates administrative salary by contract value and excludes zero-value projects", () => {
    const rows = allocateAdministrativeAmount(1500, [
      { projectId: 1, projectName: "وادي نمار", contractValue: 10000000 },
      { projectId: 2, projectName: "المهدية", contractValue: 5000000 },
      { projectId: 3, projectName: "غير مؤهل", contractValue: 0 },
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[0].allocatedAmount).toBe(1000);
    expect(rows[1].allocatedAmount).toBe(500);
    expect(rows.reduce((sum, row) => sum + row.allocatedAmount, 0)).toBe(1500);
  });

  it("returns critical for a large cash gap or approval backlog", () => {
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, cashGapRatio: 0.5 })).toBe("critical");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, pendingApprovals: 3 })).toBe("critical");
    expect(projectHealthStatus({ budgetUsage: 40, progress: 60, delayedStages: 0, overdueApprovals: 1 })).toBe("critical");
  });
});
