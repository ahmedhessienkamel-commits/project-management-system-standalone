import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileSpreadsheet, ShieldCheck, UploadCloud } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import * as XLSX from "xlsx";

type SheetPreview = { name: string; rows: number; columns: number; headers: string[]; sample: string[][] };

export default function LegacyImport() {
  const [, setLocation] = useLocation();
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<SheetPreview[]>([]);
  const [message, setMessage] = useState("لم يتم رفع ملف بعد");

  const readFile = async (file: File) => {
    setFileName(file.name);
    setMessage("جارٍ تحليل الملف محليًا...");
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true, cellFormula: false });
    const previews = workbook.SheetNames.map((name) => {
      const sheet = workbook.Sheets[name];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "", raw: false }) as unknown[][];
      const nonEmpty = rows.filter((row) => row.some((value) => String(value).trim() !== ""));
      const headers = (nonEmpty[0] ?? []).slice(0, 12).map((value) => String(value));
      const sample = nonEmpty.slice(1, 4).map((row) => row.slice(0, 12).map((value) => String(value)));
      return { name, rows: Math.max(nonEmpty.length - 1, 0), columns: headers.length, headers, sample };
    });
    setSheets(previews);
    setMessage(`تمت معاينة ${previews.length} ورقة دون حفظ بيانات`);
  };

  return <DashboardLayout><div dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl space-y-6">
    <header><Button variant="ghost" className="mb-2 gap-2 px-0 text-slate-500" onClick={() => setLocation("/")}><ArrowRight className="h-4 w-4" /> العودة للوحة التنفيذ</Button><h1 className="text-3xl font-bold text-[#18324b]">استيراد ومطابقة Excel</h1><p className="mt-2 text-sm text-slate-500">معاينة آمنة للملف القديم قبل أي إدخال. لا يتم تعديل الملف الأصلي ولا تُنشأ حركات مكررة أثناء المعاينة.</p></header>
    <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><ShieldCheck className="h-5 w-5 text-emerald-600" />قاعدة التسوية</CardTitle></CardHeader><CardContent className="grid gap-4 lg:grid-cols-[1fr_1.4fr]"><div className="rounded-2xl border border-dashed border-[#b28a3b]/50 bg-[#fffaf0] p-5"><UploadCloud className="h-8 w-8 text-[#b28a3b]" /><p className="mt-3 font-semibold text-[#18324b]">ارفع نسخة Excel للمعاينة</p><p className="mt-1 text-xs leading-6 text-slate-500">سيتم فحص الأوراق والعناوين والصفوف غير الفارغة محليًا في المتصفح. خطوة الإدخال النهائية تحتاج مطابقة المشروع ونوع الحركة والمرجع قبل التنفيذ.</p><label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#18324b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#244767]"><FileSpreadsheet className="h-4 w-4" />اختيار ملف<input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file); }} /></label><p className="mt-3 text-xs text-slate-500">{fileName || message}</p></div><div className="rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600"><p className="font-semibold text-[#18324b]">ما الذي سيتم منعه؟</p><p>لن تُرحّل الصيغ والملخصات كحركات جديدة، ولن تُستورد الصفوف الفارغة أو المعادلة. المطابقة النهائية ستعتمد على مرجع الحركة، المشروع، التاريخ، والنوع والمبلغ قبل أي حفظ.</p><p className="mt-3 font-semibold text-[#18324b]">الحالة الحالية</p><Badge variant="outline" className="mt-1">{message}</Badge></div></CardContent></Card>
    {sheets.length > 0 && <section className="grid gap-4 lg:grid-cols-2">{sheets.map((sheet) => <Card key={sheet.name} className="border-0 shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base text-[#18324b]">{sheet.name}</CardTitle><Badge variant="outline">{sheet.rows} صف · {sheet.columns} أعمدة</Badge></CardHeader><CardContent><div className="overflow-x-auto rounded-xl border border-slate-100"><table className="min-w-full text-right text-xs"><thead className="bg-slate-50"><tr>{sheet.headers.map((header, index) => <th key={`${header}-${index}`} className="whitespace-nowrap px-3 py-2 font-semibold text-slate-600">{header || `عمود ${index + 1}`}</th>)}</tr></thead><tbody>{sheet.sample.map((row, rowIndex) => <tr key={rowIndex} className="border-t border-slate-100">{sheet.headers.map((_, columnIndex) => <td key={columnIndex} className="max-w-[180px] truncate px-3 py-2 text-slate-500">{row[columnIndex] || "—"}</td>)}</tr>)}</tbody></table></div></CardContent></Card>)}</section>}
  </div></div></DashboardLayout>;
}
