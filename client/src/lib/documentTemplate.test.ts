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
});
