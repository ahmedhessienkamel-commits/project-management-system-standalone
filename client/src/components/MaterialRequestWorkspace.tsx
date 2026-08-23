import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, AlertTriangle, ClipboardList, FilePenLine, PackageSearch, Plus, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const planningLabel = { within_plan: "ضمن المخطط", over_plan: "يتجاوز المخطط", unplanned: "غير مرتبط بمخطط" } as const;
const planningClass = { within_plan: "bg-emerald-50 text-emerald-800", over_plan: "bg-rose-50 text-rose-800", unplanned: "bg-amber-50 text-amber-800" } as const;
const emptyDraft = { projectId: "", stageId: "", inventoryItemId: "", costItemId: "", description: "", quantity: "1", estimatedUnitCost: "", requiredBy: "" };
const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 });

export function MaterialRequestWorkspace() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: projects = [] } = trpc.erp.projects.list.useQuery();
  const { data: stages = [] } = trpc.erp.stages.list.useQuery();
  const { data: inventoryItems = [] } = trpc.erp.inventory.items.list.useQuery();
  const { data: costItems = [] } = trpc.erp.costItems.list.useQuery();
  const { data: contracts = [] } = trpc.erp.contractorContracts.list.useQuery();
  const { data: requisitions = [] } = trpc.erp.procurement.requisitions.list.useQuery();
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [materialSearch, setMaterialSearch] = useState("");
  const selectedProjectId = Number(draft.projectId || 0);
  const selectedItemId = Number(draft.inventoryItemId || 0);
  const selectedMaterial = inventoryItems.find((item) => item.id === selectedItemId);
  const projectStages = stages.filter((stage) => stage.projectId === selectedProjectId);
  const materials = inventoryItems
    .filter((item) => !item.projectId || item.projectId === selectedProjectId)
    .filter((item) => item.isActive)
    .filter((item) => `${item.code} ${item.name} ${item.category}`.toLocaleLowerCase("ar").includes(materialSearch.trim().toLocaleLowerCase("ar")));
  const availableCostItems = costItems.filter((item) => (!item.projectId || item.projectId === selectedProjectId) && item.isActive && item.category === "materials");
  const materialGroups = useMemo(() => materials.reduce<Record<string, typeof materials>>((groups, item) => {
    const category = item.category || "خامات أخرى";
    (groups[category] ||= []).push(item);
    return groups;
  }, {}), [materials]);
  const matchingContractLine = useMemo(() => contracts
    .filter((contract) => contract.projectId === selectedProjectId && contract.status === "active" && ["supply", "supply_installation"].includes(contract.contractType) && (!draft.stageId || !contract.stageId || String(contract.stageId) === draft.stageId))
    .flatMap((contract) => (contract.contractItems || []).map((line, index) => ({ contract, line, index })))
    .find(({ line }) => Number(line.inventoryItemId || 0) === selectedItemId && (!draft.costItemId || Number(line.costItemId || 0) === Number(draft.costItemId))), [contracts, selectedProjectId, draft.stageId, selectedItemId, draft.costItemId]);
  const planningInput = useMemo(() => ({ projectId: selectedProjectId, stageId: draft.stageId ? Number(draft.stageId) : undefined, inventoryItemId: selectedItemId, costItemId: draft.costItemId ? Number(draft.costItemId) : undefined, quantity: Number(draft.quantity || 0) }), [selectedProjectId, draft.stageId, selectedItemId, draft.costItemId, draft.quantity]);
  const planning = trpc.erp.procurement.requisitions.planning.useQuery(planningInput, { enabled: Boolean(selectedProjectId && selectedItemId && Number(draft.quantity) > 0) });
  const create = trpc.erp.procurement.requisitions.create.useMutation({ onSuccess: () => { void utils.erp.procurement.requisitions.list.invalidate(); void utils.erp.approvals.list.invalidate(); setDraft(emptyDraft); setMaterialSearch(""); } });
  const update = trpc.erp.procurement.requisitions.update.useMutation({ onSuccess: () => { void utils.erp.procurement.requisitions.list.invalidate(); void utils.erp.approvals.list.invalidate(); setEditingId(null); setDraft(emptyDraft); setMaterialSearch(""); } });
  const remove = trpc.erp.procurement.requisitions.delete.useMutation({ onSuccess: () => { void utils.erp.procurement.requisitions.list.invalidate(); void utils.erp.approvals.list.invalidate(); } });

  useEffect(() => {
    if (planning.data?.costItemId && !draft.costItemId) setDraft((current) => ({ ...current, costItemId: String(planning.data!.costItemId) }));
  }, [planning.data?.costItemId, draft.costItemId]);

  const chooseMaterial = (materialId: string) => {
    const material = inventoryItems.find((item) => item.id === Number(materialId));
    const linkedCost = contracts
      .filter((contract) => contract.projectId === selectedProjectId && ["supply", "supply_installation"].includes(contract.contractType))
      .flatMap((contract) => contract.contractItems || [])
      .find((line) => Number(line.inventoryItemId || 0) === material?.id)?.costItemId
      || availableCostItems.find((item) => item.code === material?.code)?.id;
    setDraft({ ...draft, inventoryItemId: materialId, costItemId: linkedCost ? String(linkedCost) : "" });
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProjectId || !draft.stageId || !selectedItemId || !draft.costItemId || Number(draft.quantity) <= 0) return;
    const payload = { projectId: selectedProjectId, stageId: Number(draft.stageId), description: draft.description || undefined, requiredBy: draft.requiredBy || undefined, items: [{ inventoryItemId: selectedItemId, costItemId: Number(draft.costItemId), description: selectedMaterial?.name || "خامة", unit: selectedMaterial?.unit, quantity: Number(draft.quantity), estimatedUnitCost: Number(draft.estimatedUnitCost || 0) }] };
    if (editingId) update.mutate({ id: editingId, ...payload }); else create.mutate(payload);
  };
  const edit = (request: typeof requisitions[number]) => {
    const line = request.items?.[0];
    if (!line) return;
    setEditingId(request.id);
    setDraft({ projectId: String(request.projectId), stageId: String(request.stageId || ""), inventoryItemId: String(line.inventoryItemId || ""), costItemId: String(line.costItemId || ""), description: request.description || "", quantity: String(line.quantity || 1), estimatedUnitCost: String(line.estimatedUnitCost || ""), requiredBy: request.requiredBy ? String(request.requiredBy).slice(0, 10) : "" });
  };

  return <div className="space-y-6" dir="rtl">
    <header className="rounded-2xl bg-[#18324b] p-6 text-white"><p className="text-sm text-[#f5d98c]">مراقبة طلبات المواد</p><h2 className="mt-1 text-2xl font-bold">طلب مادة مربوط بالخطة والمرحلة</h2><p className="mt-2 max-w-3xl text-sm text-white/75">اختر بطاقة الخامة والمرحلة وبند التكلفة. يعرض النظام الكمية المتعاقد عليها والطلبات السابقة ويظهر أي تجاوز قبل الإرسال للاعتماد.</p></header>
    <div className="grid gap-4 md:grid-cols-2">
      <QuickMovementCard title="كارت استلام خامات" description="تسجيل استلام المورد وربطه بعقد التوريد وبند العقد عند وجوده." icon={ArrowDownToLine} className="border-emerald-200 bg-emerald-50" actionClass="bg-emerald-700 hover:bg-emerald-800" onClick={() => setLocation("/inventory?mode=receipt")} />
      <QuickMovementCard title="كارت صرف خامات" description="صرف الخامة إلى موقع العمل بعد مراجعة الرصيد والمرحلة." icon={ArrowUpFromLine} className="border-orange-200 bg-orange-50" actionClass="bg-orange-700 hover:bg-orange-800" onClick={() => setLocation("/inventory?mode=issue")} />
    </div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
      <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-[#18324b]"><Plus className="h-5 w-5" /> {editingId ? "تعديل طلب مادة" : "طلب مادة جديد"}</CardTitle></CardHeader><CardContent><form className="grid gap-4 md:grid-cols-2" onSubmit={save}>
        <Field label="المشروع"><select required className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={draft.projectId} onChange={(event) => { setMaterialSearch(""); setDraft({ ...draft, projectId: event.target.value, stageId: "", inventoryItemId: "", costItemId: "" }); }}><option value="">اختر المشروع</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></Field>
        <Field label="المرحلة"><select required disabled={!selectedProjectId} className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={draft.stageId} onChange={(event) => setDraft({ ...draft, stageId: event.target.value, costItemId: "" })}><option value="">اختر المرحلة</option>{projectStages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}</select></Field>
        <div><Label>نوع الخامة / بطاقة المادة</Label><Input disabled={!selectedProjectId} className="mt-1" value={materialSearch} onChange={(event) => setMaterialSearch(event.target.value)} placeholder={selectedProjectId ? "ابحث: أسمنت، حديد، عزل، كهرباء..." : "اختر المشروع أولًا"} /><select required disabled={!selectedProjectId} className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={draft.inventoryItemId} onChange={(event) => chooseMaterial(event.target.value)}><option value="">{materials.length ? "اختر بطاقة الخامة من الدليل" : "لا توجد نتائج مطابقة للبحث"}</option>{Object.entries(materialGroups).map(([category, items]) => <optgroup key={category} label={category}>{items.map((item) => <option key={item.id} value={item.id}>{item.code} — {item.name} ({item.unit})</option>)}</optgroup>)}</select>{selectedProjectId && !materials.length && <p className="mt-1 text-xs text-amber-700">لم تظهر بطاقة مطابقة؛ امسح البحث أو أضف بطاقة خاصة من مركز الكميات.</p>}</div>
        <div><Label>بند التكلفة</Label><select required disabled={!selectedProjectId} className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm" value={draft.costItemId} onChange={(event) => setDraft({ ...draft, costItemId: event.target.value })}><option value="">اختر بند التكلفة</option>{availableCostItems.map((item) => <option key={item.id} value={item.id}>{item.code} — {item.name}</option>)}</select><p className="mt-1 text-xs text-slate-500">يُرشَّح تلقائيًا من بند العقد أو من كود الخامة، ويمكنك تعديله قبل الحفظ.</p></div>
        <Field label={`الكمية المطلوبة ${selectedMaterial ? `(${selectedMaterial.unit})` : ""}`}><Input required min="0.001" step="0.001" className="mt-1" type="number" value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: event.target.value })} /></Field>
        <Field label="التكلفة التقديرية للوحدة"><Input min="0" step="0.01" className="mt-1" type="number" value={draft.estimatedUnitCost} onChange={(event) => setDraft({ ...draft, estimatedUnitCost: event.target.value })} /></Field>
        <Field label="مطلوب بتاريخ"><Input className="mt-1" type="date" value={draft.requiredBy} onChange={(event) => setDraft({ ...draft, requiredBy: event.target.value })} /></Field>
        <Field label="ملاحظة تشغيلية"><Input className="mt-1" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="سبب الطلب أو موقع الاستخدام" /></Field>
        <div className="md:col-span-2 flex flex-wrap gap-2"><Button className="bg-[#18324b]" disabled={create.isPending || update.isPending || !selectedProjectId || !draft.stageId || !selectedItemId || !draft.costItemId}>{editingId ? "حفظ وإعادة إرسال الطلب" : "إرسال طلب المواد للاعتماد"}</Button>{editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setDraft(emptyDraft); setMaterialSearch(""); }}>إلغاء التعديل</Button>}</div>
      </form></CardContent></Card>
      <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-[#18324b]"><PackageSearch className="h-5 w-5" /> فحص التوافق مع المخطط</CardTitle></CardHeader><CardContent>{!selectedItemId || !selectedProjectId ? <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">اختر المشروع والمرحلة وبطاقة الخامة لإظهار ربط العقد والمخطط.</p> : planning.isLoading ? <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">جارٍ فحص الكميات...</p> : planning.data ? <div className="space-y-3"><Badge className={planningClass[planning.data.status]}>{planningLabel[planning.data.status]}</Badge><div className="grid grid-cols-2 gap-2 text-center text-sm"><Metric label="المخطط/المتعاقد" value={`${fmt.format(planning.data.plannedQuantity)} ${selectedMaterial?.unit || ""}`} /><Metric label="المستخدم سابقًا" value={`${fmt.format(planning.data.committedQuantity)} ${selectedMaterial?.unit || ""}`} /><Metric label="المتاح في الخطة" value={`${fmt.format(planning.data.remainingQuantity)} ${selectedMaterial?.unit || ""}`} /><Metric label="بعد هذا الطلب" value={`${fmt.format(planning.data.requestedAfterQuantity)} ${selectedMaterial?.unit || ""}`} /></div>{planning.data.contractId ? <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">مرتبط بعقد توريد رقم #{planning.data.contractId}{matchingContractLine ? ` · بند ${matchingContractLine.index + 1}` : ""}.</p> : <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">لم يجد النظام بند عقد مطابقًا لهذه الخامة والمرحلة؛ سيظهر الطلب كغير مرتبط بمخطط للمراجعة.</p>}{planning.data.status === "over_plan" && <p className="flex gap-2 rounded-lg bg-rose-50 p-3 text-xs text-rose-800"><AlertTriangle className="h-4 w-4 shrink-0" /> الطلب يزيد عن المخطط بمقدار {fmt.format(planning.data.varianceQuantity)} {selectedMaterial?.unit}. سيُحفظ ظاهرًا كمخالفة قابلة للمراجعة ولن يُخفى من الاعتمادات.</p>}</div> : null}</CardContent></Card>
    </div>
    <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-[#18324b]"><ClipboardList className="h-5 w-5" /> سجل طلبات المواد والرقابة</CardTitle></CardHeader><CardContent><div className="space-y-3">{requisitions.length === 0 ? <p className="rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">لا توجد طلبات مواد مسجلة بعد.</p> : requisitions.map((request) => { const line = request.items?.[0]; const material = inventoryItems.find((item) => item.id === line?.inventoryItemId); const cost = costItems.find((item) => item.id === line?.costItemId); const stage = stages.find((item) => item.id === request.stageId); const status = line?.planningStatus || "unplanned"; return <div key={request.id} className="rounded-xl border border-slate-100 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold text-[#18324b]">{request.requestNumber} — {material?.name || line?.description || "خامة غير محددة"}</p><p className="mt-1 text-xs text-slate-500">{projects.find((project) => project.id === request.projectId)?.name} · {stage?.name || "مرحلة غير محددة"} · {cost ? `${cost.code} — ${cost.name}` : "بند تكلفة غير محدد"}</p></div><Badge className={planningClass[status as keyof typeof planningClass]}>{planningLabel[status as keyof typeof planningLabel]}</Badge></div><div className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-4"><span>الكمية: <b>{fmt.format(Number(line?.quantity || 0))} {line?.unit || ""}</b></span><span>المخطط: <b>{fmt.format(Number(line?.plannedQuantity || 0))} {line?.unit || ""}</b></span><span>حالة الطلب: <b>{request.status}</b></span><span>موعد الحاجة: <b>{request.requiredBy ? String(request.requiredBy).slice(0, 10) : "—"}</b></span></div><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={() => edit(request)}><FilePenLine className="ml-1 h-3.5 w-3.5" /> تعديل</Button>{user?.role === "admin" && <Button size="sm" variant="outline" className="border-rose-200 text-rose-700" disabled={remove.isPending} onClick={() => { if (window.confirm("سيُلغى طلب المواد وتُغلق موافقاته المعلقة. هل تريد المتابعة؟")) remove.mutate({ id: request.id }); }}><Trash2 className="ml-1 h-3.5 w-3.5" /> حذف</Button>}</div></div>; })}</div></CardContent></Card>
  </div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><Label>{label}</Label>{children}</div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg bg-slate-50 p-3"><p className="text-[11px] text-slate-500">{label}</p><p className="mt-1 font-bold text-[#18324b]">{value}</p></div>; }
function QuickMovementCard({ title, description, icon: Icon, className, actionClass, onClick }: { title: string; description: string; icon: typeof ArrowDownToLine; className: string; actionClass: string; onClick: () => void }) { return <Card className={`border shadow-sm ${className}`}><CardContent className="flex flex-wrap items-center justify-between gap-4 p-5"><div className="flex items-start gap-3"><div className="rounded-xl bg-white/80 p-2 text-[#18324b]"><Icon className="h-5 w-5" /></div><div><p className="font-bold text-[#18324b]">{title}</p><p className="mt-1 max-w-lg text-sm text-slate-600">{description}</p></div></div><Button type="button" className={actionClass} onClick={onClick}>فتح الكارت</Button></CardContent></Card>; }
