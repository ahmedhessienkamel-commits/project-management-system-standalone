import { Download, Eye, FileSpreadsheet, Link2, Pencil, Printer, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

type RelatedAction = { label: string; onClick: () => void };

type DocumentActionsProps = {
  title: string;
  preview?: () => void;
  edit?: () => void;
  pdf?: () => void;
  excelRows?: Array<Record<string, unknown>>;
  excelFileName?: string;
  related?: RelatedAction[];
  canDelete?: boolean;
  onDelete?: () => void;
  disabled?: boolean;
};

export function DocumentActions({ title, preview, edit, pdf, excelRows, excelFileName, related = [], canDelete, onDelete, disabled }: DocumentActionsProps) {
  const exportExcel = () => {
    if (!excelRows?.length) return;
    const sheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "المستند");
    XLSX.writeFile(workbook, `${excelFileName || title || "مستند"}.xlsx`);
  };
  const printPdf = pdf || (() => window.print());
  return <div className="flex flex-wrap items-center justify-end gap-1.5 print:hidden" dir="rtl">
    {preview && <Button type="button" size="sm" variant="outline" className="gap-1" onClick={preview} disabled={disabled}><Eye className="h-3.5 w-3.5" /> معاينة</Button>}
    <Button type="button" size="sm" variant="outline" className="gap-1" onClick={printPdf} disabled={disabled}><Printer className="h-3.5 w-3.5" /> PDF</Button>
    {excelRows && <Button type="button" size="sm" variant="outline" className="gap-1" onClick={exportExcel} disabled={disabled || !excelRows.length}><FileSpreadsheet className="h-3.5 w-3.5" /> Excel</Button>}
    {edit && <Button type="button" size="sm" variant="outline" className="gap-1" onClick={edit} disabled={disabled}><Pencil className="h-3.5 w-3.5" /> تعديل</Button>}
    {related.map((action) => <Button key={action.label} type="button" size="sm" variant="outline" className="gap-1 text-[#18324b]" onClick={action.onClick} disabled={disabled}><Link2 className="h-3.5 w-3.5" /> {action.label}</Button>)}
    {canDelete && onDelete && <Button type="button" size="sm" variant="outline" className="gap-1 border-rose-200 text-rose-700 hover:bg-rose-50" onClick={onDelete} disabled={disabled}><Trash2 className="h-3.5 w-3.5" /> حذف</Button>}
  </div>;
}
