import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

type Option = { value: string; label: string };

export function AdministrativeCustodyExpenseForm({ employeeOptions, costItemOptions }: { employeeOptions: Option[]; costItemOptions: Option[] }) {
  const utils = trpc.useUtils();
  const [form, setForm] = useState({ employeeCode: "", costItemId: "", description: "", amount: "", movementDate: new Date().toISOString().slice(0, 10) });
  const [message, setMessage] = useState<string | null>(null);
  const save = trpc.erp.custodyMovements.createAdministrativeExpense.useMutation({
    onSuccess: () => {
      setMessage("تم تسجيل الصرف الإداري وربطه ببند التكلفة وكشف العهد.");
      setForm((current) => ({ ...current, costItemId: "", description: "", amount: "" }));
      void utils.erp.custodyMovements.list.invalidate();
      void utils.erp.custodyMovements.statement.invalidate();
      void utils.erp.reports.costCenter.invalidate();
      void utils.erp.dashboard.invalidate();
    },
    onError: (error) => setMessage(error.message || "تعذر تسجيل الصرف الإداري."),
  });
  const selectedEmployee = employeeOptions.find((item) => item.value === form.employeeCode);
  const employeeName = selectedEmployee?.label.split(" — ")[0] || form.employeeCode;
  return <Card className="border border-violet-100 bg-violet-50/40 shadow-sm"><CardHeader><CardTitle className="text-lg text-[#18324b]">صرف مصروف إداري من العهدة</CardTitle><p className="text-sm text-slate-600">اختر صاحب العهدة ثم بند المصروف الإداري. تحفظ العملية مرة واحدة في كشف العهدة والمصروفات الإدارية.</p></CardHeader><CardContent><form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5" onSubmit={(event) => { event.preventDefault(); if (!form.employeeCode || !form.costItemId || !form.description.trim() || Number(form.amount) <= 0) { setMessage("أكمل صاحب العهدة وبند المصروف والوصف والمبلغ."); return; } save.mutate({ employeeCode: form.employeeCode, employeeName, costItemId: Number(form.costItemId), description: form.description.trim(), amount: Number(form.amount), movementDate: form.movementDate || undefined }); }}><div className="space-y-1.5"><Label>صاحب العهدة</Label><select required value={form.employeeCode} onChange={(event) => setForm({ ...form, employeeCode: event.target.value })} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="">اختر...</option>{employeeOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div><div className="space-y-1.5"><Label>بند المصروف الإداري</Label><select required value={form.costItemId} onChange={(event) => setForm({ ...form, costItemId: event.target.value })} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="">اختر البند...</option>{costItemOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div><div className="space-y-1.5"><Label>الوصف</Label><Input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="مثال: رسوم حكومية أو اشتراك خدمة" /></div><div className="space-y-1.5"><Label>المبلغ</Label><Input required min="0.01" step="0.01" type="number" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} /></div><div className="space-y-1.5"><Label>تاريخ الصرف</Label><Input type="date" value={form.movementDate} onChange={(event) => setForm({ ...form, movementDate: event.target.value })} /><Button type="submit" className="mt-2 w-full bg-[#18324b] hover:bg-[#254765]" disabled={save.isPending}>{save.isPending ? "جارٍ الحفظ..." : "تسجيل الصرف الإداري"}</Button></div></form>{message && <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${message.startsWith("تم") ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{message}</p>}{!costItemOptions.length && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">لا توجد بنود تكلفة إدارية نشطة بعد؛ أضفها من شجرة بنود التكلفة لتظهر هنا.</p>}</CardContent></Card>;
}
