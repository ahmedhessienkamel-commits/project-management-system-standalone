export type AdvanceScheduleEntry = {
  scheduledMonth: number;
  scheduledYear: number;
  scheduledAmount: number;
};

export function buildAdvanceSchedule(amount: number, startMonth: number, startYear: number, installmentCount: number): AdvanceScheduleEntry[] {
  const safeAmount = Math.max(0, Number(amount || 0));
  const safeCount = Math.max(1, Math.floor(Number(installmentCount || 1)));
  const entries: AdvanceScheduleEntry[] = [];
  let remaining = Number(safeAmount.toFixed(2));
  for (let index = 0; index < safeCount; index += 1) {
    const sequence = (startYear * 12) + (startMonth - 1) + index;
    const scheduledYear = Math.floor(sequence / 12);
    const scheduledMonth = (sequence % 12) + 1;
    const scheduledAmount = index === safeCount - 1 ? remaining : Number((safeAmount / safeCount).toFixed(2));
    remaining = Number((remaining - scheduledAmount).toFixed(2));
    entries.push({ scheduledMonth, scheduledYear, scheduledAmount });
  }
  return entries;
}

export function advanceOutstandingAmount(advanceAmount: number, appliedAmounts: Array<number | string>) {
  const applied = appliedAmounts.reduce<number>((total, amount) => total + Math.max(0, Number(amount || 0)), 0);
  return Number(Math.max(Number(advanceAmount || 0) - applied, 0).toFixed(2));
}

export function calculateAdvanceDeduction(input: { grossPayrollAmount: number; otherDeductionAmount: number; dueAmount: number; requestedAmount?: number }) {
  const grossPayrollAmount = Math.max(0, Number(input.grossPayrollAmount || 0));
  const otherDeductionAmount = Math.min(grossPayrollAmount, Math.max(0, Number(input.otherDeductionAmount || 0)));
  const dueAmount = Math.max(0, Number(input.dueAmount || 0));
  const availableForAdvance = Math.max(grossPayrollAmount - otherDeductionAmount, 0);
  const requestedAmount = Number(input.requestedAmount || 0) > 0 ? Number(input.requestedAmount) : dueAmount;
  const appliedAmount = Number(Math.min(Math.max(requestedAmount, 0), dueAmount, availableForAdvance).toFixed(2));
  return {
    appliedAmount,
    carryForwardAmount: Number(Math.max(dueAmount - appliedAmount, 0).toFixed(2)),
    netPayrollAmount: Number(Math.max(availableForAdvance - appliedAmount, 0).toFixed(2)),
  };
}

export function calculatePayrollAdvanceAccrualAmounts(netPayrollAmount: number, advanceDeductionAmount: number) {
  const safeNetPayrollAmount = Math.max(0, Number(netPayrollAmount || 0));
  const safeAdvanceDeductionAmount = Math.max(0, Number(advanceDeductionAmount || 0));
  const payrollExpenseAmount = Number((safeNetPayrollAmount + safeAdvanceDeductionAmount).toFixed(2));
  return {
    payrollExpenseAmount,
    payrollPayableCredit: payrollExpenseAmount,
    advanceSettlementDebit: safeAdvanceDeductionAmount,
    advanceSettlementCredit: safeAdvanceDeductionAmount,
    outstandingPayrollPayable: safeNetPayrollAmount,
  };
}

export function isRepaymentDue(entry: { scheduledMonth: number; scheduledYear: number; status: string }, month: number, year: number) {
  if (!["scheduled", "deferred"].includes(entry.status)) return false;
  return (entry.scheduledYear * 12 + entry.scheduledMonth) <= (year * 12 + month);
}
