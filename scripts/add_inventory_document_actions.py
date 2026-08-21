from pathlib import Path
import re

path = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Inventory.tsx')
text = path.read_text()

service_pattern = re.compile(r'(?P<block><tbody>\{servicesLoading.*?</tbody>)', re.S)
service_match = service_pattern.search(text)
if not service_match:
    raise SystemExit('service table block not found')
service = service_match.group('block')
service = service.replace('<th className="p-3">الحالة</th>', '<th className="p-3">الحالة</th><th className="p-3">الإجراءات</th>', 1)
service_suffix = '</div></td></tr>)} </tbody>'
if service_suffix in service:
    service = service.replace(service_suffix, '</div></td><td className="p-3"><DocumentActions title={`خدمة #${entry.id}`} preview={() => openInventoryPreview(`سجل خدمة #${entry.id}`, [{ label: "النوع", value: entry.entryType === "equipment_rental" ? "إيجار آلة" : "توريد عمالة" }, { label: "العقد", value: entry.contract?.contractNumber || entry.contractId }, { label: "المورد", value: entry.vendor?.name || entry.vendorId }, { label: "الوصف", value: entry.description || "—" }, { label: "القيمة", value: Number(entry.totalAmount || 0) }])} pdf={() => openInventoryPreview(`سجل خدمة #${entry.id}`, [{ label: "النوع", value: entry.entryType === "equipment_rental" ? "إيجار آلة" : "توريد عمالة" }, { label: "العقد", value: entry.contract?.contractNumber || entry.contractId }, { label: "القيمة", value: Number(entry.totalAmount || 0) }])} excelRows={[{ "رقم السجل": entry.id, "النوع": entry.entryType, "العقد": entry.contract?.contractNumber || entry.contractId, "المورد": entry.vendor?.name || entry.vendorId, "الوصف": entry.description || "", "التاريخ": entry.serviceDate || "", "القيمة": Number(entry.totalAmount || 0), "الحالة": entry.status || "" }]} excelFileName={`خدمة-${entry.id}`} /></td></tr>)} </tbody>', 1)
else:
    old = '</div></td></tr>)}</tbody>'
    if old not in service:
        raise SystemExit('service row suffix not found')
    service = service.replace(old, '</div></td><td className="p-3"><DocumentActions title={`خدمة #${entry.id}`} preview={() => openInventoryPreview(`سجل خدمة #${entry.id}`, [{ label: "النوع", value: entry.entryType === "equipment_rental" ? "إيجار آلة" : "توريد عمالة" }, { label: "العقد", value: entry.contract?.contractNumber || entry.contractId }, { label: "المورد", value: entry.vendor?.name || entry.vendorId }, { label: "الوصف", value: entry.description || "—" }, { label: "القيمة", value: Number(entry.totalAmount || 0) }])} pdf={() => openInventoryPreview(`سجل خدمة #${entry.id}`, [{ label: "النوع", value: entry.entryType === "equipment_rental" ? "إيجار آلة" : "توريد عمالة" }, { label: "العقد", value: entry.contract?.contractNumber || entry.contractId }, { label: "القيمة", value: Number(entry.totalAmount || 0) }])} excelRows={[{ "رقم السجل": entry.id, "النوع": entry.entryType, "العقد": entry.contract?.contractNumber || entry.contractId, "المورد": entry.vendor?.name || entry.vendorId, "الوصف": entry.description || "", "التاريخ": entry.serviceDate || "", "القيمة": Number(entry.totalAmount || 0), "الحالة": entry.status || "" }]} excelFileName={`خدمة-${entry.id}`} /></td></tr>)}</tbody>', 1)
text = text[:service_match.start()] + service + text[service_match.end():]

movement_pattern = re.compile(r'(?P<block><tbody>\{movementsLoading.*?</tbody>)', re.S)
movement_match = movement_pattern.search(text)
if not movement_match:
    raise SystemExit('movement table block not found')
movement = movement_match.group('block')
movement = movement.replace('<th className="p-3">المرجع</th>', '<th className="p-3">المرجع</th><th className="p-3">الإجراءات</th>', 1)
old = '</td></tr>)}</tbody>'
if old not in movement:
    raise SystemExit('movement row suffix not found')
movement = movement.replace(old, '</td><td className="p-3"><DocumentActions title={`${row.movementType === "receipt" ? "استلام" : "سحب"} #${row.id}`} preview={() => openInventoryPreview(`حركة مخزون #${row.id}`, [{ label: "التاريخ", value: row.movementDate ? String(row.movementDate).slice(0, 10) : "—" }, { label: "النوع", value: row.movementType === "receipt" ? "استلام" : "سحب" }, { label: "الخامة", value: row.item?.name || row.itemId }, { label: "المشروع", value: row.project?.name || row.projectId }, { label: "المورد", value: row.vendor?.name || "—" }, { label: "الكمية", value: Number(row.quantity || 0) }, { label: "القيمة", value: Number(row.totalAmount || 0) }, { label: "سند الاستلام", value: row.receiptDocument?.documentNumber || "—" }, { label: "فاتورة الشراء", value: row.purchaseInvoice?.documentNumber || "—" }])} pdf={() => openInventoryPreview(`حركة مخزون #${row.id}`, [{ label: "الخامة", value: row.item?.name || row.itemId }, { label: "الكمية", value: Number(row.quantity || 0) }, { label: "القيمة", value: Number(row.totalAmount || 0) }])} excelRows={[{ "رقم الحركة": row.id, "التاريخ": row.movementDate || "", "النوع": row.movementType, "الخامة": row.item?.name || row.itemId, "المشروع": row.project?.name || row.projectId, "المورد": row.vendor?.name || "", "الكمية": Number(row.quantity || 0), "القيمة": Number(row.totalAmount || 0), "سند الاستلام": row.receiptDocument?.documentNumber || "", "فاتورة الشراء": row.purchaseInvoice?.documentNumber || "", "المرجع": row.reference || "" }]} excelFileName={`حركة-مخزون-${row.id}`} related={[...(row.receiptDocument ? [{ label: `سند الاستلام ${row.receiptDocument.documentNumber}`, onClick: () => openInventoryPreview(`سند الاستلام ${row.receiptDocument.documentNumber}`, [{ label: "الحركة", value: row.id }, { label: "المستند", value: row.receiptDocument.documentNumber }]) }] : []), ...(row.purchaseInvoice ? [{ label: `فاتورة شراء ${row.purchaseInvoice.documentNumber}`, onClick: () => openInventoryPreview(`فاتورة شراء ${row.purchaseInvoice.documentNumber}`, [{ label: "الحركة", value: row.id }, { label: "المستند", value: row.purchaseInvoice.documentNumber }]) }] : [])]} /></td></tr>)}</tbody>', 1)
text = text[:movement_match.start()] + movement + text[movement_match.end():]
path.write_text(text)
print('inventory action columns added')
