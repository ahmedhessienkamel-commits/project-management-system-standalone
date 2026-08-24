import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { filterEmployeesByBeneficiaryType, filterEmployeesBySearch } from "@/lib/employeeSearch";
import { Search, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";

const money = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const statusLabel: Record<string, string> = { pending: "بانتظار الاعتماد", approved: "معتمدة", rejected: "مرفوضة", cancelled: "ملغاة", scheduled: "مجدول", reserved: "ضمن مسودة مسير", applied: "خُصم من مسير معتمد", deferred: "مؤجل", cancelled_repayment: "ملغى" };

type Employee = { id: number; fullName: string; employeeCode?: string | null; nationalId?: string | null; employmentType?: "employee" | "worker" | null };

type AdvanceForm = {
  amount: string;
  reason: string;
  repaymentMode: "single" | "installments";
  repaymentStartMonth: string;
  repaymentStartYear: string;
  installmentCount: string;
};

export function EmployeeAdvanceLedger({ employees, me, employeesLoading = false, employeesError = null }: { employees: Employee[]; me: any; employeesLoading?: boolean; employeesError?: string | null }) {
  const utils = trpc.useUtils();
  const canManage = me?.role === "admin" || me?.role === "general_manager" || Number(me?.id) === 13170001;
  const [beneficiaryType, setBeneficiaryType] = useState<"employee" | "worker">("employee");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [createBeneficiaryType, setCreateBeneficiaryType] = useState<"employee" | "worker">("employee");
  const [createEmployeeId, setCreateEmployeeId] = useState("");
  const [createEmployeeSearch, setCreateEmployeeSearch] = useState("");
  const [advanceSearch, setAdvanceSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [form, setForm] = useState<AdvanceForm>({ amount: "", reason: "", repaymentMode: "single", repaymentStartMonth: String(new Date().getMonth() + 1), repaymentStartYear: String(new Date().getFullYear()), installmentCount: "1" });
  const statement = trpc.erp.advanceRequests.statement.useQuery({ employeeId: Number(employeeId || 0) }, { enabled: Boolean(employeeId) && canManage });
  const create = trpc.erp.advanceRequests.create.useMutation({ onSuccess: () => { void statement.refetch(); void utils.erp.advanceRequests.list.invalidate(); setForm((current) => ({ ...current, amount: "", reason: "" })); } });

  const filteredEmployees = useMemo(() => {
    const query = employeeSearch.trim().toLowerCase();
    const eligibleEmployees = filterEmployeesByBeneficiaryType(employees, beneficiaryType);
    if (!query) return eligibleEmployees;
    return filterEmployeesBySearch(eligibleEmployees, query);
  }, [employees, employeeSearch, beneficiaryType]);

  const createFilteredEmployees = useMemo(() => {
    const query = createEmployeeSearch.trim().toLowerCase();
    const eligibleEmployees = filterEmployeesByBeneficiaryType(employees, createBeneficiaryType);
    if (!query) return eligibleEmployees;
    return filterEmployeesBySearch(eligibleEmployees, query);
  }, [employees, createEmployeeSearch, createBeneficiaryType]);

  const rows = useMemo(() => (statement.data?.advances || []).filter((advance: any) => {
    const text = `${advance.reason || ""} ${advance.status || ""} ${advance.amount || ""}`.toLowerCase();
    const date = String(advance.createdAt || "").slice(0, 10);
    return (!advanceSearch.trim() || text.includes(advanceSearch.trim().toLowerCase())) && (status === "all" || advance.status === status) && (!from || date >= from) && (!to || date <= to);
  }), [statement.data, advanceSearch, status, from, to]);

  if (!canManage) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!createEmployeeId || !form.amount || !form.reason.trim()) return;
    create.mutate({ employeeId: Number(createEmployeeId), amount: Number(form.amount), reason: form.reason.trim(), repaymentMode: form.repaymentMode, repaymentStartMonth: Number(form.repaymentStartMonth), repaymentStartYear: Number(form.repaymentStartYear), installmentCount: form.repaymentMode === "installments" ? Number(form.installmentCount) : 1 });
  };

  return <Card className="border-0 shadow-sm">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><WalletCards className="h-5 w-5 text-[#b28a3b]" /> تسجيل وكشف حساب سلف الموظفين</CardTitle>
          <p className="text-xs text-slate-500">حدّد أولًا هل المستفيد موظف شركة أو أجير، ثم اختره من السجل المناسب. يستخدم الأجير رقم الإقامة للبحث، وتبقى السلفة مرتبطة بسجل المستفيد نفسه في كشف الحساب ومسير الرواتب.</p>{employeesLoading ? <p className="mt-2 text-xs text-blue-700">جارٍ تحميل دليل الموظفين...</p> : employeesError ? <p className="mt-2 rounded-lg bg-rose-50 p-2 text-xs text-rose-700">{employeesError}</p> : <p className="mt-2 text-xs text-slate-500">تم تحميل {employees.length} سجلًا؛ موظفو الشركة والأجراء يظهرون بعد اختيار النوع.</p>}
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-4">
        <div className="space-y-1.5 md:col-span-1"><Label>نوع المستفيد</Label><select value={beneficiaryType} onChange={(event) => { setBeneficiaryType(event.target.value as "employee" | "worker"); setEmployeeId(""); setEmployeeSearch(""); }} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="employee">موظف شركة</option><option value="worker">موظف أجير</option></select></div>
        <div className="relative space-y-1.5 md:col-span-2">
          <Label>{beneficiaryType === "worker" ? "بحث برقم إقامة الأجير أو اسمه" : "بحث الموظف بالاسم أو الكود أو الهوية"}</Label>
          <Search className="absolute right-3 top-9 h-4 w-4 text-slate-400" />
          <Input className="pr-9" value={employeeSearch} onChange={(event) => setEmployeeSearch(event.target.value)} placeholder={beneficiaryType === "worker" ? "اكتب رقم الإقامة أو اسم الأجير" : "اكتب الاسم أو الكود أو رقم الهوية"} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label>{beneficiaryType === "worker" ? "الأجير المستفيد من السلفة" : "موظف الشركة المستفيد من السلفة"}</Label>
          <select value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">
            <option value="">{beneficiaryType === "worker" ? "اختر الأجير" : "اختر موظف الشركة"}</option>
            {filteredEmployees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName} — {beneficiaryType === "worker" ? `رقم الإقامة: ${employee.nationalId || "غير مسجل"}` : `الكود: ${employee.employeeCode || "غير مسجل"}`}</option>)}
          </select>
          <p className="text-[11px] text-slate-500">{beneficiaryType === "worker" ? "تظهر هنا سجلات الأجير فقط، والبحث يطابق رقم الإقامة المحفوظ في ملفه." : "تظهر هنا سجلات موظفي الشركة فقط."}</p>{!employeesLoading && !employeesError && filteredEmployees.length === 0 ? <p className="mt-1 text-[11px] text-amber-700">لا توجد سجلات مطابقة لهذا النوع أو البحث. أضف الموظف من دليل الموظفين أو راجع قيمة نوع التوظيف.</p> : null}
        </div>
        <div className="relative md:col-span-2">
          <Label>بحث داخل كشف السلفة</Label>
          <Search className="absolute right-3 top-9 h-4 w-4 text-slate-400" />
          <Input className="mt-1 pr-9" value={advanceSearch} onChange={(event) => setAdvanceSearch(event.target.value)} placeholder="ابحث بالسبب أو الحالة أو المبلغ" />
        </div>
        <div className="space-y-1.5"><Label>حالة السلفة</Label><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="all">كل الحالات</option><option value="pending">بانتظار الاعتماد</option><option value="approved">معتمدة</option><option value="rejected">مرفوضة</option></select></div>
        <div className="space-y-1.5"><Label>من تاريخ</Label><Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></div>
        <div className="space-y-1.5"><Label>إلى تاريخ</Label><Input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></div>
      </div>

      <form className="grid gap-3 rounded-2xl border border-amber-100 bg-amber-50/40 p-4 md:grid-cols-4" onSubmit={submit}>
        <div className="md:col-span-4"><h3 className="font-bold text-[#18324b]">إنشاء سلفة جديدة</h3><p className="mt-1 text-xs text-slate-500">{createEmployeeId ? `سيتم تسجيل السلفة للمستفيد المختار باعتباره ${createBeneficiaryType === "worker" ? "أجيرًا" : "موظف شركة"}.` : `اختر المستفيد من داخل هذا النموذج أولًا، ثم حدّد طريقة السداد وشهر بداية الخصم قبل إرسال السلفة للاعتماد.`}</p></div>
        <div className="space-y-1.5"><Label>نوع المستفيد في السلفة</Label><select value={createBeneficiaryType} onChange={(event) => { setCreateBeneficiaryType(event.target.value as "employee" | "worker"); setCreateEmployeeId(""); setCreateEmployeeSearch(""); }} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="employee">موظف شركة</option><option value="worker">موظف أجير</option></select></div>
        <div className="relative space-y-1.5"><Label>{createBeneficiaryType === "worker" ? "بحث برقم الإقامة أو الاسم" : "بحث بالاسم أو الكود أو الهوية"}</Label><Search className="absolute right-3 top-9 h-4 w-4 text-slate-400" /><Input className="pr-9" value={createEmployeeSearch} onChange={(event) => setCreateEmployeeSearch(event.target.value)} placeholder={createBeneficiaryType === "worker" ? "رقم إقامة الأجير" : "اسم أو كود الموظف"} /></div>
        <div className="space-y-1.5 md:col-span-2"><Label>{createBeneficiaryType === "worker" ? "الأجير المستفيد" : "الموظف المستفيد"}</Label><select value={createEmployeeId} onChange={(event) => setCreateEmployeeId(event.target.value)} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="">{createBeneficiaryType === "worker" ? "اختر الأجير" : "اختر موظف الشركة"}</option>{createFilteredEmployees.map((employee) => <option key={employee.id} value={employee.id}>{employee.fullName} — {createBeneficiaryType === "worker" ? `رقم الإقامة: ${employee.nationalId || "غير مسجل"}` : `الكود: ${employee.employeeCode || "غير مسجل"}`}</option>)}</select><p className="text-[11px] text-slate-500">{createBeneficiaryType === "worker" ? "البحث هنا يستخدم رقم الإقامة المسجل في دليل الأجراء." : "هذا الاختيار مستقل عن فلتر كشف الحساب أعلاه."}</p>{!employeesLoading && !employeesError && createFilteredEmployees.length === 0 ? <p className="mt-1 text-[11px] text-amber-700">لا توجد سجلات مطابقة. أضف المستفيد الحقيقي من دليل الموظفين.</p> : null}</div>
        <div className="space-y-1.5"><Label>قيمة السلفة</Label><Input type="number" min="1" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} required /></div>
        <div className="space-y-1.5"><Label>نمط الخصم</Label><select value={form.repaymentMode} onChange={(event) => setForm({ ...form, repaymentMode: event.target.value as "single" | "installments", installmentCount: event.target.value === "installments" ? "2" : "1" })} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="single">خصم كامل من مسير واحد</option><option value="installments">تقسيط على عدة مسيرات</option></select></div>
        <div className="space-y-1.5"><Label>شهر بدء الخصم</Label><select value={form.repaymentStartMonth} onChange={(event) => setForm({ ...form, repaymentStartMonth: event.target.value })} className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm">{months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}</select></div>
        <div className="space-y-1.5"><Label>سنة البدء</Label><Input type="number" min="2024" value={form.repaymentStartYear} onChange={(event) => setForm({ ...form, repaymentStartYear: event.target.value })} /></div>
        {form.repaymentMode === "installments" && <div className="space-y-1.5"><Label>عدد الأقساط</Label><Input type="number" min="2" max="120" value={form.installmentCount} onChange={(event) => setForm({ ...form, installmentCount: event.target.value })} /></div>}
        <div className="space-y-1.5 md:col-span-2"><Label>سبب السلفة</Label><Input value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} required placeholder="مثل: سلفة طارئة للموظف" /></div>
        <div className="flex items-end"><Button className="w-full bg-[#18324b]" disabled={create.isPending || !createEmployeeId}>{create.isPending ? "جارٍ حفظ السلفة..." : "إرسال سلفة للاعتماد"}</Button></div>
      </form>

      {!employeeId ? <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">اختر الموظف لعرض كشف الحساب والأقساط المسجلة.</p> : <>
        <div className="grid gap-3 md:grid-cols-3"><div className="rounded-xl bg-blue-50 p-4"><span className="text-xs text-blue-700">إجمالي السلف المعتمدة</span><p className="mt-1 text-xl font-bold text-[#18324b]">{money.format(Number(statement.data?.totals.grantedAmount || 0))} ر.س</p></div><div className="rounded-xl bg-emerald-50 p-4"><span className="text-xs text-emerald-700">المخصوم من المسيرات</span><p className="mt-1 text-xl font-bold text-[#18324b]">{money.format(Number(statement.data?.totals.appliedAmount || 0))} ر.س</p></div><div className="rounded-xl bg-amber-50 p-4"><span className="text-xs text-amber-700">رصيد السلف المتبقي</span><p className="mt-1 text-xl font-bold text-[#18324b]">{money.format(Number(statement.data?.totals.outstandingAmount || 0))} ر.س</p></div></div>
        <div className="space-y-3">{statement.isLoading ? <p className="py-8 text-center text-sm text-slate-500">جارٍ تحميل كشف السلف...</p> : rows.length ? rows.map((advance: any) => <div key={advance.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-[#18324b]">سلفة #{advance.id} — {money.format(Number(advance.amount || 0))} ر.س</p><p className="mt-1 text-xs text-slate-500">{advance.reason} · {String(advance.createdAt || "").slice(0, 10)}</p></div><div className="flex gap-2"><Badge variant="outline">{statusLabel[advance.status] || advance.status}</Badge><Badge className="bg-amber-50 text-amber-800">المتبقي {money.format(Number(advance.outstandingAmount || 0))} ر.س</Badge></div></div><div className="mt-3 grid gap-2 md:grid-cols-3">{(advance.repayments || []).map((repayment: any) => <div key={repayment.id} className="rounded-lg bg-slate-50 p-3 text-xs"><b>{months[Number(repayment.scheduledMonth) - 1]} {repayment.scheduledYear}</b><span className="mx-1">·</span>{money.format(Number(repayment.scheduledAmount || 0))} ر.س<span className="mx-1">·</span><span className="text-slate-500">{statusLabel[repayment.status] || repayment.status}</span></div>)}</div></div>) : <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">لا توجد سلف مطابقة لمرشحات البحث الحالية.</p>}</div>
      </>}
    </CardContent>
  </Card>;
}
