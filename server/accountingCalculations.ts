export type AccountingLine = { debit: number; credit: number };

export function accountingTotals(lines: AccountingLine[]) {
  const debit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
  const credit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
  return { debit, credit, difference: debit - credit, balanced: Math.abs(debit - credit) <= 0.01 };
}
