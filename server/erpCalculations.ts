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

export function calculateFinancialSummaryTotals({ sales, collections, expenses, payroll }: { sales: Array<{ recognizedRevenue: string | number }>; collections: Array<{ amount: string | number; status: string }>; expenses: Array<{ preTaxAmount: string | number; taxAmount: string | number; totalAmount: string | number; paidAmount: string | number }>; payroll: Array<{ totalAmount: string | number; paidAmount: string | number }> }) {
  const revenue = sales.reduce((sum, row) => sum + Number(row.recognizedRevenue), 0);
  const collectionsReceived = collections.filter((row) => row.status === "received").reduce((sum, row) => sum + Number(row.amount), 0);
  const expensesPreTax = expenses.reduce((sum, row) => sum + Number(row.preTaxAmount), 0);
  const expensesTax = expenses.reduce((sum, row) => sum + Number(row.taxAmount), 0);
  const expensesTotal = expenses.reduce((sum, row) => sum + Number(row.totalAmount), 0);
  const expensesPaid = expenses.reduce((sum, row) => sum + Number(row.paidAmount), 0);
  const payrollTotal = payroll.reduce((sum, row) => sum + Number(row.totalAmount), 0);
  const payrollPaid = payroll.reduce((sum, row) => sum + Number(row.paidAmount), 0);
  return { revenue, collectionsReceived, expensesPreTax, expensesTax, expensesTotal, expensesPaid, payrollTotal, payrollPaid, payrollOutstanding: Math.max(payrollTotal - payrollPaid, 0) };
}

export function canAccessProject(role: string, allowedProjectIds: Set<number> | null, projectId: number) {
  return role === "admin" || allowedProjectIds === null || allowedProjectIds.has(projectId);
}

export function projectNotificationTriggers({ projectName, pendingApprovals, overdueApprovals = 0, scheduleVariancePct = 0, budgetUsage, cashGap, hasAttachments }: { projectName: string; pendingApprovals: number; overdueApprovals?: number; scheduleVariancePct?: number; budgetUsage: number; cashGap: number; hasAttachments: boolean }) {
  const triggers: Array<{ type: string; title: string; message: string }> = [];
  if (pendingApprovals > 0) triggers.push({ type: "approval", title: `موافقات معلقة — ${projectName}`, message: `يوجد ${pendingApprovals} طلب موافقة معلق في المشروع.` });
  if (overdueApprovals > 0) triggers.push({ type: "approval_overdue", title: `موافقات متأخرة — ${projectName}`, message: `يوجد ${overdueApprovals} طلب موافقة تجاوز مدة المراجعة.` });
  if (budgetUsage >= 80) triggers.push({ type: "budget", title: `تنبيه ميزانية — ${projectName}`, message: `استخدام الميزانية وصل إلى ${budgetUsage}%.` });
  if (cashGap > 0) triggers.push({ type: "cash", title: `فجوة سيولة — ${projectName}`, message: `الفجوة النقدية الحالية ${cashGap} ر.س.` });
  if (scheduleVariancePct >= 10) triggers.push({ type: "schedule", title: `تأخر زمني — ${projectName}`, message: `الانحراف عن الخطة الزمنية ${scheduleVariancePct}%.` });
  if (!hasAttachments) triggers.push({ type: "documents", title: `مستندات ناقصة — ${projectName}`, message: "لم يتم تسجيل مرفقات لهذا المشروع بعد." });
  return triggers;
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
