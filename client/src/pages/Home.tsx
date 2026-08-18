import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CalendarClock, CheckCircle2, CircleDollarSign, Clock3, FileCheck2, FolderKanban, HandCoins, Landmark, Plus, ReceiptText, ShieldAlert, WalletCards } from "lucide-react";
import { useLocation } from "wouter";

const statusLabels = {
  on_track: { label: "على المسار", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  warning: { label: "يحتاج متابعة", className: "bg-amber-50 text-amber-700 border-amber-200" },
  critical: { label: "خطر / متأخر", className: "bg-rose-50 text-rose-700 border-rose-200" },
};

const money = new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 });

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: summaries = [], isLoading } = trpc.erp.dashboard.summary.useQuery();
  const totalBudget = summaries.reduce((sum, item) => sum + item.plannedBudget, 0);
  const totalActual = summaries.reduce((sum, item) => sum + item.actualCost, 0);
  const totalOutstanding = summaries.reduce((sum, item) => sum + item.outstandingCost, 0);
  const criticalCount = summaries.filter((item) => item.status === "critical").length;
  const warningCount = summaries.filter((item) => item.status === "warning").length;
  const totalRevenue = summaries.reduce((sum, item) => sum + item.recognizedRevenue, 0);
  const totalCollections = summaries.reduce((sum, item) => sum + item.collectionsReceived, 0);
  const totalPayrollOutstanding = summaries.reduce((sum, item) => sum + item.payrollOutstanding, 0);
  const totalCashGap = summaries.reduce((sum, item) => sum + item.cashGap, 0);
  const totalPendingApprovals = summaries.reduce((sum, item) => sum + item.pendingApprovals, 0);

  return (
    <DashboardLayout>
      <div dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-wide text-[#b28a3b]">مركز القيادة التنفيذية</p>
              <h1 className="text-3xl font-bold tracking-tight text-[#18324b] sm:text-4xl">صورة المشروع في لحظة</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">اعرف من أول نظرة هل التنفيذ يسير وفق المخطط، وما سبب أي انحراف في الميزانية أو المراحل أو السيولة.</p>
            </div>
            <Button onClick={() => setLocation("/projects")} className="gap-2 bg-[#18324b] hover:bg-[#244767]">
              <Plus className="h-4 w-4" />
              إضافة مشروع
            </Button>
          </header>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={FolderKanban} label="المشاريع النشطة" value={String(summaries.filter((item) => item.project.status === "active").length)} hint={`${summaries.length} إجمالي المشاريع`} tone="blue" onClick={() => setLocation("/projects")} />
            <MetricCard icon={Landmark} label="الميزانية المخططة" value={`${money.format(totalBudget)} ر.س`} hint="من العقد والمراحل" tone="gold" onClick={() => setLocation("/reports")} />
            <MetricCard icon={WalletCards} label="التكلفة الفعلية" value={`${money.format(totalActual)} ر.س`} hint={`${money.format(totalOutstanding)} ر.س مستحق`} tone="rose" onClick={() => setLocation("/finance")} />
            <MetricCard icon={ReceiptText} label="المصروفات المستحقة" value={`${money.format(totalOutstanding + totalPayrollOutstanding)} ر.س`} hint="تكاليف ورواتب غير مدفوعة" tone="amber" onClick={() => setLocation("/finance")} />
            <MetricCard icon={CircleDollarSign} label="الإيراد المعترف به" value={`${money.format(totalRevenue)} ر.س`} hint="من مبيعات الوحدات" tone="green" onClick={() => setLocation("/sales")} />
            <MetricCard icon={HandCoins} label="التحصيلات" value={`${money.format(totalCollections)} ر.س`} hint="الدفعات المستلمة" tone="teal" onClick={() => setLocation("/sales")} />
            <MetricCard icon={Clock3} label="رواتب مستحقة" value={`${money.format(totalPayrollOutstanding)} ر.س`} hint="غير مدفوعة حتى الآن" tone="violet" onClick={() => setLocation("/finance")} />
            <MetricCard icon={WalletCards} label="فجوة السيولة" value={`${money.format(totalCashGap)} ر.س`} hint="تمويل مطلوب" tone="rose" onClick={() => setLocation("/reports")} />
            <MetricCard icon={FileCheck2} label="موافقات معلقة" value={String(totalPendingApprovals)} hint={`${criticalCount} حالة حرجة`} tone="slate" onClick={() => setLocation("/approvals")} />
          </section>

          <section className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <CardTitle className="text-lg text-[#18324b]">صحة المشاريع</CardTitle>
                  <p className="mt-1 text-xs text-slate-500">مقارنة مباشرة بين المخطط والفعلي لكل مشروع</p>
                </div>
                <Button variant="ghost" className="gap-1 text-[#18324b]" onClick={() => setLocation("/reports")}>كل التقارير <ArrowLeft className="h-4 w-4" /></Button>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                {isLoading ? <div className="py-12 text-center text-sm text-slate-500">جارٍ تحميل مؤشرات المشاريع...</div> : summaries.length === 0 ? <EmptyProjects onAdd={() => setLocation("/projects")} /> : summaries.map((item) => {
                  const status = statusLabels[item.status as keyof typeof statusLabels] ?? statusLabels.warning;
                  return <div key={item.project.id} className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-[#b28a3b]/40 hover:shadow-sm" onClick={() => setLocation(`/projects/${item.project.id}`)}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2"><h3 className="font-bold text-[#18324b]">{item.project.name}</h3><Badge variant="outline" className={status.className}>{status.label}</Badge></div>
                        <p className="mt-1 text-xs text-slate-500">{item.project.code}{item.project.location ? ` · ${item.project.location}` : ""} · {item.stageCount} مراحل</p>
                      </div>
                      <div className="text-left"><p className="text-xs text-slate-500">استخدام الميزانية</p><p className={`text-xl font-bold ${item.budgetUsage >= 100 ? "text-rose-600" : item.budgetUsage >= 80 ? "text-amber-600" : "text-[#18324b]"}`}>{item.budgetUsage}%</p></div>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-center"><div><div className="mb-2 flex justify-between text-xs text-slate-500"><span>إنجاز المراحل {item.progress}%</span><span>فعلي {money.format(item.actualCost)} / مخطط {money.format(item.plannedBudget)} ر.س</span></div><Progress value={Math.min(item.progress, 100)} className="h-2" /></div><div className="text-left text-xs text-slate-500">{item.delayedStages ? `${item.delayedStages} مرحلة متأخرة` : "لا توجد مراحل متأخرة"}</div></div><div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">{item.reasons.map((reason) => <span key={reason} className={`rounded-full px-2.5 py-1 text-xs ${item.status === "critical" ? "bg-rose-50 text-rose-700" : item.status === "warning" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{reason}</span>)}</div>
                  </div>;
                })}
              </CardContent>
            </Card>

            <Card className="border-0 bg-[#18324b] text-white shadow-sm">
              <CardHeader><CardTitle className="text-lg">مؤشر الإدارة</CardTitle><p className="text-sm leading-6 text-slate-300">الأرقام الحمراء لا تكتفي بالتنبيه؛ النظام سيقودك إلى سبب الانحراف والإجراء المطلوب.</p></CardHeader>
              <CardContent className="space-y-4"><InsightRow icon={CheckCircle2} label="مشاريع على المسار" value={String(summaries.filter((item) => item.status === "on_track").length)} tone="text-emerald-300" /><InsightRow icon={CalendarClock} label="مراحل تحتاج متابعة" value={String(summaries.reduce((sum, item) => sum + item.delayedStages, 0))} tone="text-amber-300" /><InsightRow icon={ShieldAlert} label="قرارات حرجة" value={String(criticalCount)} tone="text-rose-300" /><div className="border-t border-white/10 pt-4 text-xs leading-6 text-slate-300">الخطوة التالية: إنشاء المشاريع والمراحل ثم تسجيل أول معاملة مالية ليبدأ المؤشر في بناء الصورة التنفيذية.</div></CardContent>
            </Card>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ icon: Icon, label, value, hint, tone, onClick }: { icon: typeof FolderKanban; label: string; value: string; hint: string; tone: "blue" | "gold" | "rose" | "amber" | "green" | "teal" | "violet" | "slate"; onClick?: () => void }) {
  const colors = { blue: "bg-blue-50 text-blue-700", gold: "bg-amber-50 text-amber-700", rose: "bg-rose-50 text-rose-700", amber: "bg-orange-50 text-orange-700", green: "bg-emerald-50 text-emerald-700", teal: "bg-cyan-50 text-cyan-700", violet: "bg-violet-50 text-violet-700", slate: "bg-slate-100 text-slate-700" };
  return <Card onClick={onClick} className={`group border-0 shadow-sm transition duration-200 ${onClick ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md" : ""}`}><CardContent className="flex min-h-[132px] items-start justify-between p-5"><div><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-[#18324b]">{value}</p><p className="mt-1 text-xs text-slate-400">{hint}</p></div><div className={`rounded-2xl p-3 transition group-hover:scale-105 ${colors[tone]}`}><Icon className="h-5 w-5" /></div></CardContent></Card>;
}

function InsightRow({ icon: Icon, label, value, tone }: { icon: typeof CheckCircle2; label: string; value: string; tone: string }) {
  return <div className="flex items-center justify-between rounded-xl bg-white/5 p-3"><div className="flex items-center gap-3"><Icon className={`h-5 w-5 ${tone}`} /><span className="text-sm text-slate-200">{label}</span></div><span className="text-xl font-bold">{value}</span></div>;
}

function EmptyProjects({ onAdd }: { onAdd: () => void }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center"><FolderKanban className="mx-auto h-10 w-10 text-[#b28a3b]" /><h3 className="mt-3 font-bold text-[#18324b]">لا توجد مشاريع بعد</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">ابدأ بإنشاء المشروع الأول، ثم أضف مراحله وميزانياته ليظهر لك الأداء المخطط مقابل الفعلي.</p><Button onClick={onAdd} className="mt-5 bg-[#18324b] hover:bg-[#244767]">إنشاء أول مشروع</Button></div>;
}
