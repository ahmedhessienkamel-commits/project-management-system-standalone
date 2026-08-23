import { describe, expect, it } from "vitest";

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
