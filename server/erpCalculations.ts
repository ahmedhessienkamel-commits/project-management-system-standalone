export function calculateExpenseTotals(preTaxAmount: number, taxRate: number) {
  const safePreTax = Math.max(0, preTaxAmount);
  const safeRate = Math.min(100, Math.max(0, taxRate));
  const taxAmount = Number((safePreTax * safeRate / 100).toFixed(2));
  const totalAmount = Number((safePreTax + taxAmount).toFixed(2));
  return { preTaxAmount: safePreTax, taxRate: safeRate, taxAmount, totalAmount };
}

export function calculateCertificateProgress({ plannedBudget, certifiedAmounts }: { plannedBudget: number; certifiedAmounts: Array<number | string> }) {
  const safeBudget = Math.max(0, plannedBudget);
  const certifiedAmount = certifiedAmounts.reduce<number>((sum, amount) => sum + Math.max(0, Number(amount || 0)), 0);
  return { certifiedAmount: Number(certifiedAmount.toFixed(2)), progressPct: safeBudget > 0 ? Number(Math.min(100, (certifiedAmount / safeBudget) * 100).toFixed(2)) : 0 };
}

export function calculatePurchaseInvoiceStatus(invoicedAmount: number, paidAmount: number): "not_received" | "received" | "partially_paid" | "paid" {
  if (invoicedAmount <= 0) return "not_received";
  if (paidAmount >= invoicedAmount) return "paid";
  return paidAmount > 0 ? "partially_paid" : "received";
}

export function calculatePayrollTotals(amount: number) {
  const safeAmount = Math.max(0, amount);
  return { preTaxAmount: safeAmount, taxAmount: 0, totalAmount: safeAmount };
}

export function calculatePayrollTotalsWithDeduction(amount: number, deductionAmount = 0) {
  const safeAmount = Math.max(0, amount);
  const safeDeduction = Math.min(safeAmount, Math.max(0, deductionAmount));
  const totalAmount = Number((safeAmount - safeDeduction).toFixed(2));
  return { preTaxAmount: totalAmount, taxAmount: 0, totalAmount, deductionAmount: safeDeduction };
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

export function allocateAdministrativeAmount(amount: number, projects: Array<{ projectId: number; projectName: string; contractValue: number }>) {
  const safeAmount = Math.max(0, amount);
  const eligible = projects.filter((project) => project.contractValue > 0);
  const totalContractValue = eligible.reduce((sum, project) => sum + project.contractValue, 0);
  return eligible.map((project) => {
    const ratio = totalContractValue ? project.contractValue / totalContractValue : 0;
    return { ...project, ratio, allocatedAmount: Number((safeAmount * ratio).toFixed(2)) };
  });
}

export function calculateDashboardShortcutTotals(summaries: Array<{ plannedBudget: number; actualCost: number; outstandingCost: number; recognizedRevenue: number; collectionsReceived: number; payrollOutstanding: number; cashGap: number; pendingApprovals: number }>) {
  return summaries.reduce((totals, item) => ({
    plannedBudget: totals.plannedBudget + item.plannedBudget,
    actualCost: totals.actualCost + item.actualCost,
    outstandingCost: totals.outstandingCost + item.outstandingCost,
    recognizedRevenue: totals.recognizedRevenue + item.recognizedRevenue,
    collectionsReceived: totals.collectionsReceived + item.collectionsReceived,
    payrollOutstanding: totals.payrollOutstanding + item.payrollOutstanding,
    cashGap: totals.cashGap + item.cashGap,
    pendingApprovals: totals.pendingApprovals + item.pendingApprovals,
  }), { plannedBudget: 0, actualCost: 0, outstandingCost: 0, recognizedRevenue: 0, collectionsReceived: 0, payrollOutstanding: 0, cashGap: 0, pendingApprovals: 0 });
}

export function canAccessProject(role: string, allowedProjectIds: Set<number> | null, projectId: number) {
  return role === "admin" || allowedProjectIds === null || allowedProjectIds.has(projectId);
}

export function canWriteProject(role: string, projectRole?: string | null) {
  if (role === "admin") return true;
  return ["manager", "finance", "input"].includes(projectRole ?? "");
}

export function calculateDocumentCompleteness({ vendors, attachments }: { vendors: Array<{ id: number; name: string; taxNumber?: string | null; commercialRegistration?: string | null }>; attachments: Array<{ entityType: string; entityId: number; documentType: string }> }) {
  const missing: Array<{ vendorId: number; vendorName: string; document: string }> = [];
  for (const vendor of vendors) {
    if (!vendor.taxNumber) missing.push({ vendorId: vendor.id, vendorName: vendor.name, document: "الرقم الضريبي" });
    if (!vendor.commercialRegistration) missing.push({ vendorId: vendor.id, vendorName: vendor.name, document: "السجل التجاري" });
    if (!attachments.some((item) => item.entityType === "vendor" && item.entityId === vendor.id && item.documentType)) missing.push({ vendorId: vendor.id, vendorName: vendor.name, document: "مرفق رسمي" });
  }
  return { complete: missing.length === 0, missing };
}

export function projectNotificationTriggers({ projectName, pendingApprovals, overdueApprovals = 0, scheduleVariancePct = 0, budgetUsage, cashGap, hasAttachments, missingDocumentCount = 0 }: { projectName: string; pendingApprovals: number; overdueApprovals?: number; scheduleVariancePct?: number; budgetUsage: number; cashGap: number; hasAttachments: boolean; missingDocumentCount?: number }) {
  const triggers: Array<{ type: string; title: string; message: string }> = [];
  if (pendingApprovals > 0) triggers.push({ type: "approval", title: `موافقات معلقة — ${projectName}`, message: `يوجد ${pendingApprovals} طلب موافقة معلق في المشروع.` });
  if (overdueApprovals > 0) triggers.push({ type: "approval_overdue", title: `موافقات متأخرة — ${projectName}`, message: `يوجد ${overdueApprovals} طلب موافقة تجاوز مدة المراجعة.` });
  if (budgetUsage >= 80) triggers.push({ type: "budget", title: `تنبيه ميزانية — ${projectName}`, message: `استخدام الميزانية وصل إلى ${budgetUsage}%.` });
  if (cashGap > 0) triggers.push({ type: "cash", title: `فجوة سيولة — ${projectName}`, message: `الفجوة النقدية الحالية ${cashGap} ر.س.` });
  if (scheduleVariancePct >= 10) triggers.push({ type: "schedule", title: `تأخر زمني — ${projectName}`, message: `الانحراف عن الخطة الزمنية ${scheduleVariancePct}%.` });
  if (!hasAttachments) triggers.push({ type: "documents", title: `مستندات ناقصة — ${projectName}`, message: "لم يتم تسجيل مرفقات لهذا المشروع بعد." });
  else if (missingDocumentCount > 0) triggers.push({ type: "documents_detail", title: `استكمال ملفات المقاولين — ${projectName}`, message: `يوجد ${missingDocumentCount} مستند أو بيان إلزامي ناقص للمقاولين.` });
  return triggers;
}

export function projectHealthStatus({ budgetUsage, progress, delayedStages, cashGapRatio = 0, pendingApprovals = 0, overdueApprovals = 0, scheduleVariancePct = 0 }: { budgetUsage: number; progress: number; delayedStages: number; cashGapRatio?: number; pendingApprovals?: number; overdueApprovals?: number; scheduleVariancePct?: number }) {
  if (delayedStages > 0 || budgetUsage >= 100 || cashGapRatio >= 0.5 || pendingApprovals >= 3 || overdueApprovals > 0 || scheduleVariancePct >= 25) return "critical" as const;
  if (budgetUsage >= 80 || cashGapRatio > 0 || pendingApprovals > 0 || scheduleVariancePct > 10) return "warning" as const;
  return "on_track" as const;
}

export function projectHealthReasons({ budgetUsage, progress, delayedStages, cashGap, pendingApprovals, overdueApprovals = 0, scheduleVariancePct = 0 }: { budgetUsage: number; progress: number; delayedStages: number; cashGap: number; pendingApprovals: number; overdueApprovals?: number; scheduleVariancePct?: number }) {
  const reasons: string[] = [];
  if (budgetUsage >= 100) reasons.push("تجاوز الميزانية المخططة");
  else if (budgetUsage >= 80) reasons.push("استخدام أكثر من 80% من الميزانية");
  if (delayedStages > 0) reasons.push(`${delayedStages} مرحلة متأخرة`);
  if (cashGap > 0) reasons.push(`فجوة سيولة ${cashGap.toLocaleString("en-US")} ر.س`);
  if (pendingApprovals > 0) reasons.push(`${pendingApprovals} طلب موافقة معلق`);
  if (overdueApprovals > 0) reasons.push(`${overdueApprovals} موافقة تجاوزت المدة المحددة`);
  if (scheduleVariancePct > 10) reasons.push(`تأخر زمني مقداره ${Math.round(scheduleVariancePct)}% عن الخطة`);
  return reasons.length ? reasons : ["المؤشرات ضمن الحدود المخططة"];
}


export function calculateStraightLineDepreciation({ acquisitionCost, residualValue = 0, usefulLifeMonths, inServiceDate }: { acquisitionCost: number; residualValue?: number; usefulLifeMonths: number; inServiceDate: string }) {
  const safeCost = Math.max(0, acquisitionCost);
  const safeResidual = Math.min(safeCost, Math.max(0, residualValue));
  const safeLife = Math.max(1, Math.floor(usefulLifeMonths));
  const depreciableBase = Number((safeCost - safeResidual).toFixed(2));
  const monthlyAmount = Number((depreciableBase / safeLife).toFixed(2));
  let accumulated = 0;
  return Array.from({ length: safeLife }, (_, index) => {
    const periodStart = new Date(`${inServiceDate}T00:00:00Z`);
    periodStart.setUTCMonth(periodStart.getUTCMonth() + index);
    periodStart.setUTCDate(1);
    const periodEnd = new Date(Date.UTC(periodStart.getUTCFullYear(), periodStart.getUTCMonth() + 1, 0));
    const remaining = Number((depreciableBase - accumulated).toFixed(2));
    const depreciationAmount = index === safeLife - 1 ? Math.max(0, remaining) : Math.min(monthlyAmount, Math.max(0, remaining));
    accumulated = Number((accumulated + depreciationAmount).toFixed(2));
    return { periodStart: periodStart.toISOString().slice(0, 10), periodEnd: periodEnd.toISOString().slice(0, 10), depreciationAmount, accumulatedAmount: accumulated, netBookValue: Number((safeCost - accumulated).toFixed(2)) };
  });
}

export function calculateContractBalance(contractTotal: number, certificateTotals: number[], currentCertificateTotal = 0) {
  const usedBefore = certificateTotals.reduce((sum, amount) => sum + Math.max(0, amount), 0);
  const remainingBefore = Math.max(0, contractTotal - usedBefore);
  const remainingAfter = Math.max(0, remainingBefore - Math.max(0, currentCertificateTotal));
  return { usedBefore, remainingBefore, remainingAfter, exceeds: Math.max(0, currentCertificateTotal) > remainingBefore + 0.01 };
}
