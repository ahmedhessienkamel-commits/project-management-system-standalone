import { describe, expect, it } from "vitest";
import { buildProfessionalDocumentHtml } from "./documentTemplate";

describe("professional document preview mode", () => {
  const input = {
    title: "سند قبض",
    documentNumber: "RCV-001",
    partyName: "عميل تجريبي",
    amount: 100,
    totalAmount: 100,
    kind: "voucher" as const,
  };

  it("renders an in-page PDF button without auto-print in preview mode", () => {
    const html = buildProfessionalDocumentHtml(undefined, { ...input, autoPrint: false, previewToolbar: true });
    expect(html).toContain("تنزيل PDF");
    expect(html).toContain("window.print()");
    expect(html).not.toContain("window.onload=()=>setTimeout(()=>window.print(),250)");
  });

  it("keeps automatic printing available for direct PDF mode", () => {
    const html = buildProfessionalDocumentHtml(undefined, { ...input, autoPrint: true, previewToolbar: false });
    expect(html).not.toContain("معاينة المستند");
    expect(html).toContain("window.onload=()=>setTimeout(()=>window.print(),250)");
  });

  it("renders approval signature roles, names, statuses, and dates", () => {
    const html = buildProfessionalDocumentHtml(undefined, {
      ...input,
      title: "مستخلص مقاول",
      kind: "certificate",
      signatureWorkflow: {
        preparedBy: { name: "المحاسب أحمد", preparedAt: "2026-08-21T10:00:00.000Z" },
        projectManager: { name: "مدير المشاريع", status: "approved", reviewedAt: "2026-08-21T11:00:00.000Z" },
        generalManager: { name: null, status: "pending", reviewedAt: null },
      },
    });
    expect(html).toContain("إعداد المستند");
    expect(html).toContain("المحاسب أحمد");
    expect(html).toContain("مراجعة مدير المشاريع");
    expect(html).toContain("مدير المشاريع");
    expect(html).toContain("معتمد إلكترونيًا");
    expect(html).toContain("اعتماد المدير العام والختم");
    expect(html).toContain("بانتظار المستخدم المخول");
  });

  it("renders real company, project, rows, and financial totals for contracts and certificates", () => {
    const html = buildProfessionalDocumentHtml({
      legalName: "شركة أنظمة البناء المتقدمة المحدودة",
      commercialRegistration: "1010628913",
      taxNumber: "310484788500003",
      nationalAddress: "الرياض — العنوان الوطني",
    }, {
      title: "عقد A.B.00079",
      kind: "contract",
      documentNumber: "A.B.00079",
      projectName: "نمار",
      partyName: "شركة درة العلاء للمقاولات",
      amount: 66879,
      taxAmount: 10031.85,
      totalAmount: 76910.85,
      rows: [{ "البند": "أعمال الحفر", "الإجمالي": 76910.85 }],
    });
    expect(html).toContain("شركة أنظمة البناء المتقدمة المحدودة");
    expect(html).toContain("نمار");
    expect(html).toContain("شركة درة العلاء للمقاولات");
    expect(html).toContain("أعمال الحفر");
    expect(html).toContain("٧٦٬٩١٠٫٨٥");
    expect(html).not.toContain("اسم المنشأة");
  });

  it("suppresses misleading financial summary cards for a supplier reference profile", () => {
    const html = buildProfessionalDocumentHtml(undefined, {
      title: "شركة درة العلاء للمقاولات",
      documentNumber: "VENDOR-1",
      kind: "generic",
      showFinancialSummary: false,
      partyLabel: "المورد / المقاول",
      partyName: "شركة درة العلاء للمقاولات",
      rows: [{ "العنوان الوطني": "الرياض — حي النرجس", "السجل التجاري": "1010628913" }],
    });
    expect(html).toContain("شركة درة العلاء للمقاولات");
    expect(html).toContain("الرياض — حي النرجس");
    expect(html).toContain(".summary{display:none!important}");
  });
});
