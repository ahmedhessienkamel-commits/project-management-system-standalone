export type ExpenseAllocation = "project" | "administrative" | "general_cash" | "petty_cash";

export type ContractProject = { projectId: number; contractValue: number };
export type AdministrativeAllocation = { projectId: number; ratio: number; allocatedAmount: number };

export function allocateAdministrativeExpense(amount: number, projects: ContractProject[]): AdministrativeAllocation[] {
  const eligible = projects.filter((project) => project.contractValue > 0);
  const totalContractValue = eligible.reduce((sum, project) => sum + project.contractValue, 0);
  if (amount <= 0 || totalContractValue <= 0) return [];
  let allocated = 0;
  return eligible.map((project, index) => {
    const ratio = project.contractValue / totalContractValue;
    const allocatedAmount = index === eligible.length - 1 ? Number((amount - allocated).toFixed(2)) : Number((amount * ratio).toFixed(2));
    allocated += allocatedAmount;
    return { projectId: project.projectId, ratio, allocatedAmount };
  });
}

export function validateExpenseAllocation(input: { projectId?: number; stageId?: number; classification: ExpenseAllocation }) {
  if (input.classification === "project" && !input.projectId) {
    return { ok: false as const, message: "اختر المشروع عند تحميل المصروف على مشروع" };
  }
  if (input.classification !== "project" && input.stageId) {
    return { ok: false as const, message: "المرحلة متاحة فقط للمصروف المحمل على مشروع" };
  }
  return { ok: true as const };
}
