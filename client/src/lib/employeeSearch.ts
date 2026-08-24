export type EmployeeSearchRecord = {
  fullName?: string | null;
  employeeCode?: string | null;
  nationalId?: string | null;
  employmentType?: "employee" | "worker" | null;
};

export function matchesEmployeeSearch(employee: EmployeeSearchRecord, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return `${employee.fullName || ""} ${employee.employeeCode || ""} ${employee.nationalId || ""}`.toLowerCase().includes(normalized);
}

export function filterEmployeesBySearch<T extends EmployeeSearchRecord>(employees: T[], query: string): T[] {
  return employees.filter((employee) => matchesEmployeeSearch(employee, query));
}

export function filterEmployeesByBeneficiaryType<T extends EmployeeSearchRecord>(employees: T[], beneficiaryType: "employee" | "worker"): T[] {
  return employees.filter((employee) => beneficiaryType === "worker" ? employee.employmentType === "worker" : employee.employmentType !== "worker");
}
