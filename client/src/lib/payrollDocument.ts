import { buildProfessionalDocumentHtml } from "@/lib/documentTemplate";

type PayrollRunRow = {
  id?: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  classification?: string | null;
  projectId?: number | null;
  stageId?: number | null;
  preTaxAmount?: string | number | null;
  totalAmount?: string | number | null;
  paidAmount?: string | number | null;
  absenceDays?: number | null;
  deductionAmount?: string | number | null;
  advanceDeductionAmount?: string | number | null;
};

type PayrollRun = {
  id: number;
  runNumber?: string | null;
  month?: number | null;
  year?: number | null;
  status?: string | null;
  totalAmount?: string | number | null;
  paidAmount?: string | number | null;
  submittedAt?: string | Date | null;
  approvedAt?: string | Date | null;
  createdAt?: string | Date | null;
  rows?: PayrollRunRow[];
};

const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const statusLabels: Record<string, string> = { draft: "مسودة", pending: "بانتظار الاعتماد", approved: "معتمد ومستحق", rejected: "معاد للتعديل", partially_paid: "مسدد جزئيًا", paid: "مسدد بالكامل" };
const classificationLabels: Record<string, string> = { project: "على مشروع", administrative: "إداري" };
const numberValue = (value: unknown) => Number(value || 0);
const dateValue = (value: unknown) => value ? String(value).slice(0, 10) : "—";

export function openPayrollRunDocument(
  run: PayrollRun,
  companyProfile: unknown,
  projects: Array<{ id: number; name: string }>,
  stages: Array<{ id: number; name: string }>,
  autoPrint = false,
) {
  const popup = window.open("", "_blank", "width=1100,height=900");
  if (!popup) {
    window.alert("اسمح بفتح النوافذ المنبثقة لمعاينة مسير الرواتب.");
    return;
  }
  const rows = run.rows || [];
  const totalAmount = numberValue(run.totalAmount) || rows.reduce((sum, row) => sum + numberValue(row.totalAmount), 0);
  const paidAmount = numberValue(run.paidAmount) || rows.reduce((sum, row) => sum + numberValue(row.paidAmount), 0);
  const outstandingAmount = Math.max(totalAmount - paidAmount, 0);
  const monthLabel = run.month ? months[Number(run.month) - 1] || String(run.month) : "—";
  const html = buildProfessionalDocumentHtml(companyProfile as any, {
    title: "مسير رواتب",
    englishTitle: "PAYROLL RUN",
    documentNumber: run.runNumber || `PR-${run.id}`,
    date: dateValue(run.submittedAt || run.createdAt),
    status: run.status,
    partyLabel: "بيانات المسير",
    partyName: `مسير ${monthLabel} ${run.year || "—"}`,
    projectName: "مسير شامل للشركة",
    category: "رواتب وأجور",
    description: "كشف تفصيلي لمسير الرواتب متضمنًا إجمالي الرواتب والخصومات والمدفوع والمتبقي المستحق.",
    amount: totalAmount,
    taxAmount: 0,
    totalAmount,
    paidAmount,
    kind: "report",
    details: [
      { label: "الشهر", value: `${monthLabel} ${run.year || "—"}` },
      { label: "عدد الموظفين / الأجراء", value: rows.length },
      { label: "تاريخ إنشاء المسير", value: dateValue(run.createdAt) },
      { label: "تاريخ الإرسال", value: dateValue(run.submittedAt) },
      { label: "تاريخ الاعتماد النهائي", value: dateValue(run.approvedAt) },
      { label: "إجمالي المستحق", value: `${outstandingAmount.toFixed(2)} ر.س` },
    ],
    rows: rows.map((row) => {
      const gross = numberValue(row.preTaxAmount) || numberValue(row.totalAmount) + numberValue(row.deductionAmount) + numberValue(row.advanceDeductionAmount);
      const absenceDeduction = numberValue(row.deductionAmount);
      const advanceDeduction = numberValue(row.advanceDeductionAmount);
      const net = numberValue(row.totalAmount);
      const paid = numberValue(row.paidAmount);
      return {
        "الموظف / الأجير": row.employeeName || "—",
        "الكود": row.employeeCode || "—",
        "التصنيف": classificationLabels[row.classification || ""] || row.classification || "—",
        "المشروع": projects.find((project) => project.id === row.projectId)?.name || (row.classification === "administrative" ? "إداري عام" : "—"),
        "المرحلة": stages.find((stage) => stage.id === row.stageId)?.name || "—",
        "إجمالي الراتب": gross.toFixed(2),
        "أيام الغياب": row.absenceDays || 0,
        "خصم الغياب": absenceDeduction.toFixed(2),
        "خصم السلفة": advanceDeduction.toFixed(2),
        "صافي المستحق": net.toFixed(2),
        "المدفوع": paid.toFixed(2),
        "المتبقي": Math.max(net - paid, 0).toFixed(2),
      };
    }),
    previewToolbar: !autoPrint,
    autoPrint,
  });
  popup.document.write(html);
  popup.document.close();
  popup.focus();
}

export type { PayrollRun };
