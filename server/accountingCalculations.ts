export type AccountingLine = { debit: number; credit: number };

export function accountingTotals(lines: AccountingLine[]) {
  const debit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
  const credit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);
  return { debit, credit, difference: debit - credit, balanced: Math.abs(debit - credit) <= 0.01 };
}


export function buildFixedAssetPosting({ assetAccountId, counterAccountId, amount, description }: { assetAccountId: number; counterAccountId: number; amount: number; description: string }) {
  const safeAmount = Number(Math.max(0, amount).toFixed(2));
  return {
    debit: { accountId: assetAccountId, description, debit: safeAmount, credit: 0 },
    credit: { accountId: counterAccountId, description, debit: 0, credit: safeAmount },
  };
}
