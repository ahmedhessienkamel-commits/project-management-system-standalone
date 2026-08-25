export type ProjectBudgetPosition = {
  projectEstimatedTotal: number;
  stageBudgetTotal: number;
  unallocatedAmount: number;
  stageCoveragePct: number;
};

/**
 * The project estimate is the whole-project baseline. Stage budgets are a
 * breakdown of that baseline and must not replace or get added to it twice.
 */
export function calculateProjectBudgetPosition(
  projectEstimatedTotal: number | string | null | undefined,
  stageBudgets: Array<number | string | null | undefined>,
): ProjectBudgetPosition {
  const projectTotal = Math.max(0, Number(projectEstimatedTotal || 0));
  const stageTotal = stageBudgets.reduce<number>((sum, budget) => sum + Math.max(0, Number(budget || 0)), 0);
  return {
    projectEstimatedTotal: projectTotal,
    stageBudgetTotal: stageTotal,
    unallocatedAmount: projectTotal - stageTotal,
    stageCoveragePct: projectTotal > 0 ? (stageTotal / projectTotal) * 100 : 0,
  };
}
