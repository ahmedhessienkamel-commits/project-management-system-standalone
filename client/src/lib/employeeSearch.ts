export type EmployeeSearchRecord = {
  fullName?: string | null;
  employeeCode?: string | null;
  nationalId?: string | null;
};

export function matchesEmployeeSearch(employee: EmployeeSearchRecord, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return `${employee.fullName || ""} ${employee.employeeCode || ""} ${employee.nationalId || ""}`.toLowerCase().includes(normalized);
}

export function filterEmployeesBySearch<T extends EmployeeSearchRecord>(employees: T[], query: string): T[] {
  return employees.filter((employee) => matchesEmployeeSearch(employee, query));
}
