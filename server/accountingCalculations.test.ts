import { describe, expect, it } from "vitest";
import { accountingTotals, buildFixedAssetPosting } from "./accountingCalculations";

describe("accounting totals", () => {
  it("recognizes a balanced journal entry", () => {
    expect(accountingTotals([{ debit: 1000, credit: 0 }, { debit: 0, credit: 1000 }])).toMatchObject({ debit: 1000, credit: 1000, difference: 0, balanced: true });
  });

  it("builds a balanced fixed asset posting from the selected asset card", () => {
    const posting = buildFixedAssetPosting({ assetAccountId: 1301, counterAccountId: 2101, amount: 150000, description: "سيارة الشركة" });
    expect(posting.debit).toMatchObject({ accountId: 1301, debit: 150000, credit: 0 });
    expect(posting.credit).toMatchObject({ accountId: 2101, debit: 0, credit: 150000 });
    expect(accountingTotals([posting.debit, posting.credit]).balanced).toBe(true);
  });

  it("rejects an unbalanced journal entry", () => {
    expect(accountingTotals([{ debit: 1000, credit: 0 }, { debit: 0, credit: 900 }])).toMatchObject({ debit: 1000, credit: 900, difference: 100, balanced: false });
  });
});
