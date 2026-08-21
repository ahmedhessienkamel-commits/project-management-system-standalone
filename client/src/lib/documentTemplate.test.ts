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
});
