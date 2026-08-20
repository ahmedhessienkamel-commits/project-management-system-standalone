import { useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { DatabaseBackup, Download, Landmark, Save, Building2, Upload, WalletCards } from "lucide-react";

function Field({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return <div className="space-y-1.5"><Label className="text-sm text-slate-600">{label}</Label><Input type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></div>;
}

const emptyCompany = { legalName: "", tradeName: "", commercialRegistration: "", taxNumber: "", nationalAddress: "", phone: "", email: "", website: "", logoUrl: "", notes: "" };
const emptyCash = { code: "", name: "", accountType: "cash" as "bank" | "cash", bankName: "", accountNumber: "", iban: "", currency: "SAR", accountId: "", openingBalance: "0" };

export default function CompanySettings() {
  const utils = trpc.useUtils();
  const { data: company } = trpc.erp.company.get.useQuery();
  const { data: cashAccounts = [] } = trpc.erp.cashAccounts.list.useQuery();
  const { data: accounts = [] } = trpc.erp.accounting.accounts.list.useQuery();
  const [companyForm, setCompanyForm] = useState(emptyCompany);
  const [companyInitialized, setCompanyInitialized] = useState(false);
  const [cashForm, setCashForm] = useState(emptyCash);
  const saveCompany = trpc.erp.company.save.useMutation({ onSuccess: () => { utils.erp.company.get.invalidate(); } });
  const createCash = trpc.erp.cashAccounts.create.useMutation({ onSuccess: () => { utils.erp.cashAccounts.list.invalidate(); setCashForm(emptyCash); } });
  const deactivateCash = trpc.erp.cashAccounts.deactivate.useMutation({ onSuccess: () => utils.erp.cashAccounts.list.invalidate() });
  const backupQuery = trpc.backup.export.useQuery(undefined, { enabled: false });
  const restoreBackup = trpc.backup.restore.useMutation();
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const downloadBackup = async () => {
    const result = await backupQuery.refetch();
    if (!result.data) return;
    const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `erp-backup-${result.data.generatedAt.replace(/[:.]/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const handleRestoreFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed?.format !== "meta-ads-erp-backup" || !parsed?.version || !parsed?.tables) throw new Error("invalid");
        if (!window.confirm("سيتم استبدال بيانات النظام الحالية ببيانات النسخة المختارة. تأكد من وجود نسخة حديثة قبل المتابعة. هل تريد الاستمرار؟")) return;
        restoreBackup.mutate(parsed);
      } catch {
        window.alert("ملف النسخة الاحتياطية غير صالح أو تالف.");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => { if (company && !companyInitialized) { setCompanyForm({ legalName: company.legalName || "", tradeName: company.tradeName || "", commercialRegistration: company.commercialRegistration || "", taxNumber: company.taxNumber || "", nationalAddress: company.nationalAddress || "", phone: company.phone || "", email: company.email || "", website: company.website || "", logoUrl: company.logoUrl || "", notes: company.notes || "" }); setCompanyInitialized(true); } }, [company, companyInitialized]);

  const updateCompany = (key: keyof typeof emptyCompany, value: string) => setCompanyForm((current) => ({ ...current, [key]: value }));
  const updateCash = (key: keyof typeof emptyCash, value: string) => setCashForm((current) => ({ ...current, [key]: value }));

  return <DashboardLayout><div dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl space-y-6">
    <header><p className="text-sm font-semibold text-[#b28a3b]">الإعدادات الرئيسية</p><h1 className="mt-1 text-3xl font-bold text-[#18324b]">معلومات الشركة والبنوك والنقدية</h1><p className="mt-2 text-sm text-slate-500">بيانات الشركة تظهر في المستندات، والحسابات البنكية والخزائن تستخدم في سندات القبض والصرف.</p></header>
    <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><Building2 className="h-5 w-5 text-[#b28a3b]" /> معلومات الشركة</CardTitle></CardHeader><CardContent><form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); if (!companyForm.legalName.trim()) return; saveCompany.mutate(companyForm); }}><Field label="الاسم القانوني للشركة *" value={companyForm.legalName} onChange={(value) => updateCompany("legalName", value)} /><Field label="الاسم التجاري" value={companyForm.tradeName} onChange={(value) => updateCompany("tradeName", value)} /><Field label="السجل التجاري" value={companyForm.commercialRegistration} onChange={(value) => updateCompany("commercialRegistration", value)} /><Field label="الرقم الضريبي" value={companyForm.taxNumber} onChange={(value) => updateCompany("taxNumber", value)} /><Field label="رقم الهاتف" value={companyForm.phone} onChange={(value) => updateCompany("phone", value)} /><Field label="البريد الإلكتروني" type="email" value={companyForm.email} onChange={(value) => updateCompany("email", value)} /><Field label="الموقع الإلكتروني" value={companyForm.website} onChange={(value) => updateCompany("website", value)} /><Field label="رابط شعار الشركة" value={companyForm.logoUrl} onChange={(value) => updateCompany("logoUrl", value)} placeholder="رابط صورة الشعار" /><div className="md:col-span-2"><Field label="العنوان الوطني" value={companyForm.nationalAddress} onChange={(value) => updateCompany("nationalAddress", value)} /></div><div className="md:col-span-2"><Field label="ملاحظات تظهر في المستندات" value={companyForm.notes} onChange={(value) => updateCompany("notes", value)} /></div><div className="md:col-span-2 flex justify-end"><Button className="gap-2 bg-[#18324b]" disabled={saveCompany.isPending}><Save className="h-4 w-4" /> حفظ معلومات الشركة</Button></div></form></CardContent></Card>
    <Card className="border-0 shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2 text-lg text-[#18324b]"><DatabaseBackup className="h-5 w-5 text-[#b28a3b]" /> النسخة الاحتياطية</CardTitle></CardHeader><CardContent className="flex flex-wrap items-center justify-between gap-4"><div><p className="font-semibold text-[#18324b]">احفظ بيانات النظام في ملف واحد</p><p className="mt-1 max-w-2xl text-xs leading-6 text-slate-500">الملف يتضمن بيانات التشغيل والعلاقات بين السجلات، ولا يتضمن كلمات المرور أو الجلسات أو مفاتيح الأسرار. احتفظ به في مكان آمن، ويمكن استخدامه لاحقًا للاستعادة.</p></div><div className="flex flex-wrap gap-2"><Button type="button" className="gap-2 bg-[#18324b]" onClick={downloadBackup} disabled={backupQuery.isFetching}><Download className="h-4 w-4" /> {backupQuery.isFetching ? "جارٍ تجهيز النسخة..." : "نسخة احتياطية"}</Button><input ref={restoreInputRef} type="file" accept="application/json,.json" className="hidden" onChange={handleRestoreFile} /><Button type="button" variant="outline" className="gap-2" onClick={() => restoreInputRef.current?.click()} disabled={restoreBackup.isPending}><Upload className="h-4 w-4" /> {restoreBackup.isPending ? "جارٍ الاستعادة..." : "استعادة نسخة"}</Button></div>{restoreBackup.isSuccess && <p className="basis-full text-sm text-emerald-700">تمت استعادة النسخة بنجاح. أعد تحميل الصفحة لمراجعة البيانات.</p>}{restoreBackup.isError && <p className="basis-full text-sm text-rose-700">تعذر استعادة الملف: {restoreBackup.error.message}</p>}</CardContent></Card>
  </div></div></DashboardLayout>;
}
