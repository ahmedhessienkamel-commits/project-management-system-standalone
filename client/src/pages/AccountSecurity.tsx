import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

export default function AccountSecurity() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const mutation = trpc.auth.setPassword.useMutation({ onSuccess: () => { setPassword(""); setConfirm(""); setMessage("تم إنشاء كلمة المرور بنجاح. يمكنك الآن الدخول بالبريد وكلمة المرور."); } });
  const submit = (event: React.FormEvent) => { event.preventDefault(); setMessage(""); if (password.length < 8) return setMessage("كلمة المرور يجب ألا تقل عن 8 أحرف."); if (password !== confirm) return setMessage("تأكيد كلمة المرور غير مطابق."); mutation.mutate({ password }); };
  return <main dir="rtl" className="min-h-screen bg-slate-50 p-6"><div className="mx-auto max-w-2xl"><Button variant="ghost" onClick={() => setLocation("/")} className="mb-4">العودة للوحة التنفيذ</Button><Card className="border-0 shadow-lg"><CardHeader><CardTitle className="text-2xl text-[#18324b]">أمان الحساب</CardTitle><p className="text-sm text-slate-500">أنشئ كلمة مرور للدخول إلى حسابك بجانب تسجيل الدخول عبر Google. لن يتغير دورك أو صلاحياتك الحالية.</p></CardHeader><CardContent><form onSubmit={submit} className="max-w-md space-y-4"><div><Label>كلمة المرور الجديدة</Label><Input className="mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></div><div><Label>تأكيد كلمة المرور</Label><Input className="mt-1" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" /></div>{(message || mutation.error) && <p className={`rounded-lg p-3 text-sm ${mutation.error ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{message || mutation.error?.message}</p>}<Button disabled={mutation.isPending} className="bg-[#18324b]">{mutation.isPending ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}</Button></form></CardContent></Card></div></main>;
}
