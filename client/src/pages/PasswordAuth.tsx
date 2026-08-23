import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { PASSWORD_SESSION_STORAGE_KEY } from "@shared/const";
import { CheckCircle2, Copy, Eye, EyeOff } from "lucide-react";

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <main dir="rtl" className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e8eef4,#f7f8fa_45%)] p-4"><Card className="w-full max-w-md border-0 shadow-2xl"><CardHeader className="space-y-4 text-center"><div className="mx-auto rounded-2xl bg-[#18324b] px-6 py-3 text-lg font-bold tracking-wide text-white shadow-lg">نظام إدارة المشاريع</div><div><CardTitle className="text-2xl text-[#18324b]">{title}</CardTitle><p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p></div></CardHeader><CardContent>{children}</CardContent></Card></main>;
}

export default function PasswordAuth({ invitation = false }: { invitation?: boolean }) {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || params.get("invite") || "";
  const invitationDetails = trpc.auth.invitationDetails.useQuery({ token }, { enabled: invitation && token.length >= 20, retry: false });
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activationComplete, setActivationComplete] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const rememberSession = (sessionToken?: string) => { if (!sessionToken) return; try { sessionStorage.setItem(PASSWORD_SESSION_STORAGE_KEY, sessionToken); } catch {} };
  const login = trpc.auth.passwordLogin.useMutation({ onSuccess: (result) => { rememberSession(result.sessionToken); setLocation(result.mustChangePassword ? "/change-password" : "/"); } });
  const accept = trpc.auth.acceptInvitation.useMutation({ onSuccess: (result) => { rememberSession(result.sessionToken); setActivationComplete(true); } });
  const requestReset = trpc.auth.requestPasswordReset.useMutation({ onSuccess: () => setNotice("إذا كان البريد مسجلًا وله كلمة مرور، فستصل رسالة الاستعادة خلال دقائق. راجع البريد الوارد والرسائل غير المرغوب فيها.") });
  useEffect(() => { if (invitationDetails.data?.email) setEmail(invitationDetails.data.email); }, [invitationDetails.data?.email]);
  const pending = login.isPending || accept.isPending || requestReset.isPending;
  const submit = (event: React.FormEvent) => { event.preventDefault(); setError(""); setNotice(""); if (mode === "forgot") { if (!email.trim()) return setError("أدخل بريدك الإلكتروني أولًا."); requestReset.mutate({ email: email.trim().toLowerCase() }); return; } if (password.length < 8) return setError("كلمة المرور يجب ألا تقل عن 8 أحرف."); if (invitation && password !== confirmPassword) return setError("تأكيد كلمة المرور غير مطابق."); if (invitation) { if (!token) return setError("رابط الدعوة غير موجود أو غير صحيح."); accept.mutate({ token, password }); } else { if (!email.trim()) return setError("أدخل البريد الإلكتروني."); login.mutate({ email: email.trim().toLowerCase(), password }); } };
  const mutationError = login.error?.message || accept.error?.message || requestReset.error?.message;
  if (invitation && activationComplete) { const loginUrl = `${window.location.origin}/login`; return <Shell title="تم تفعيل الحساب بنجاح" subtitle="احتفظ برابط الدخول لاستخدامه لاحقًا. لن يتم عرض كلمة المرور على الشاشة حفاظًا على أمان حسابك."><div className="space-y-5"><div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"><CheckCircle2 className="h-6 w-6 shrink-0" /><p className="text-sm font-semibold">تم إنشاء الحساب وتسجيل الدخول بنجاح.</p></div><div><Label>رابط الدخول المباشر</Label><div className="mt-1 flex gap-2"><Input className="h-11 bg-slate-50 text-left text-sm" dir="ltr" value={loginUrl} readOnly /><Button type="button" variant="outline" className="h-11 shrink-0 gap-2" onClick={async () => { await navigator.clipboard.writeText(loginUrl); setLinkCopied(true); }}><Copy className="h-4 w-4" />{linkCopied ? "تم النسخ" : "نسخ"}</Button></div></div><Button type="button" className="h-11 w-full bg-[#18324b]" onClick={() => setLocation("/login")}>الانتقال إلى تسجيل الدخول</Button></div></Shell>; }
  if (invitation) return <Shell title="تفعيل حساب الدعوة" subtitle="أنشئ كلمة المرور الخاصة بك لتفعيل الحساب ثم الدخول إلى النظام."><form className="space-y-4" onSubmit={submit}><div><Label>البريد الإلكتروني</Label><Input className="mt-1 h-11 bg-slate-50 text-left" dir="ltr" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={invitationDetails.isLoading ? "جارٍ تحميل البريد..." : "اكتب البريد المرتبط بالدعوة إذا لم يظهر تلقائيًا"} autoComplete="email" /></div>{invitationDetails.error && <p className="text-xs text-amber-700">تعذر تحميل البريد تلقائيًا؛ يمكنك كتابته يدويًا، وسيظل رمز الدعوة هو وسيلة التحقق الأساسية.</p>}<div><Label>كلمة المرور الجديدة</Label><div className="relative"><Input className="mt-1 h-11 pl-11" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /><button type="button" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#18324b]" onClick={() => setShowPassword((current) => !current)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div><div><Label>تأكيد كلمة المرور</Label><Input className="mt-1 h-11" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" /></div>{(error || mutationError) && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error || mutationError}</p>}<Button disabled={pending} className="h-11 w-full bg-[#18324b]">{pending ? "جارٍ التحقق..." : "تفعيل الحساب والدخول"}</Button></form></Shell>;
  if (mode === "forgot") return <Shell title="استعادة كلمة المرور" subtitle="أدخل بريدك وسنرسل لك رابطًا آمنًا لإنشاء كلمة مرور جديدة."><form className="space-y-4" onSubmit={submit}><div><Label>البريد الإلكتروني</Label><Input className="mt-1 h-11" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div>{(error || notice || mutationError) && <p className={`rounded-lg p-3 text-sm ${error || mutationError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{error || mutationError || notice}</p>}<Button disabled={pending} className="h-11 w-full bg-[#18324b]">{pending ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}</Button><Button type="button" variant="ghost" className="w-full text-slate-500" onClick={() => { setMode("login"); setError(""); setNotice(""); }}>العودة إلى تسجيل الدخول</Button></form></Shell>;
  return <Shell title="تسجيل الدخول" subtitle="أدخل بريدك الإلكتروني وكلمة المرور للدخول بحسابك المستقل."><form className="space-y-4" onSubmit={submit}><div><Label>البريد الإلكتروني</Label><Input className="mt-1 h-11" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div><div><div className="flex items-center justify-between"><Label>كلمة المرور</Label><button type="button" className="text-xs font-semibold text-[#9b742b] hover:underline" onClick={() => { setMode("forgot"); setError(""); }}>نسيت كلمة المرور؟</button></div><Input className="mt-1 h-11" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></div>{(error || mutationError) && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error || mutationError}</p>}<Button disabled={pending} className="h-11 w-full bg-[#18324b]">{pending ? "جارٍ التحقق..." : "دخول آمن"}</Button><Button type="button" variant="ghost" className="w-full text-slate-500" onClick={() => setLocation("/accept-invitation")}>لديك دعوة؟ فعّل الحساب من رابط الدعوة</Button></form></Shell>;
}

export function ResetPassword() {
  const [, setLocation] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const reset = trpc.auth.resetPassword.useMutation({ onSuccess: () => setLocation("/login") });
  const submit = (event: React.FormEvent) => { event.preventDefault(); setError(""); if (!token) return setError("رابط الاستعادة غير موجود."); if (password.length < 8) return setError("كلمة المرور يجب ألا تقل عن 8 أحرف."); if (password !== confirm) return setError("تأكيد كلمة المرور غير مطابق."); reset.mutate({ token, password }); };
  return <Shell title="إنشاء كلمة مرور جديدة" subtitle="اكتب كلمة مرور جديدة لحسابك. رابط الاستعادة صالح لمرة واحدة ولمدة محدودة."><form className="space-y-4" onSubmit={submit}><div><Label>كلمة المرور الجديدة</Label><Input className="mt-1 h-11" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" /></div><div><Label>تأكيد كلمة المرور</Label><Input className="mt-1 h-11" type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} autoComplete="new-password" /></div>{(error || reset.error) && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error || reset.error?.message}</p>}<Button disabled={reset.isPending} className="h-11 w-full bg-[#18324b]">{reset.isPending ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}</Button></form></Shell>;
}
