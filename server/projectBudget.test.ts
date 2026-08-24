import { describe, expect, it } from "vitest";
import { calculateParentBudgetMetrics } from "./erpCalculations";

const nimarLines = [
  { type: "revenue", amount: 15708739 },
  { type: "cost", amount: 3000000 },
  { type: "cost", amount: 7761780 },
  { type: "cost", amount: 1000000 },
  { type: "cost", amount: 290150 },
  { type: "cost", amount: 80000 },
  { type: "cost", amount: 69000 },
  { type: "cost", amount: 392718 },
  { type: "cost", amount: 217620 },
  { type: "cost", amount: 105000 },
  { type: "cost", amount: 250000 },
  { type: "zakat", amount: 63562 },
  { type: "profit", amount: 2478909 },
] as const;

describe("Nimar project budget mapping", () => {
  it("calculates excavation as an allocation inside the construction parent budget", () => {
    expect(calculateParentBudgetMetrics({ plannedBudget: 7761780, children: [{ plannedBudget: 76911, actual: 0, paidAmount: 0, outstanding: 0 }] })).toMatchObject({ plannedBudget: 7761780, allocated: 76911, available: 7684869, actual: 0, allocationPct: 0.99 });
  });

  it("does not double count child stages when the parent budget is reported", () => {
    const parent = calculateParentBudgetMetrics({ plannedBudget: 7761780, children: [{ plannedBudget: 76911, actual: 5000, paidAmount: 2000, outstanding: 3000 }] });
    expect(parent.actual).toBe(5000);
    expect(parent.plannedBudget).toBe(7761780);
    expect(parent.available + parent.allocated).toBe(parent.plannedBudget);
  });

  it("reconciles imported planned lines without treating them as actual transactions", () => {
    const revenue = nimarLines.filter((line) => line.type === "revenue").reduce((sum, line) => sum + line.amount, 0);
    const cost = nimarLines.filter((line) => line.type === "cost").reduce((sum, line) => sum + line.amount, 0);
    const zakat = nimarLines.filter((line) => line.type === "zakat").reduce((sum, line) => sum + line.amount, 0);
    const profit = nimarLines.find((line) => line.type === "profit")?.amount ?? 0;

    expect(revenue).toBe(15708739);
    expect(cost).toBe(13166268);
    expect(zakat).toBe(63562);
    expect(profit).toBe(2478909);
    expect(revenue - cost - zakat).toBe(profit);
    expect(nimarLines.every((line) => line.type !== "actual")).toBe(true);
  });
});
