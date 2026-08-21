from pathlib import Path
import re

path = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/SalesCollections.tsx')
text = path.read_text()
pattern = re.compile(r'<div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick=\{\(\) => item\.kind === "invoice" \? onInvoicePreview\(item\) : preview\(item\)\}>معاينة</Button>.*?</div></div>\)\}\{!rows\.length', re.S)
replacement = '''<DocumentActions title={item.number} preview={() => item.kind === "invoice" ? onInvoicePreview(item) : preview(item)} pdf={item.kind === "invoice" ? () => onInvoicePdf(item) : item.kind === "certificate" ? () => onCertificatePdf(item) : undefined} edit={() => item.kind === "invoice" ? onInvoiceEdit(item) : item.kind === "certificate" ? onCertificateEdit(item) : onCollectionEdit(item)} excelRows={[{ "رقم المستند": item.number, "النوع": item.kindLabel, "الطرف": item.party, "التاريخ": item.documentDate || item.certificateDate || item.collectionDate || "", "الحالة": item.status || "", "القيمة": Number(item.amount || 0) }]} excelFileName={item.number} related={item.kind === "invoice" ? [{ label: "تحصيل دفعة", onClick: () => onInvoiceCollect(item) }] : item.kind === "certificate" ? [{ label: "تحويل لفاتورة", onClick: () => onCertificateInvoice(item) }] : []} canDelete={isAdmin} onDelete={() => onDelete(item.kind, item.id)} />​</div></div>)}{!rows.length'''
new_text, count = pattern.subn(replacement, text, count=1)
if count != 1:
    raise SystemExit(f'expected one document action block, found {count}')
path.write_text(new_text)
print('replaced', count)
