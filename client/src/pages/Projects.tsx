import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CalendarDays, FolderKanban, MapPin, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const statusLabels: Record<string, string> = { planning: "تخطيط", active: "نشط", paused: "متوقف مؤقتًا", completed: "مكتمل", archived: "مؤرشف" };

export default function Projects() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: projects = [], isLoading } = trpc.erp.projects.list.useQuery();
  const createProject = trpc.erp.projects.create.useMutation({ onSuccess: () => utils.erp.projects.list.invalidate() });
  const [form, setForm] = useState({ code: "", name: "", location: "", plannedStart: "", plannedEnd: "" });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;
    createProject.mutate(form, { onSuccess: () => setForm({ code: "", name: "", location: "", plannedStart: "", plannedEnd: "" }) });
  };

  return <DashboardLayout><div dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><Button variant="ghost" className="mb-2 gap-2 px-0 text-slate-500" onClick={() => setLocation("/")}><ArrowRight className="h-4 w-4" /> العودة للوحة التنفيذ</Button><h1 className="text-3xl font-bold text-[#18324b]">المشاريع والمراحل</h1><p className="mt-2 text-sm text-slate-500">أنشئ المشاريع ثم ابنِ المراحل والميزانيات والمخطط الزمني لكل مشروع.</p></div><Badge className="w-fit bg-[#18324b] px-3 py-1">{projects.length} مشاريع</Badge></header>
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><Plus className="h-5 w-5 text-[#b28a3b]" /> إنشاء مشروع جديد</CardTitle></CardHeader><CardContent><form onSubmit={submit} className="space-y-4"><Field label="كود المشروع" value={form.code} onChange={(value) => setForm({ ...form, code: value })} placeholder="PRJ-001" /><Field label="اسم المشروع" value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="اسم المشروع" /><Field label="الموقع" value={form.location} onChange={(value) => setForm({ ...form, location: value })} placeholder="المدينة / الموقع" /><div className="grid grid-cols-2 gap-3"><Field label="بداية مخططة" type="date" value={form.plannedStart} onChange={(value) => setForm({ ...form, plannedStart: value })} /><Field label="نهاية مخططة" type="date" value={form.plannedEnd} onChange={(value) => setForm({ ...form, plannedEnd: value })} /></div><Button disabled={createProject.isPending} className="w-full bg-[#18324b] hover:bg-[#244767]">{createProject.isPending ? "جارٍ الحفظ..." : "حفظ المشروع"}</Button></form></CardContent></Card>
      <Card className="border-0 shadow-sm"><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle className="text-lg text-[#18324b]">سجل المشاريع</CardTitle><p className="mt-1 text-xs text-slate-500">كل مشروع يصبح مساحة عمل مستقلة بصلاحيات وتقارير خاصة.</p></div><Button variant="ghost" size="icon" onClick={() => utils.erp.projects.list.invalidate()}><RefreshCw className="h-4 w-4" /></Button></CardHeader><CardContent className="space-y-3">{isLoading ? <div className="py-12 text-center text-sm text-slate-500">جارٍ تحميل المشاريع...</div> : projects.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center"><FolderKanban className="mx-auto h-9 w-9 text-[#b28a3b]" /><p className="mt-3 text-sm font-semibold text-[#18324b]">لم تتم إضافة مشروع بعد</p></div> : projects.map((project) => <div key={project.id} className="rounded-2xl border border-slate-100 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#18324b]">{project.name}</h3><p className="mt-1 text-xs text-slate-500">{project.code}</p></div><Badge variant="outline">{statusLabels[project.status] ?? project.status}</Badge></div><div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">{project.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{project.location}</span>}<span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{project.plannedStart ? String(project.plannedStart) : "بداية غير محددة"}</span></div></div>)}</CardContent></Card>
    </section>
  </div></div></DashboardLayout>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <div className="space-y-2"><Label className="text-sm text-slate-600">{label}</Label><Input dir="rtl" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10 border-slate-200 bg-white" /></div>;
}
