# مقارنة أولية للاستضافة الخارجية

تمت مراجعة وثائق المنصات الرسمية في 23 أغسطس 2026 لتقييم استضافة خادم Node.js/Express وقاعدة MySQL لهذا النظام.

| المنصة | ملاءمة الخادم | خيار قاعدة البيانات | ملاحظة تشغيلية |
|---|---|---|---|
| Render | يدعم نشر Express من مستودع Git مع أوامر بناء وتشغيل مخصصة. | يمكن تشغيل MySQL 8 كخدمة خاصة مع قرص دائم ولقطات يومية. | مناسب لبدء نقل بسيط إذا تم إعداد نسخ احتياطي منطقي مستقل باستخدام `mysqldump`. |
| Railway | يستضيف خادم Node وخدمة MySQL ضمن مشروع واحد وشبكة خاصة. | قالب MySQL رسمي يعتمد صورة MySQL وقرص `/var/lib/mysql`. | مناسب لتجربة نقل سريعة؛ يجب مراجعة سياسة النسخ الاحتياطي والحدود قبل الإنتاج. |
| DigitalOcean App Platform + Managed MySQL | منصة مُدارة للنشر من Git أو صورة حاوية. | توصي الوثائق بقاعدة Managed Database للإنتاج، مع trusted sources واتصال داخلي. | الأنسب للإنتاج ذي البيانات المحاسبية إذا كانت الأولوية لعزل قاعدة البيانات وإدارتها المستقلة. |

## النتائج العملية

1. يظل التطبيق بحاجة إلى خادم Node دائم لتشغيل Express وtRPC، وليس موقعًا ساكنًا فقط.
2. لا تعتمد على لقطة قرص قاعدة البيانات وحدها؛ استخدم نسخًا منطقية دورية بوسيلة MySQL المعتمدة واختبر الاستعادة.
3. يجب نقل تسجيل الدخول المدمج إلى مصادقة محلية أو مزود OIDC قبل الإطلاق الخارجي.

## المصادر

1. [Render: Deploy a Node Express App](https://render.com/docs/deploy-node-express-app)
2. [Render: Deploy MySQL](https://render.com/docs/deploy-mysql)
3. [Railway: Deploy MySQL](https://railway.com/deploy/mysql--mysql)
4. [DigitalOcean: Manage Databases in App Platform](https://docs.digitalocean.com/products/app-platform/how-to/manage-databases/)
