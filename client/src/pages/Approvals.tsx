import DashboardLayout from "@/components/DashboardLayout";
import { DocumentActions } from "@/components/DocumentActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildProfessionalDocumentHtml } from "@/lib/documentTemplate";
import { trpc } from "@/lib/trpc";
import { ArrowRight, CheckCircle2, Clock3, FileCheck2, FileSignature, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

const money = new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 2 });

function ageLabel(value: Date | string | null | undefined) {
  if (!value) return "—";
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000));
  return days === 0 ? "اليوم" : `${days} يوم${days === 1 ? "" : "ًا"}`;
}

function openCertificatePreview(certificate: any, projectName: string, vendorName: string, companyProfile: any, autoPrint = false) {
  const popup = window.open("", "_blank", "width=1000,height=900");
  if (!popup) return;
  const workflow = certificate!.signatureWorkflow;
  const html = buildProfessionalDocumentHtml(companyProfile, {
    title: `مستخلص مقاول ${certificate!.certificateNumber}`,
    englishTitle: "CONTRACTOR PAYMENT CERTIFICATE",
    documentNumber: certificate!.certificateNumber,
    date: certificate!.certificateDate ? String(certificate!.certificateDate).slice(0, 10) : undefined,
    status: certificate!.status,
    partyLabel: "المقاول",
    partyName: vendorName,
    projectName,
    description: certificate!.description || "مستخلص مقدم للاعتماد حسب دورة المشروع.",
    amount: Number(certificate!.preTaxAmount || 0),
    taxAmount: Number(certificate!.taxAmount || 0),
    totalAmount: Number(certificate!.totalAmount || 0),
    paidAmount: Number(certificate!.paidAmount || 0),
    kind: "certificate",
    signatureWorkflow: workflow,
    rows: [{ "البيان": certificate!.description || "مستخلص أعمال مقاول", "قبل الضريبة": Number(certificate!.preTaxAmount || 0), "الضريبة": Number(certificate!.taxAmount || 0), "الإجمالي": Number(certificate!.totalAmount || 0) }],
    previewToolbar: !autoPrint,
    autoPrint,
  });
  popup.document.write(html);
  popup.document.close();
}

export default function Approvals() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: me } = trpc.auth.me.useQuery();
  const { data: approvals = [], isLoading: approvalsLoading } = trpc.erp.approvals.list.useQuery();
  const { data: certificates = [], isLoading: certificatesLoading } = trpc.erp.certificates.list.useQuery();
  const { data: projects = [] } = trpc.erp.projects.list.useQuery();
  const { data: vendors = [] } = trpc.erp.vendors.list.useQuery();
  const { data: companyProfile } = trpc.erp.company.get.useQuery();
  const { data: leaveRequests = [] } = trpc.erp.leaveRequests.list.useQuery();
  const { data: advanceRequests = [] } = trpc.erp.advanceRequests.list.useQuery();
  const { data: costItems = [] } = trpc.erp.costItems.list.useQuery();
  const [inventoryCostItems, setInventoryCostItems] = useState<Record<number, string>>({});
  const [approvalSearch, setApprovalSearch] = useState("");
  const [approvalDate, setApprovalDate] = useState("");
  const decide = trpc.erp.approvals.decide.useMutation({ onSuccess: () => { utils.erp.approvals.list.invalidate(); utils.erp.certificates.list.invalidate(); } });
  const decideInventory = trpc.erp.inventory.movements.decide.useMutation({ onSuccess: () => utils.erp.approvals.list.invalidate() });
  const decideLeave = trpc.erp.leaveRequests.decide.useMutation({ onSuccess: () => utils.erp.leaveRequests.list.invalidate() });
  const decideAdvance = trpc.erp.advanceRequests.decide.useMutation({ onSuccess: () => utils.erp.advanceRequests.list.invalidate() });

  const role = me?.role;
  const certificateQueue = useMemo(() => {
    const pending = approvals.filter((approval) => approval.entityType === "certificate" && approval.status === "pending");
    const allowed = role === "admin" || role === "general_manager" || role === "project_manager";
    if (!allowed) return [];
    return pending.filter((approval) => role === "admin" || approval.approvalStage === (role === "general_manager" ? "general_manager" : "project_manager")).map((approval) => {
      const certificate = certificates.find((item) => item.id === approval.entityId);
      const project = certificate ? projects.find((item) => item.id === certificate!.projectId) : undefined;
      const vendor = certificate ? vendors.find((item) => item.id === certificate!.vendorId) : undefined;
      return { approval, certificate, project, vendor };
    }).filter((item) => item.certificate);
  }, [approvals, certificates, projects, vendors, role]);

  const filteredCertificateQueue = useMemo(() => { const query = approvalSearch.trim().toLowerCase(); return certificateQueue.filter(({ approval, certificate, project, vendor }) => { const matchesText = !query || [certificate?.certificateNumber, project?.name, vendor?.name, String(approval.requestedBy)].some((value) => String(value || "").toLowerCase().includes(query)); const matchesDate = !approvalDate || String(approval.createdAt || "").slice(0, 10) === approvalDate; return matchesText && matchesDate; }); }, [certificateQueue, approvalSearch, approvalDate]);
  const regularApprovals = approvals.filter((approval) => approval.entityType === "payroll" && approval.status === "pending");
  const canDecideEmployeeRequests = role === "admin" || role === "general_manager";
  const pendingLeaves = canDecideEmployeeRequests ? leaveRequests.filter((request) => request.status === "pending") : [];
  const pendingAdvances = canDecideEmployeeRequests ? advanceRequests.filter((request) => request.status === "pending") : [];
  const loading = approvalsLoading || certificatesLoading;
  const reject = (approvalId: number) => {
    const note = window.prompt("اكتب سبب رفض المستخلص وإعادته للتعديل:", "");
    if (note === null) return;
    if (!note.trim()) { window.alert("يجب كتابة سبب الرفض قبل الإرسال."); return; }
    decide.mutate({ id: approvalId, decision: "rejected", note: note.trim() });
  };

  return <DashboardLayout><div dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl space-y-6">
    <header><Button variant="ghost" className="mb-2 gap-2 px-0 text-slate-500" onClick={() => setLocation("/")}><ArrowRight className="h-4 w-4" /> العودة للوحة التنفيذ</Button><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold text-[#18324b]">الموافقات ولوحة توقيع المديرين</h1><p className="mt-2 text-sm text-slate-500">كل مدير يرى المستخلصات التي تنتظر توقيعه في مرحلته فقط، مع بيانات كافية لاتخاذ قرار سريع ومراجع.</p></div><div className="rounded-2xl bg-[#18324b] px-5 py-3 text-white"><p className="text-xs text-white/70">مستخلصات تنتظر توقيعك</p><p className="mt-1 text-2xl font-bold">{filteredCertificateQueue.length}</p></div></div></header><Card className="border-0 shadow-sm"><CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_220px_auto]"><Input value={approvalSearch} onChange={(event) => setApprovalSearch(event.target.value)} placeholder="ابحث برقم المستخلص أو الموظف أو المشروع أو المقاول" /><Input type="date" value={approvalDate} onChange={(event) => setApprovalDate(event.target.value)} aria-label="تصفية حسب التاريخ" /><Button type="button" variant="outline" onClick={() => { setApprovalSearch(""); setApprovalDate(""); }}>مسح المرشحات</Button></CardContent></Card>
    <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><FileSignature className="h-5 w-5 text-[#b28a3b]" /> مستخلصات تنتظر توقيعك {role === "general_manager" ? "— اعتماد المدير العام" : role === "project_manager" ? "— مراجعة مدير المشاريع" : ""}</CardTitle></CardHeader><CardContent>{loading ? <div className="py-14 text-center text-sm text-slate-500">جارٍ تحميل قائمة التوقيعات...</div> : filteredCertificateQueue.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" /><p className="mt-3 font-semibold text-[#18324b]">لا توجد مستخلصات بانتظار توقيعك</p><p className="mt-1 text-sm text-slate-500">ستظهر هنا المستخلصات بمجرد إرسالها إلى مرحلتك.</p></div> : <div className="grid gap-4 lg:grid-cols-2">{filteredCertificateQueue.map(({ approval, certificate, project, vendor }) => <div key={approval.id} className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm"><div className="flex flex-col gap-4"><div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-[#18324b]">{certificate!.certificateNumber}</p><Badge className="bg-amber-50 text-amber-800">بانتظار {approval.approvalStage === "general_manager" ? "الاعتماد النهائي" : "المراجعة"}</Badge></div><p className="mt-2 text-sm text-slate-600">{project?.name || `مشروع #${certificate!.projectId}`} · {vendor?.name || "مقاول غير محدد"}</p></div><div className="rounded-xl bg-amber-50 px-3 py-2 text-center"><Clock3 className="mx-auto h-4 w-4 text-amber-700" /><p className="mt-1 text-xs font-semibold text-amber-800">منذ {ageLabel(approval.createdAt)}</p></div></div><div className="grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4"><div className="rounded-lg bg-slate-50 p-2"><span className="block text-slate-500">الإجمالي</span><b className="text-[#18324b]">{money.format(Number(certificate!.totalAmount || 0))} ر.س</b></div><div className="rounded-lg bg-slate-50 p-2"><span className="block text-slate-500">المدفوع</span><b className="text-emerald-700">{money.format(Number(certificate!.paidAmount || 0))} ر.س</b></div><div className="rounded-lg bg-slate-50 p-2"><span className="block text-slate-500">المتبقي</span><b className="text-amber-700">{money.format(Math.max(Number(certificate!.totalAmount || 0) - Number(certificate!.paidAmount || 0), 0))} ر.س</b></div><div className="rounded-lg bg-slate-50 p-2"><span className="block text-slate-500">العقد</span><b className="text-[#18324b]">#{certificate!.contractId || "—"}</b></div></div><div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3"><DocumentActions title={`مستخلص ${certificate!.certificateNumber}`} preview={() => openCertificatePreview(certificate, project?.name || "", vendor?.name || "", companyProfile)} pdf={() => openCertificatePreview(certificate, project?.name || "", vendor?.name || "", companyProfile, true)} excelRows={[{ "رقم المستخلص": certificate!.certificateNumber, "المشروع": project?.name || certificate!.projectId, "المقاول": vendor?.name || certificate!.vendorId || "", "الإجمالي": Number(certificate!.totalAmount || 0), "الحالة": certificate!.status }]} excelFileName={`مستخلص-${certificate!.certificateNumber}`} /><div className="flex gap-2"><Button disabled={decide.isPending} onClick={() => decide.mutate({ id: approval.id, decision: "approved" })} className="gap-2 bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="h-4 w-4" /> اعتماد وتوقيع</Button><Button disabled={decide.isPending} variant="outline" onClick={() => reject(approval.id)} className="gap-2 border-rose-200 text-rose-700 hover:bg-rose-50"><XCircle className="h-4 w-4" /> رفض بسبب</Button></div></div></div></div>)}</div>}</CardContent></Card>
    <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><FileCheck2 className="h-5 w-5 text-[#b28a3b]" /> بقية الموافقات</CardTitle></CardHeader><CardContent className="space-y-3">{regularApprovals.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">لا توجد موافقات أخرى حاليًا.</p> : regularApprovals.map((approval) => <div key={approval.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-amber-50 p-2 text-amber-700"><Clock3 className="h-5 w-5" /></div><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-[#18324b]">طلب {approval.entityType} #{approval.entityId}</p><Badge variant="outline">{approval.status}</Badge></div><p className="mt-1 text-xs text-slate-500">أنشأه المستخدم #{approval.requestedBy} · {approval.note || "بدون ملاحظة"}</p></div></div>{approval.entityType === "inventoryMovement" && approval.approvalStage === "owner" && role === "admin" && <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3"><p className="text-xs font-semibold text-[#18324b]">تحديد بند التكلفة قبل الاعتماد النهائي</p><select className="mt-2 h-10 w-full rounded-md border border-input bg-white px-3 text-sm" value={inventoryCostItems[approval.entityId] || ""} onChange={(event) => setInventoryCostItems((current) => ({ ...current, [approval.entityId]: event.target.value }))}><option value="">اختر بند التكلفة المحمل عليه</option>{costItems.filter((item) => !item.projectId || item.projectId === approval.projectId).map((item) => <option key={item.id} value={item.id}>{item.code} — {item.name}</option>)}</select></div>}{approval.status === "pending" && <div className="flex gap-2"><Button disabled={decide.isPending || decideInventory.isPending || (approval.entityType === "inventoryMovement" && approval.approvalStage === "owner" && role === "admin" && !inventoryCostItems[approval.entityId])} onClick={() => approval.entityType === "inventoryMovement" ? decideInventory.mutate({ id: approval.entityId, decision: "approved", costItemId: inventoryCostItems[approval.entityId] ? Number(inventoryCostItems[approval.entityId]) : null }) : decide.mutate({ id: approval.id, decision: "approved" })} className="gap-2 bg-emerald-600 hover:bg-emerald-700"><CheckCircle2 className="h-4 w-4" /> اعتماد</Button><Button disabled={decide.isPending || decideInventory.isPending} variant="outline" onClick={() => approval.entityType === "inventoryMovement" ? decideInventory.mutate({ id: approval.entityId, decision: "rejected" }) : reject(approval.id)} className="gap-2 border-rose-200 text-rose-700 hover:bg-rose-50"><XCircle className="h-4 w-4" /> رفض</Button></div>}</div>)}</CardContent></Card>{canDecideEmployeeRequests && <section className="grid gap-6 lg:grid-cols-2"><RequestApprovalCard title="طلبات الإجازات" empty="لا توجد طلبات إجازة بانتظار الاعتماد" items={pendingLeaves.map((request) => ({ id: request.id, title: `${request.leaveType} — ${request.startDate} إلى ${request.endDate}`, detail: `${request.days} يوم · ${request.reason || "بدون ملاحظات"}` }))} onDecide={(id, decision, note) => decideLeave.mutate({ id, decision, note })} pending={decideLeave.isPending} /><RequestApprovalCard title="طلبات السلف" empty="لا توجد طلبات سلفة بانتظار الاعتماد" items={pendingAdvances.map((request) => ({ id: request.id, title: `${request.amount} ر.س`, detail: `${request.reason}${request.repaymentDate ? ` · سداد ${request.repaymentDate}` : ""}` }))} onDecide={(id, decision, note) => decideAdvance.mutate({ id, decision, note })} pending={decideAdvance.isPending} /></section>}
  </div></div></DashboardLayout>;
}

function RequestApprovalCard({ title, empty, items, onDecide, pending }: { title: string; empty: string; items: { id: number; title: string; detail: string }[]; onDecide: (id: number, decision: "approved" | "rejected", note?: string) => void; pending: boolean }) { return <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="text-lg text-[#18324b]">{title}</CardTitle></CardHeader><CardContent className="space-y-3">{items.length ? items.map((item) => <div key={item.id} className="rounded-xl border border-amber-100 bg-white p-4"><p className="font-semibold text-[#18324b]">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.detail}</p><div className="mt-3 flex gap-2"><Button disabled={pending} size="sm" className="bg-emerald-600" onClick={() => onDecide(item.id, "approved")}>اعتماد</Button><Button disabled={pending} size="sm" variant="outline" className="border-rose-200 text-rose-700" onClick={() => { const note = window.prompt("اكتب سبب الرفض"); if (note?.trim()) onDecide(item.id, "rejected", note.trim()); }}>رفض بسبب</Button></div></div>) : <p className="py-8 text-center text-sm text-slate-500">{empty}</p>}</CardContent></Card>; }
