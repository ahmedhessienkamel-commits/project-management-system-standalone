export function calculateExpenseTotals(preTaxAmount: number, taxRate: number) {
  const safePreTax = Math.max(0, preTaxAmount);
  const safeRate = Math.min(100, Math.max(0, taxRate));
  const taxAmount = Number((safePreTax * safeRate / 100).toFixed(2));
  const totalAmount = Number((safePreTax + taxAmount).toFixed(2));
  return { preTaxAmount: safePreTax, taxRate: safeRate, taxAmount, totalAmount };
}

export function calculatePayrollTotals(amount: number) {
  const safeAmount = Math.max(0, amount);
  return { preTaxAmount: safeAmount, taxAmount: 0, totalAmount: safeAmount };
}

export function projectHealthStatus({ budgetUsage, progress, delayedStages, cashGapRatio = 0, pendingApprovals = 0, overdueApprovals = 0, scheduleVariancePct = 0 }: { budgetUsage: number; progress: number; delayedStages: number; cashGapRatio?: number; pendingApprovals?: number; overdueApprovals?: number; scheduleVariancePct?: number }) {
  if (delayedStages > 0 || budgetUsage >= 100 || cashGapRatio >= 0.5 || pendingApprovals >= 3 || overdueApprovals > 0 || scheduleVariancePct >= 25) return "critical" as const;
  if (budgetUsage >= 80 || progress < 20 || cashGapRatio > 0 || pendingApprovals > 0 || scheduleVariancePct > 10) return "warning" as const;
  return "on_track" as const;
}

export function projectHealthReasons({ budgetUsage, progress, delayedStages, cashGap, pendingApprovals, overdueApprovals = 0, scheduleVariancePct = 0 }: { budgetUsage: number; progress: number; delayedStages: number; cashGap: number; pendingApprovals: number; overdueApprovals?: number; scheduleVariancePct?: number }) {
  const reasons: string[] = [];
  if (budgetUsage >= 100) reasons.push("تجاوز الميزانية المخططة");
  else if (budgetUsage >= 80) reasons.push("استخدام أكثر من 80% من الميزانية");
  if (delayedStages > 0) reasons.push(`${delayedStages} مرحلة متأخرة`);
  if (progress < 20) reasons.push("نسبة الإنجاز منخفضة");
  if (cashGap > 0) reasons.push(`فجوة سيولة ${cashGap.toLocaleString("ar-SA")} ر.س`);
  if (pendingApprovals > 0) reasons.push(`${pendingApprovals} طلب موافقة معلق`);
  if (overdueApprovals > 0) reasons.push(`${overdueApprovals} موافقة تجاوزت المدة المحددة`);
  if (scheduleVariancePct > 10) reasons.push(`تأخر زمني مقداره ${Math.round(scheduleVariancePct)}% عن الخطة`);
  return reasons.length ? reasons : ["المؤشرات ضمن الحدود المخططة"];
}
