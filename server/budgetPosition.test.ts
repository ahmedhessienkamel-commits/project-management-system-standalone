import { describe, expect, it } from "vitest";
import { calculateBudgetPosition } from "./erpCalculations";

describe("calculateBudgetPosition", () => {
  it("reports remaining budget when actual cost is below the stage budget", () => {
    expect(calculateBudgetPosition(76911, 18630)).toMatchObject({
      planned: 76911,
      actual: 18630,
      remaining: 58281,
      overrun: 0,
      withinBudget: true,
    });
  });

  it("reports overrun instead of a false remaining balance when actual exceeds budget", () => {
    expect(calculateBudgetPosition(1000, 1250)).toMatchObject({
      remaining: 0,
      overrun: 250,
      withinBudget: false,
      consumptionPct: 125,
    });
  });

  it("keeps an undefined stage budget distinct from project actual cost", () => {
    expect(calculateBudgetPosition(0, 18630)).toMatchObject({
      planned: 0,
      actual: 18630,
      remaining: 0,
      overrun: 18630,
      consumptionPct: 0,
    });
  });
});
