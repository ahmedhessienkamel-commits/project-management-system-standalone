import { describe, expect, it } from "vitest";
import { buildWipClosingLines, calculateWipBalance } from "../shared/wip";

describe("projects under construction accounting", () => {
  it("calculates the posted WIP balance from ledger lines", () => {
    expect(calculateWipBalance([
      { debit: "1000.00", credit: "0" },
      { debit: 250.5, credit: 0 },
      { debit: 0, credit: "100.50" },
    ])).toEqual({ debit: 1250.5, credit: 100.5, balance: 1150 });
  });

  it("builds a balanced closing entry from WIP to the destination account", () => {
    expect(buildWipClosingLines(1150, 700, 701)).toEqual([
      { accountId: 701, debit: 1150, credit: 0 },
      { accountId: 700, debit: 0, credit: 1150 },
    ]);
    expect(() => buildWipClosingLines(0, 700, 701)).toThrow();
    expect(() => buildWipClosingLines(100, 700, 700)).toThrow();
  });
});
