import { ArrowRight, WalletCards } from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { EmployeeAdvanceLedger } from "@/components/EmployeeAdvanceLedger";
import { trpc } from "@/lib/trpc";

export default function EmployeeAdvances() {
  const [, setLocation] = useLocation();
  const { data: me } = trpc.auth.me.useQuery();
  const { data: employees = [] } = trpc.erp.employees.list.useQuery();
  return <DashboardLayout><main dir="rtl" className="min-h-screen bg-[#f7f8fa] px-4 py-6 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl space-y-6"><header><Button variant="ghost" className="gap-2 px-0 text-slate-500" onClick={() => setLocation("/employees")}><ArrowRight className="h-4 w-4" /> العودة إلى دليل الموظفين</Button><div className="mt-3 flex items-start gap-3"><div className="rounded-2xl bg-[#18324b] p-3 text-white"><WalletCards className="h-6 w-6" /></div><div><p className="text-sm font-semibold text-[#b28a3b]">الرواتب والسلف</p><h1 className="mt-1 text-3xl font-bold text-[#18324b]">سلف الموظفين</h1><p className="mt-2 max-w-3xl text-sm text-slate-500">مساحة موحدة لتسجيل السلفة، تحديد خصم كامل أو تقسيط، ومراجعة كشف الحساب والأقساط والرصيد المتبقي باستخدام بحث وفلاتر متقدمة.</p></div></div></header><EmployeeAdvanceLedger employees={employees} me={me} /></div></main></DashboardLayout>;
}
