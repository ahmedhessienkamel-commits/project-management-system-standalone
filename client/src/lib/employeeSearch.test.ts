import { describe, expect, it } from "vitest";
import { filterEmployeesByBeneficiaryType, filterEmployeesBySearch, matchesEmployeeSearch } from "./employeeSearch";

describe("employee search", () => {
  const employees = [
    { fullName: "أحمد علي", employeeCode: "EMP-001", nationalId: "2233445566", employmentType: "employee" as const },
    { fullName: "عامل موقع", employeeCode: "EMP-002", nationalId: "1122334455", employmentType: "worker" as const },
  ];

  it("matches an employee by residency or national ID", () => {
    expect(matchesEmployeeSearch(employees[1], "1122334455")).toBe(true);
    expect(filterEmployeesBySearch(employees, "1122334455")).toEqual([employees[1]]);
  });

  it("matches by name and code and returns all records for an empty query", () => {
    expect(filterEmployeesBySearch(employees, "أحمد")).toEqual([employees[0]]);
    expect(filterEmployeesBySearch(employees, "EMP-002")).toEqual([employees[1]]);
    expect(filterEmployeesBySearch(employees, "")).toEqual(employees);
  });

  it("separates company employees from workers while preserving residency search", () => {
    expect(filterEmployeesByBeneficiaryType(employees, "employee")).toEqual([employees[0]]);
    expect(filterEmployeesByBeneficiaryType(employees, "worker")).toEqual([employees[1]]);
    expect(filterEmployeesBySearch(filterEmployeesByBeneficiaryType(employees, "worker"), "1122334455")).toEqual([employees[1]]);
  });
});
