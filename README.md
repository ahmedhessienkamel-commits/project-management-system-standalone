# نظام إدارة المشاريع ERP — الحزمة المستقلة

هذه حزمة تشغيل مستقلة لنظام ERP عربي مبني بـReact وTypeScript وExpress وtRPC وDrizzle/MySQL. تعمل على VPS أو Railway أو أي خادم يدعم Node.js 22 وMySQL، ولا تحتاج إلى حساب أو OAuth أو خدمات تشغيلية من المنصة السابقة.

## بدء سريع

1. راجع `EXTERNAL_ENVIRONMENT_TEMPLATE.txt` وأنشئ ملف البيئة الخاص بك خارج Git.
2. أنشئ قاعدة MySQL فارغة واضبط `DATABASE_URL` و`JWT_SECRET` و`SCHEDULE_SECRET` و`APP_URL`.
3. ثبّت الحزم: `pnpm install --frozen-lockfile`.
4. طبّق الترحيلات: `pnpm db:migrate`.
5. أنشئ حساب المالك محليًا داخل الطرفية الخاصة بالخادم: `pnpm local:bootstrap-admin owner@example.com 'كلمة-مرور-قوية'`.
6. ابنِ وشغّل: `pnpm build && NODE_ENV=production pnpm start`.
7. افتح `https://YOUR_DOMAIN/login`، أو استخدم `/health` للتحقق من جاهزية الخادم.

## دليل الوثائق

| الملف | الغرض |
|---|---|
| `EXTERNAL_DEPLOYMENT.md` | المتطلبات والتشغيل على VPS أو خادم سحابي. |
| `RAILWAY_DEPLOYMENT.md` | إعداد التطبيق وMySQL على Railway. |
| `EXTERNAL_ENVIRONMENT_TEMPLATE.txt` | قالب آمن لمتغيرات البيئة من دون أسرار. |
| `INDEPENDENCE_AUDIT.md` | ما أزيل من الاعتمادات المدمجة والاعتمادات الخارجية المتبقية. |
| `INDEPENDENT_BACKUP_RESTORE.md` | النسخ الاحتياطي والاستعادة. |
| `deployment/README.md` | التشغيل باستخدام Docker Compose وCaddy على VPS. |
| `RAILWAY_ECONOMY_PLAN.md` | خطة تجربة Railway والحدود الاقتصادية. |

## اختبار الحزمة

تم التحقق من TypeScript ومن 25 ملف Vitest يضم 101 اختبارًا، كما بُني التطبيق وشُغّل مؤقتًا من `dist/index.js` مع إلغاء متغيرات OAuth وForge. أعادت `/health` الاستجابة المحلية، وأعادت `/login` حالة HTTP 200.

## بيانات التشغيل

لا يحتوي هذا المصدر على قاعدة بيانات إنتاج أو مستخدمين فعليين أو كلمات مرور أو ملفات أسرار. ابدأ بقاعدة فارغة وحساب مالك محلي، ولا تنقل بيانات الأعمال إلا بعد تحديد نطاق النقل وموافقة مالكها واختبار الاستعادة على قاعدة منفصلة.
