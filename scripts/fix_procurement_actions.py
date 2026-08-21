from pathlib import Path
path = Path('/home/ubuntu/meta-ads-command-center/client/src/pages/Operations.tsx')
text = path.read_text()
needle = '<p className="mt-2 text-xs text-slate-400">المشروع:'
po_start = text.find('<div className="mt-3"><DocumentActions title={`أمر شراء')
if po_start < 0:
    raise SystemExit('nested purchase action not found')
po_end = text.find(needle, po_start)
if po_end < 0:
    raise SystemExit('nested purchase action end not found')
po_block = text[po_start:po_end]
text = text[:po_start] + text[po_end:]
section_start = text.find('ListCard title="أوامر الشراء والاستلام"')
if section_start < 0:
    raise SystemExit('purchase order list not found')
base_start = text.find('</div>' + needle, section_start)
if base_start < 0:
    raise SystemExit('purchase order project line not found')
replacement = po_block + '</div>' + needle
text = text[:base_start] + replacement + text[base_start + len('</div>' + needle):]
path.write_text(text)
print('procurement action placement fixed')
