# Local ERP visual verification — 2026-08-28

- Authenticated local preview session successfully reached the ERP dashboard.
- Dashboard: Arabic RTL layout rendered with sidebar separated from content; project selector showed نمار; current stage الحفر and project metrics were visible.
- Approvals: archive filters for request type, employee, search, date range, status, and entity type were visible; preview/delete actions were visible; archive cards showed requester, reviewer, sent date, decision date. No pending approvals were present in the current data.
- Projects: project creation form exposed contract value and independent estimated total project cost; stage form exposed budget basis and dates; existing نمار / الحفر data was visible; update report action was visible.
- Reports: unified reports page exposed project selector, report tabs, date filters, cash flow, financial summary, supplier statement, exports, and comparison table.
- Material requests: dedicated page exposed project/stage/material/quantity/date/note fields, material receipt and issue cards, and approval-oriented explanatory copy. Existing inventory search returned no matching material in the current data, which is a data-state result rather than a layout error.
- Screenshots showed no sidebar overlap in the reviewed authenticated pages. Final delivery remains subject to any user-reported functional issue after manual interaction with forms.
## Legacy workbook import assessment

The uploaded workbook is a substantial operational source with 35 sheets, including 14 stage sheets, the main contract, schedules, contractors, certificates, expenses, accruals, collections, cost center, income statement, cash flow, custody, payroll, and daily tasks. The workbook contains formulas and legacy presentation sheets, so no automatic import was performed. A safe import requires an explicit field-mapping and duplicate-key policy before writing any legacy transactions into the ERP database.


## Railway invitation investigation

في 2026-08-28 تم فتح مشروع Railway `valiant-bravery` وبيئة `production` وخدمة `erp-app` رقم `3912cbd5-3713-4a8a-84cd-68546cc81149` قراءةً فقط. الخدمة Online والنشر Active وناجح في منطقة EU West. تبويب Variables يعرض 7 متغيرات فقط: APP_URL وAUTH_MODE وDATABASE_URL وJWT_SECRET وNODE_ENV وSCHEDULE_SECRET وVITE_APP_TITLE. لا تظهر أي متغيرات SMTP_* ولا GMAIL_USERNAME/GMAIL_APP_PASSWORD. الكود الحالي يعتمد getSmtpConfiguration، ولذلك إرسال الدعوة يفشل عند غياب إعدادات SMTP، بينما تبقى الدعوة pending ويُفترض عرض رابطها اليدوي للمستخدم.


تبويب Logs في Railway، على مستوى مشروع valiant-bravery وبيئة production، يعرض `No logs in this time range` للفترة الأخيرة 23:29–23:44. لم تُنفذ دعوة اختبارية، لذلك لا توجد محاولة جديدة يمكن تتبعها. عدم وجود سجلات لا ينفي السبب؛ تبويب Variables أثبت أن خدمة erp-app لا تحتوي أي إعداد SMTP أو Gmail، والكود يحاول الإرسال ثم يحتفظ بالدعوة pending عند فشل النقل.


بعد إضافة متغيرات Gmail يدويًا من المستخدم، احتاجت لوحة Railway إلى إعادة تحميل الجلسة ولم أفتح أو أنسخ أي قيمة سرية. لم أرسل دعوة اختبارية بعد، ولم أغيّر أي إعداد آخر أو أبدأ Deploy. يلزم الآن التأكد من اكتمال redeploy التلقائي ثم تنفيذ اختبار دعوة واحد بموافقة المستخدم وبريد يحدده.


لقطة المستخدم بعد Deployment أظهرت أن طلب إنشاء الدعوة يبقى في حالة `جارٍ إنشاء الدعوة...` ثم تظهر الدعوة بعد refresh؛ هذا يدل على أن إدخال الدعوة يُحفظ قبل انتظار sendMail وأن اتصال SMTP لا يعيد نتيجة بسرعة. اختبار اتصال TLS عام من بيئة الفحص إلى `smtp.gmail.com` نجح على 465 و587 دون مصادقة، لذلك لا يكفي استبدال Yahoo؛ يجب فحص مصادقة حساب Gmail/كلمة مرور التطبيق في runtime وإضافة مهلات اتصال حتى لا تتجمد الواجهة.
