from pathlib import Path
import re

path = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Accounting.tsx')
text = path.read_text()
if 'from "@/lib/documentTemplate"' not in text:
    text = text.replace(
        'import { DocumentActions } from "@/components/DocumentActions";\n',
        'import { DocumentActions } from "@/components/DocumentActions";\nimport { buildProfessionalDocumentHtml } from "@/lib/documentTemplate";\n',
        1,
    )
old = re.compile(r': `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>\$\{esc\(document\.documentNumber \|\| "مستند محاسبي"\)\}</title></head><body style="font-family:Arial,Tahoma,sans-serif;direction:rtl;padding:40px"><h1>مستند محاسبي</h1><p>\$\{esc\(document\.documentNumber\)\}</p><p>الطرف: \$\{esc\(document\.partyName\)\}</p><p>التاريخ: \$\{esc\(date\)\}</p><h2>\$\{money\.format\(total\)\} ر\.س</h2><p>الحالة: \$\{esc\(status\)\}</p></body></html>`')
replacement = ''': buildProfessionalDocumentHtml(companyProfile, {
      title: document.documentType === "receipt_voucher" ? "سند قبض" : document.documentType === "payment_voucher" ? "سند صرف" : document.documentType === "journal_entry" ? "قيد محاسبي" : "مستند محاسبي",
      englishTitle: document.documentType === "receipt_voucher" ? "RECEIPT VOUCHER" : document.documentType === "payment_voucher" ? "PAYMENT VOUCHER" : document.documentType === "journal_entry" ? "JOURNAL ENTRY" : "ACCOUNTING DOCUMENT",
      documentNumber: document.documentNumber,
      date,
      status: document.status,
      partyLabel: "الطرف / المستفيد",
      partyName: document.partyName,
      projectName: document.projectName,
      description: document.notes,
      amount: base,
      taxAmount: tax,
      totalAmount: total,
      paidAmount: paid,
      referenceLabel: relatedLabel || "المرجع",
      referenceValue: relatedReference || undefined,
      details: [{ label: "تاريخ المستند", value: date }, { label: "نوع المستند", value: document.documentType }, { label: "رقم المرجع", value: document.documentNumber }],
    })'''
text, count = old.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f'accounting fallback replacement count={count}')
path.write_text(text)
