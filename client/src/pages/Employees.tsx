import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BriefcaseBusiness, Plus, UserRound } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Employees() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: me } = trpc.auth.me.useQuery();
  const canCreateEmployee = me?.role === "admin" || Number(me?.id) === 13170001;
  const { data: employees = [], isLoading } = trpc.erp.employees.list.useQuery();
  const createEmployee = trpc.erp.employees.create.useMutation({ onSuccess: () => { utils.erp.employees.list.invalidate(); setForm({ employeeCode: "", fullName: "", jobTitle: "", phone: "", nationalId: "" }); } });
  const updateStatus = trpc.erp.employees.updateStatus.useMutation({ onSuccess: () => utils.erp.employees.list.invalidate() });
  const [form, setForm] = useState({ employeeCode: "", fullName: "", jobTitle: "", phone: "", nationalId: "" });

  return <DashboardLayout><div dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><Button variant="ghost" className="mb-2 gap-2 px-0 text-slate-500" onClick={() => setLocation("/")}><ArrowRight className="h-4 w-4" /> العودة للوحة التنفيذ</Button><h1 className="text-3xl font-bold text-[#18324b]">دليل الموظفين</h1><p className="mt-2 text-sm leading-6 text-slate-500">عرّف الموظف مرة واحدة، ثم استخدم كوده في العهد والرواتب والحضور وكشوف الحسابات.</p></div><Badge className="w-fit bg-[#18324b] px-3 py-1">{employees.length} موظف</Badge></header>
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      {canCreateEmployee ? <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><Plus className="h-5 w-5 text-[#b28a3b]" /> إضافة موظف</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); if (!form.employeeCode || !form.fullName) return; createEmployee.mutate(form); }}><Field label="كود الموظف" value={form.employeeCode} onChange={(value) => setForm({ ...form, employeeCode: value })} placeholder="EMP-001" /><Field label="اسم الموظف" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} placeholder="الاسم الرباعي" /><Field label="المسمى الوظيفي" value={form.jobTitle} onChange={(value) => setForm({ ...form, jobTitle: value })} placeholder="مهندس موقع" /><Field label="رقم الجوال" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} /><Field label="رقم الهوية" value={form.nationalId} onChange={(value) => setForm({ ...form, nationalId: value })} /><Button disabled={createEmployee.isPending} className="w-full bg-[#18324b] hover:bg-[#244767]">{createEmployee.isPending ? "جارٍ الحفظ..." : "حفظ الموظف"}</Button></form></CardContent></Card> : <Card className="border-0 bg-[#18324b] text-white shadow-sm"><CardContent className="p-6"><BriefcaseBusiness className="h-8 w-8 text-[#e0b95c]" /><h2 className="mt-5 text-xl font-bold">دليل موحد للموظفين</h2><p className="mt-2 text-sm leading-7 text-slate-300">إضافة الموظف متاحة لـ User 1 ومصطفى، بينما تظل إدارة الحالة والتعديل المتقدم للمسؤول.</p></CardContent></Card>}
      <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="text-lg text-[#18324b]">الموظفون المسجلون</CardTitle><p className="mt-1 text-xs text-slate-500">الحالة غير النشطة تمنع استخدام الموظف في إدخالات جديدة مع الاحتفاظ بتاريخه.</p></CardHeader><CardContent>{isLoading ? <div className="py-10 text-center text-sm text-slate-500">جارٍ التحميل...</div> : employees.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400"><UserRound className="mx-auto mb-3 h-8 w-8 text-[#b28a3b]" />لا يوجد موظفون بعد.</div> : <div className="space-y-3">{employees.map((employee) => <div key={employee.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-700"><UserRound className="h-5 w-5" /></div><div><p className="font-bold text-[#18324b]">{employee.fullName}</p><p className="mt-1 text-xs text-slate-500">{employee.employeeCode}{employee.jobTitle ? ` · ${employee.jobTitle}` : ""}{employee.phone ? ` · ${employee.phone}` : ""}</p></div></div><div className="flex items-center gap-2"><Badge variant="outline" className={employee.status === "active" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-500"}>{employee.status === "active" ? "نشط" : "غير نشط"}</Badge>{me?.role === "admin" && <Button variant="outline" size="sm" onClick={() => updateStatus.mutate({ id: employee.id, status: employee.status === "active" ? "inactive" : "active" })}>{employee.status === "active" ? "تعطيل" : "تفعيل"}</Button>}</div></div>)}</div>}</CardContent></Card>
    </section>
  </div></div></DashboardLayout>;
}

function Field({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) { return <div className="space-y-2"><Label className="text-sm text-slate-600">{label}</Label><Input dir="rtl" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-10 border-slate-200 bg-white" /></div>; }
