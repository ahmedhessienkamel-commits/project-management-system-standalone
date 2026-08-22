export type CompanyIdentity = {
  legalName?: string | null;
  tradeName?: string | null;
  taxNumber?: string | null;
  commercialRegistration?: string | null;
  nationalAddress?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
};

export type DocumentTemplateInput = {
  title: string;
  englishTitle?: string;
  documentNumber?: string | null;
  date?: string | null;
  status?: string | null;
  partyLabel?: string;
  partyName?: string | null;
  projectName?: string | null;
  category?: string | null;
  description?: string | null;
  amount?: number;
  taxAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  currency?: string;
  referenceLabel?: string;
  referenceValue?: string | null;
  details?: Array<{ label: string; value?: string | number | null }>;
  rows?: Array<Record<string, string | number | null>>;
  kind?: "voucher" | "invoice" | "contract" | "certificate" | "inventory" | "report" | "generic";
  showFinancialSummary?: boolean;
  autoPrint?: boolean;
  previewToolbar?: boolean;
  signatureWorkflow?: {
    preparedBy?: { name?: string | null; preparedAt?: string | Date | null } | null;
    projectManager?: { status?: string | null; name?: string | null; reviewedAt?: string | Date | null } | null;
    generalManager?: { status?: string | null; name?: string | null; reviewedAt?: string | Date | null } | null;
  };
};

const esc = (value: unknown) => String(value ?? "—").replace(/[&<>\"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\"": "&quot;",
  "'": "&#39;",
}[character] || character));

const money = (value: number, currency: string) => `${new Intl.NumberFormat("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0)} ${currency}`;

const statusLabel = (value?: string | null) => ({ posted: "مرحل / نهائي", draft: "مسودة", approved: "معتمد", pending: "قيد المراجعة", rejected: "مرفوض", cancelled: "ملغى" }[value || ""] || value || "—");

export function buildProfessionalDocumentHtml(identity: CompanyIdentity | undefined, input: DocumentTemplateInput) {
  const companyName = identity?.tradeName || identity?.legalName || "اسم المنشأة";
  const currency = input.currency || "ر.س";
  const inferredKind = input.kind || (input.title.includes("فاتورة") ? "invoice" : input.title.includes("سند") ? "voucher" : input.title.includes("مستخلص") ? "certificate" : input.title.includes("عقد") ? "contract" : input.title.includes("مخزون") || input.title.includes("استلام") || input.title.includes("سحب") ? "inventory" : input.title.includes("تقرير") || input.title.includes("كشف") ? "report" : "generic");
  const detailHeading = inferredKind === "voucher" ? "بيانات السند" : inferredKind === "invoice" ? "بيانات الفاتورة" : inferredKind === "contract" ? "بيانات العقد" : inferredKind === "certificate" ? "بيانات المستخلص" : inferredKind === "inventory" ? "بيانات الحركة" : inferredKind === "report" ? "بيانات التقرير" : "بيانات المستند";
  const statementHeading = inferredKind === "voucher" ? "تفاصيل القيد والصرف" : inferredKind === "invoice" ? "بنود الفاتورة" : inferredKind === "contract" ? "بنود العقد" : inferredKind === "certificate" ? "بنود المستخلص" : inferredKind === "inventory" ? "تفاصيل حركة المخزون" : "تفاصيل المستند";
  const amountLabel = inferredKind === "voucher" ? "قيمة السند" : inferredKind === "contract" ? "قيمة العقد" : inferredKind === "certificate" ? "قيمة المستخلص" : inferredKind === "inventory" ? "قيمة الحركة" : "المبلغ قبل الضريبة";
  const detailRows = input.details?.filter((item) => item.value !== undefined).map((item) => `<div class="detail"><span>${esc(item.label)}</span><b>${esc(item.value)}</b></div>`).join("") || "";
  const rows = input.rows?.length ? input.rows.map((row) => `<tr>${Object.values(row).map((value) => `<td>${esc(value)}</td>`).join("")}</tr>`).join("") : `<tr><td>${esc(input.description || "—")}</td><td>1</td><td>${money(input.amount || 0, currency)}</td><td>${money(input.totalAmount ?? (input.amount || 0) + (input.taxAmount || 0), currency)}</td></tr>`;
  const headers = input.rows?.length ? Object.keys(input.rows[0]).map((key) => `<th>${esc(key)}</th>`).join("") : "<th>البيان</th><th>الكمية</th><th>القيمة</th><th>الإجمالي</th>";
  const total = input.totalAmount ?? (input.amount || 0) + (input.taxAmount || 0);
  const showFinancialSummary = input.showFinancialSummary ?? inferredKind !== "generic";
  const formatSignatureDate = (value?: string | Date | null) => value ? new Date(value).toLocaleString("ar-SA") : "—";
  const signatureStatus = (status?: string | null) => status === "approved" ? "معتمد إلكترونيًا" : status === "rejected" ? "مرفوض" : status === "pending" ? "بانتظار الاعتماد" : "لم يعتمد بعد";
  const signatureBlock = (role: string, person?: { name?: string | null; status?: string | null; reviewedAt?: string | Date | null } | null, prepared = false) => {
    const name = prepared ? input.signatureWorkflow?.preparedBy?.name : person?.name;
    const date = prepared ? input.signatureWorkflow?.preparedBy?.preparedAt : person?.reviewedAt;
    const status = prepared ? "تم الإعداد" : signatureStatus(person?.status);
    return `<div class="signature ${person?.status === "approved" ? "signed" : ""}"><div class="signature-role">${esc(role)}</div><div class="signature-name">${esc(name || "بانتظار المستخدم المخول")}</div><div class="signature-status">${esc(status)}</div><div class="signature-date">${date ? `التاريخ: ${esc(formatSignatureDate(date))}` : "التوقيع الإلكتروني لم يتم بعد"}</div></div>`;
  };
  const toolbar = input.previewToolbar ? `<nav class="preview-toolbar no-print"><strong>معاينة المستند</strong><span><button onclick="window.print()">تنزيل PDF</button><button onclick="window.close()">إغلاق</button></span></nav>` : "";
  const printScript = `${showFinancialSummary ? "" : "<style>.summary{display:none!important}</style>"}${input.autoPrint === false ? "" : "<script>window.onload=()=>setTimeout(()=>window.print(),250)</script>"}`;
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${esc(input.title)} - ${esc(input.documentNumber)}</title><style>
*{box-sizing:border-box}body{margin:0;background:#eef2f5;color:#172b42;font-family:"Tahoma","Arial",sans-serif;direction:rtl}.page{width:210mm;min-height:297mm;margin:18px auto;background:#fff;box-shadow:0 12px 36px #18324b1c;position:relative;overflow:hidden}.accent{height:8px;background:linear-gradient(90deg,#18324b 0%,#18324b 68%,#b28a3b 68%,#b28a3b 100%)}.content{padding:26px 30px 34px}.brand{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;border-bottom:1px solid #d9e0e8;padding-bottom:20px}.brand-logo{width:118px;height:82px;object-fit:contain}.brand-main{flex:1;text-align:right}.company{font-size:20px;font-weight:800;color:#18324b}.legal{color:#66788d;font-size:11px;line-height:1.9;margin-top:5px}.doc-title{text-align:left;min-width:170px}.doc-title h1{font-size:25px;line-height:1.2;margin:0;color:#18324b}.doc-title p{margin:8px 0 0;color:#b28a3b;font-weight:700;font-size:12px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0}.panel{border:1px solid #d9e0e8;border-radius:10px;padding:14px;background:#fbfcfd}.panel h2{font-size:12px;color:#b28a3b;margin:0 0 10px;border-bottom:1px solid #e9edf2;padding-bottom:8px}.detail{display:flex;justify-content:space-between;gap:14px;border-bottom:1px dashed #e2e8f0;padding:7px 0;font-size:11px}.detail:last-child{border-bottom:0}.detail span{color:#68798d}.detail b{color:#18324b;text-align:left}.statement{border:1px solid #d9e0e8;border-radius:10px;overflow:hidden;margin-top:18px}.statement h2{font-size:13px;margin:0;padding:12px 14px;background:#18324b;color:white}.statement table{width:100%;border-collapse:collapse;font-size:11px}.statement th{background:#f5f0e5;color:#18324b;font-weight:800}.statement th,.statement td{border-bottom:1px solid #e1e7ee;padding:10px 8px;text-align:right}.statement tr:last-child td{border-bottom:0}.summary{display:grid;grid-template-columns:1fr 1fr;gap:0;margin-top:20px;margin-right:auto;width:55%;border:1px solid #d9e0e8;border-radius:10px;overflow:hidden}.summary div{display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid #e5eaf0;font-size:12px}.summary div:nth-last-child(-n+2){border-bottom:0}.summary .grand{background:#f5f0e5;font-size:14px;font-weight:800}.notes{margin-top:18px;border-right:4px solid #b28a3b;background:#fbfcfd;padding:12px;font-size:11px;line-height:1.8}.signatures{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:38px}.signature{border-top:1px solid #94a3b8;padding-top:9px;text-align:center;color:#617286;font-size:11px;min-height:86px}.signature.signed{border-top-color:#16805b}.signature-role{font-weight:800;color:#18324b}.signature-name{margin-top:8px;font-weight:700;color:#18324b}.signature-status{margin-top:5px;color:#16805b;font-size:10px}.signature-date{margin-top:4px;color:#718096;font-size:9px}.footer{display:flex;justify-content:space-between;gap:16px;margin-top:32px;padding-top:12px;border-top:1px solid #d9e0e8;color:#718096;font-size:10px}.stamp{display:inline-flex;border:1px solid #b28a3b;color:#9a762c;border-radius:999px;padding:4px 12px;font-size:10px;font-weight:800}@media print{body{background:#fff}.page{width:auto;min-height:auto;margin:0;box-shadow:none}.content{padding:12mm}.no-print{display:none!important}}
</style></head><body>${toolbar}<main class="page"><div class="accent"></div><div class="content"><section class="brand"><div>${identity?.logoUrl ? `<img class="brand-logo" src="${esc(identity.logoUrl)}" alt="شعار الشركة"/>` : `<div class="brand-logo"></div>`}</div><div class="brand-main"><div class="company">${esc(companyName)}</div><div class="legal">${identity?.legalName && identity.legalName !== companyName ? esc(identity.legalName) + " · " : ""}الرقم الضريبي: ${esc(identity?.taxNumber)} · السجل التجاري: ${esc(identity?.commercialRegistration)}<br/>${esc(identity?.nationalAddress)}<br/>${esc(identity?.phone)} · ${esc(identity?.email)}</div></div><div class="doc-title"><h1>${esc(input.title)}</h1>${input.englishTitle ? `<p>${esc(input.englishTitle)}</p>` : ""}<p>${esc(input.documentNumber)}</p></div></section><section class="meta"><div class="panel"><h2>${esc(detailHeading)}</h2>${detailRows}<div class="detail"><span>الحالة</span><b><span class="stamp">${esc(statusLabel(input.status))}</span></b></div></div><div class="panel"><h2>${esc(input.partyLabel || "الطرف")}</h2><div class="detail"><span>الاسم</span><b>${esc(input.partyName)}</b></div><div class="detail"><span>المشروع</span><b>${esc(input.projectName)}</b></div>${input.category ? `<div class="detail"><span>التصنيف</span><b>${esc(input.category)}</b></div>` : ""}${input.referenceValue ? `<div class="detail"><span>${esc(input.referenceLabel || "المرجع")}</span><b>${esc(input.referenceValue)}</b></div>` : ""}</div></section><section class="statement"><h2>${esc(statementHeading)}</h2><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></section><section class="summary"><div><span>${esc(amountLabel)}</span><b>${money(input.amount || 0, currency)}</b></div><div><span>الضريبة</span><b>${money(input.taxAmount || 0, currency)}</b></div><div class="grand"><span>الإجمالي</span><b>${money(total, currency)}</b></div><div><span>المدفوع</span><b>${money(input.paidAmount || 0, currency)}</b></div></section>${input.description ? `<div class="notes"><b>البيان والملاحظات</b><br/>${esc(input.description)}</div>` : ""}<section class="signatures">${signatureBlock("إعداد المستند", null, true)}${signatureBlock("مراجعة مدير المشاريع", input.signatureWorkflow?.projectManager)}${signatureBlock("اعتماد المدير العام والختم", input.signatureWorkflow?.generalManager)}</section><footer class="footer"><span>${esc(companyName)} · مستند صادر من نظام إدارة المشاريع</span><span>تاريخ الإصدار: ${esc(new Date().toLocaleString("ar-SA"))}</span></footer></div></main>${printScript}</body></html>`;
}
