import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

export default function PasswordAuth({ invitation = false }: { invitation?: boolean }) {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || params.get("invite") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const login = trpc.auth.passwordLogin.useMutation({ onSuccess: () => setLocation("/") });
  const accept = trpc.auth.acceptInvitation.useMutation({ onSuccess: () => setLocation("/") });
  const pending = login.isPending || accept.isPending;
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password.length < 8) return setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
    if (invitation && password !== confirmPassword) return setError("تأكيد كلمة المرور غير مطابق.");
    if (invitation) {
      if (!token) return setError("رابط الدعوة غير موجود أو غير صحيح.");
      accept.mutate({ token, password });
    } else {
      if (!email.trim()) return setError("أدخل البريد الإلكتروني.");
      login.mutate({ email: email.trim().toLowerCase(), password });
    }
  };
  const mutationError = login.error?.message || accept.error?.message;
  return <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[#f7f8fa] p-4"><Card className="w-full max-w-md border-0 shadow-xl"><CardHeader className="space-y-3 text-center"><div className="mx-auto rounded-2xl bg-[#18324b] px-5 py-3 text-lg font-bold text-white">نظام إدارة المشاريع</div><CardTitle className="text-2xl text-[#18324b]">{invitation ? "تفعيل حساب الدعوة" : "تسجيل الدخول"}</CardTitle><p className="text-sm leading-6 text-slate-500">{invitation ? "أنشئ كلمة المرور الخاصة بك لتفعيل الحساب ثم الدخول إلى النظام." : "أدخل بريدك الإلكتروني وكلمة المرور للدخول بحسابك المستقل."}</p></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}>{!invitation && <div><Label>البريد الإلكتروني</Label><Input className="mt-1" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div>}<div><Label>{invitation ? "كلمة المرور الجديدة" : "كلمة المرور"}</Label><Input className="mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={invitation ? "new-password" : "current-password"} /></div>{invitation && <div><Label>تأكيد كلمة المرور</Label><Input className="mt-1" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></div>}{(error || mutationError) && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error || mutationError}</p>}<Button disabled={pending} className="w-full bg-[#18324b]">{pending ? "جارٍ التحقق..." : invitation ? "تفعيل الحساب والدخول" : "دخول"}</Button>{!invitation && <Button type="button" variant="ghost" className="w-full text-slate-500" onClick={() => setLocation("/accept-invitation")}>لديك دعوة؟ فعّل الحساب من رابط الدعوة</Button>}</form></CardContent></Card></main>;
}
