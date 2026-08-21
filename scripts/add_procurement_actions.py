from pathlib import Path
path = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Operations.tsx')
text = path.read_text()
needle = '</div><p className="mt-2 text-xs text-slate-400">المشروع:'
req = '</div><div className="mt-3"><DocumentActions title={`طلب مواد ${item.requestNumber}`} preview={() => openListRowPreview(`طلب مواد ${item.requestNumber}`, item.description || "طلب مواد", item.status)} pdf={() => openListRowPreview(`طلب مواد ${item.requestNumber}`, item.description || "طلب مواد", item.status, true)} excelRows={[{ "رقم الطلب": item.requestNumber, "الوصف": item.description || "", "المشروع": projects.find((project) => project.id === item.projectId)?.name || item.projectId, "الحالة": item.status, "تاريخ الاستحقاق": item.requiredBy || "" }]} excelFileName={`طلب-مواد-${item.requestNumber}`} /></div><p className="mt-2 text-xs text-slate-400">المشروع:'
po = '</div><div className="mt-3"><DocumentActions title={`أمر شراء ${item.orderNumber}`} preview={() => openListRowPreview(`أمر شراء ${item.orderNumber}`, `${money.format(Number(item.totalAmount || 0))} ر.س · ${item.invoiceNumber || "فاتورة غير مسجلة"}`, item.status)} pdf={() => openListRowPreview(`أمر شراء ${item.orderNumber}`, `${money.format(Number(item.totalAmount || 0))} ر.س · ${item.invoiceNumber || "فاتورة غير مسجلة"}`, item.status, true)} excelRows={[{ "رقم الأمر": item.orderNumber, "المشروع": projects.find((project) => project.id === item.projectId)?.name || item.projectId, "المورد": (vendors.data ?? []).find((vendor) => vendor.id === item.vendorId)?.name || item.vendorId, "الإجمالي": Number(item.totalAmount || 0), "الفاتورة": item.invoiceNumber || "", "المفوتر": Number(item.invoicedAmount || 0), "المدفوع": Number(item.paidAmount || 0), "الحالة": item.status }]} excelFileName={`أمر-شراء-${item.orderNumber}`} related={[{ label: "مراقبة المخزون", onClick: () => setLocation(`/inventory?projectId=${item.projectId}`) }]} /></div><p className="mt-2 text-xs text-slate-400">المشروع:'
if text.count(needle) < 2:
    raise SystemExit(f'expected two procurement project lines, found {text.count(needle)}')
text = text.replace(needle, req, 1)
text = text.replace(needle, po, 1)
path.write_text(text)
print('procurement document actions added')
