from pathlib import Path
import re

path = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Finance.tsx')
text = path.read_text()
if 'from "@/lib/documentTemplate"' not in text:
    text = text.replace(
        'import { DocumentActions } from "@/components/DocumentActions";\n',
        'import { DocumentActions } from "@/components/DocumentActions";\nimport { buildProfessionalDocumentHtml } from "@/lib/documentTemplate";\n',
        1,
    )
needle = '  const { data: projects = [] } = trpc.erp.projects.list.useQuery();\n'
if 'const { data: companyProfile } = trpc.erp.company.get.useQuery();' not in text:
    text = text.replace(needle, needle + '  const { data: companyProfile } = trpc.erp.company.get.useQuery();\n', 1)
pattern = re.compile(r'  const preview = \(voucher: any\) => \{.*?\n  const edit =', re.S)
replacement = '''  const preview = (voucher: any) => {
    const projectName = projects.find((project) => project.id === voucher.projectId)?.name || "مصروف إداري عام";
    const popup = window.open("", "_blank", "width=980,height=900");
    if (!popup) { window.alert("اسمح بفتح النوافذ المنبثقة لمعاينة سند الصرف"); return; }
    const html = buildProfessionalDocumentHtml(companyProfile, {
      title: "سند صرف",
      englishTitle: "PAYMENT VOUCHER",
      documentNumber: voucher.documentNumber,
      date: voucher.documentDate ? String(voucher.documentDate).slice(0, 10) : undefined,
      status: voucher.status,
      partyLabel: "المستفيد / الطرف",
      partyName: voucher.partyName || "مصروف عام",
      projectName,
      category: ({ administrative: "مصروف إداري", petty_cash: "نثريات", supplier: "مورد", contractor: "مقاول", materials: "خامات", payroll: "رواتب", operating: "تشغيلي" } as Record<string, string>)[voucher.voucherCategory] || voucher.voucherCategory,
      description: voucher.notes,
      amount: Number(voucher.amount || 0),
      taxAmount: Number(voucher.taxAmount || 0),
      totalAmount: Number(voucher.totalAmount || 0),
      details: [
        { label: "تاريخ السند", value: voucher.documentDate ? String(voucher.documentDate).slice(0, 10) : "—" },
        { label: "طريقة الصرف", value: voucher.paymentMethod === "bank" ? "تحويل بنكي" : "نقدية / خزينة" },
        { label: "المشروع", value: projectName },
      ],
    });
    popup.document.write(html); popup.document.close(); popup.focus();
  };
  const edit ='''
text, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f'preview replacement count={count}')
path.write_text(text)
