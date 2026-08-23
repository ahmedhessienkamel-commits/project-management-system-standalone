# تشغيل مستقل عبر Docker Compose

انسخ `EXTERNAL_ENVIRONMENT_TEMPLATE.txt` إلى `.env` في جذر المشروع، ثم أضف قيمًا قوية لـ `JWT_SECRET` و`SCHEDULE_SECRET` وكلمات مرور MySQL. لا ترفع `.env` إلى Git.

```bash
docker compose -f deployment/docker-compose.yml up -d --build
docker compose -f deployment/docker-compose.yml exec app pnpm db:migrate
docker compose -f deployment/docker-compose.yml exec app pnpm local:bootstrap-admin owner@example.com 'password-at-least-12-characters' 'اسم المالك'
```

بعد ذلك افتح `http://SERVER_IP:3000/login`. في الإنتاج ضع Nginx أو Caddy أمام المنفذ 3000 لتوفير HTTPS، واضبط `APP_URL` على رابط HTTPS النهائي قبل إنشاء الدعوات أو إرسال رسائل الاستعادة.

لإرسال الدعوات ورسائل استعادة كلمة المرور والتنبيهات، اضبط متغيرات `SMTP_HOST` و`SMTP_PORT` و`SMTP_SECURE` و`SMTP_USER` و`SMTP_PASSWORD` و`SMTP_FROM` في `.env`. هذه الإعدادات اختيارية حتى تحتاج البريد، ولا ترتبط بمزود محدد. ولإرسال نسخة احتياطية بالبريد عبر المهمة المجدولة أضف كذلك `BACKUP_EMAIL_RECIPIENT`.

لإضافة HTTPS تلقائيًا مع Caddy، اجعل سجل DNS من نوع `A` للنطاق يشير إلى عنوان الـVPS، ثم شغّل طبقة الإنتاج فوق Compose الأساسي:

```bash
docker compose -f deployment/docker-compose.yml -f deployment/docker-compose.production.yml up -d --build
```

يجب أن تتضمن `.env` القيمة نفسها في `DOMAIN` و`APP_URL` (مثال: `erp.example.com` و`https://erp.example.com`). بعد نجاح HTTPS، اقفل المنفذ 3000 من الجدار الناري واترك 80 و443 فقط متاحين.

لإنشاء نسخة احتياطية:

```bash
chmod +x deployment/backup-mysql.sh deployment/restore-mysql.sh
./deployment/backup-mysql.sh
```

وللاستعادة على قاعدة فارغة أو مخصصة للاختبار:

```bash
./deployment/restore-mysql.sh backups/erp-YYYYMMDD-HHMMSS.sql.gz
```

لتصدير نسخة بيانات محمولة تستبعد كلمات المرور والرموز الحساسة، استخدم:

```bash
pnpm export:data exports/erp-portable-data.json.gz
```

لا تضع الملف الناتج في Git أو داخل مجلد الويب المنشور. لنقل بيانات الأعمال إلى قاعدة مهيأة بالترحيلات، أنشئ حساب المالك المحلي أولًا، وخذ نسخة رجوع خاصة من القاعدة المستهدفة، ثم نفّذ من جهاز إداري موثوق:

```bash
pnpm import:data /مسار_خاص/erp-portable-data.json.gz
```

يستبعد هذا المسار كلمات المرور والرموز وجداول الدعوات والاستعادة. وإذا كان بريد المالك المحلي موجودًا سلفًا في القاعدة المستهدفة، يحتفظ المستورد بكلمة مرور ذلك الحساب. بعد الاستيراد، راجع أعداد المشاريع والحسابات والمستندات وسجّل الدخول قبل تحويل المستخدمين إلى البيئة الجديدة.

راجع `INDEPENDENT_BACKUP_RESTORE.md` قبل الاستعادة أو تحويل DNS.

نفّذ المهام الدورية من cron خارجي أو منصة جدولة باستدعاء مسارات `/api/scheduled/*` مع ترويسة `x-schedule-secret` المطابقة لـ `SCHEDULE_SECRET`.
