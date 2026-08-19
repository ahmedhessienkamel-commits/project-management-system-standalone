import { describe, expect, it } from "vitest";
import { accountingTotals } from "./accountingCalculations";

describe("accounting totals", () => {
  it("recognizes a balanced journal entry", () => {
    expect(accountingTotals([{ debit: 1000, credit: 0 }, { debit: 0, credit: 1000 }])).toMatchObject({ debit: 1000, credit: 1000, difference: 0, balanced: true });
  });

  it("rejects an unbalanced journal entry", () => {
    expect(accountingTotals([{ debit: 1000, credit: 0 }, { debit: 0, credit: 900 }])).toMatchObject({ debit: 1000, credit: 900, difference: 100, balanced: false });
  });
});
