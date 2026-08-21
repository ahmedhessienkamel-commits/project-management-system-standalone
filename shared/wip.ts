export type WipLedgerLine = { debit: string | number | null; credit: string | number | null };

export function calculateWipBalance(lines: WipLedgerLine[]) {
  const debit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
  const credit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
  return { debit: Number(debit.toFixed(2)), credit: Number(credit.toFixed(2)), balance: Number((debit - credit).toFixed(2)) };
}

export function buildWipClosingLines(balance: number, wipAccountId: number, destinationAccountId: number) {
  if (balance <= 0) throw new Error("WIP balance must be positive before closing");
  if (wipAccountId === destinationAccountId) throw new Error("WIP and destination accounts must differ");
  return [
    { accountId: destinationAccountId, debit: Number(balance.toFixed(2)), credit: 0 },
    { accountId: wipAccountId, debit: 0, credit: Number(balance.toFixed(2)) },
  ] as const;
}
