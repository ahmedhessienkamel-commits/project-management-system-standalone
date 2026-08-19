# Project TODO

## ERP web application migration

- [x] Define the web ERP scope for up to 10 initial users, role-based permissions, approval workflows, unlimited projects, and Excel logic migration
- [x] Start the ERP MVP in a separate product scope without overwriting the existing Excel workbook
- [x] Build and validate the first online-capable ERP MVP before selecting final hosting
- [x] Build the ERP as a complete project-management operating system, not a spreadsheet viewer
- [x] Create an Excel-to-ERP traceability matrix covering every agreed workbook requirement
- [x] Preserve payroll tax exemption and pre-tax/tax/post-tax logic for non-payroll transactions
- [x] Preserve Wadi Namar versus Qiddiya project separation and administrative-only reporting for Qiddiya
- [x] Preserve unit sales, collections, recognized revenue, expenses, payments, due amounts, and supplier statements as linked workflows
- [x] Preserve stage budgets, actuals, schedule dates, progress, variance alerts, cash gaps, custody, attendance, certificates, attachments, and contractor master data
- [x] Design database entities for projects, stages, units, sales, collections, expenses, payroll, contractors, certificates, custody, attachments, approvals, notifications, audit logs, and period locks
- [x] Build Arabic RTL dashboard and navigation for the ERP
- [x] Build an executive project-health dashboard showing plan versus actual at a glance
- [x] Add project status rules for budget, schedule, progress, cash flow, and approvals
- [x] Add drill-down explanations for every red or yellow project indicator
- [x] Integrate cash-flow health rules using collections, expenses, paid amounts, outstanding balances, and funding gaps
- [x] Integrate approval health rules using pending and overdue approval counts and thresholds
- [x] Expand schedule health rules using planned dates versus actual progress
- [x] Surface all project health drivers in the dashboard summary
- [x] Automatically create approval requests when expenses, payroll, certificates, and collections are submitted
- [x] Calculate approval age and overdue SLA by project
- [x] Include outstanding balances and explicit funding-gap thresholds in project health
- [x] Add collection entry and cash-flow reporting so liquidity indicators are end-to-end
- [x] Compare planned schedule progress with actual completion progress
- [x] Add clickable project health details for budget, cash, approvals, and schedule
- [x] Build centralized data-entry modules with validations and audit-friendly links
- [x] Build revenue, expense, payroll, tax, supplier statement, cash-flow, and project-performance reports
- [ ] Import and reconcile legacy Excel data without duplicating transactions
- [ ] Add collaborative access for administration, project managers, employees, approvers, and future users with role-specific permissions
- [ ] Write backend and frontend tests for financial calculations and permissions
- [ ] Verify responsive UI and end-to-end workflows before delivery
- [x] Add approval workflows for expenses, payroll, certificates, and collections
- [ ] Add audit trail for edits, approvals, reversals, and deletions
- [x] Add project health alerts for budget usage, schedule delay, cash gap, and overdue approvals
- [x] Add project-level access boundaries for all reads/writes and cross-project comparison dashboards
- [x] Add configurable approval thresholds by project, transaction type, and amount
- [x] Add notification center for pending approvals, budget breaches, and missing documents with generation rules and tests
- [ ] Add smart recurring transaction templates and duplicate-transaction warnings
- [x] Add document completeness checks for contractors, certificates, and payment requests
- [x] Add management comparison reports and project-detail reporting, export controls, and period-lock controls
- [ ] Research and compare the lowest-cost hosting options with database persistence, backups, and multi-user access


- [ ] Secure multi-account Meta Ads connection model with encrypted server-side access-token handling
- [ ] Dashboard shell with responsive PWA-ready layout and Arabic/English terminology
- [ ] Per-account KPI cards: impressions, clicks, purchases, spend, cost per purchase, CTR
- [ ] Global date filters: last 7 days, last 30 days, and custom range
- [ ] Age performance breakdown chart
- [ ] Geographic performance table with country/region metrics
- [ ] Campaign > Ad Set > Ad hierarchical drill-down view
- [ ] Meta Insights API adapter for account and breakdown reports
- [ ] Scheduled/background sync into database for cached offline reads
- [ ] Settings page to add, remove, switch, and refresh ad accounts
- [ ] Side-by-side comparison for two accounts or two campaigns with top-performer highlighting
- [ ] PWA manifest/install affordance and mobile-responsive behavior
- [ ] Unit tests for metric calculations, account isolation, sync normalization, and comparisons
- [ ] Visual verification of desktop and mobile dashboard states
- [ ] Final build/typecheck/test verification and checkpoint
- [ ] Reuse the existing Meta app (App ID 223998126017300) after verifying App Secret, Marketing API product, OAuth redirect URI, and required permissions
- [ ] Add secure Meta app credentials and token encryption key to the project environment

## Spreadsheet enhancement history

- [x] Verify whether stage sheets such as excavation are operationally linked to expense entries or only reference/data sheets
- [x] Assess whether stage sheets can be consolidated into one central stages-and-budgets page without breaking expense/report links
- [x] Create one central stages report sourced from the main contract and linked expense, payroll, custody, certificate, and collection data
- [x] Keep legacy stage sheets hidden or preserved until the central report passes reconciliation
- [x] Test that stage totals update from transaction entries without duplicate counting
- [x] Add explicit certificate and collection metrics to the central stages report or document their scope clearly
- [x] Run an end-to-end transaction test for expense, payroll, custody, certificate, and collection updates
- [x] Verify all legacy stage sheets still exist or are intentionally hidden after reconciliation


- [x] Fix tax-rate and tax-amount cells that are displayed as dates; preserve numeric values and formulas


- [x] Verify whether approved budget input is pre-tax or tax-inclusive and document the linked calculation rule


- [x] Add monthly attendance and departure register with employee, stage, date, check-in, check-out, hours, status, and notes
- [x] Add stage-level cash flow page with cash in, cash out, net gap, cumulative gap, and funding required
- [x] Link stage cash out to expenses, entitlements, payroll, and collected payments where stage identifiers exist
- [x] Add management summary, filters, conditional alerts, and professional formatting for attendance and cash-flow pages
- [ ] Validate formulas, empty-input behavior, and dashboard links in the enhanced workbook

## Full project-control workbook rebuild

- [x] Rebuild expense classification as project versus administrative/company expense
- [x] Add payroll classification option for administrative salary versus project salary
- [x] Link project payroll automatically into project expenses and project totals
- [x] Split the main dashboard into project expenses and administrative expenses
- [x] Add planned budget per contract line item in the main contract sheet
- [x] Add actual cost per contract line item linked from expense entries by cost center and line item
- [x] Add variance amount and variance percentage with red alert when actual exceeds planned
- [x] Add professional stage performance monitoring sheet for planned, actual, variance, completion, and status
- [x] Rebuild project-level and stage-level summaries without hardcoded budget values
- [x] Validate end-to-end formulas with project/admin payroll and expense scenarios
- [x] Add executive project-health indicator with clear green/yellow/red status
- [x] Add dashboard risk matrix showing budget, schedule, cash-flow, and funding alerts
- [x] Add stage ranking and worst-variance spotlight for management review
- [x] Add concise executive summary cards so project performance is understandable at a glance
- [x] Add a linked project-payroll ledger view inside المصروفات so project payroll is visible without double-counting
- [x] Add explicit completion percentage metric to أداء المراحل and dashboard
- [x] Add dashboard risk matrix for budget, schedule, cash-flow, and funding
- [x] Add worst-variance stage spotlight and ranking for management review
- [x] Link advances/employee custody settlements to project or administrative expense classification
- [x] Add custody cost-center and contract-line fields with automatic reporting view and no double counting
- [x] Add dropdown lists for cost-center codes, contract-line codes, expense classifications, payroll classifications, and custody classifications
- [x] Validate dropdown sources and ensure linked formulas use selected codes consistently
- [x] Define a single-source transaction map across expenses, payroll, custody, receipts, contract lines, cost centers, budgets, cash flow, and dashboard
- [x] Add traceable linked reporting views so one source transaction appears in related reports without duplicate counting
- [x] Add dropdown-driven keys and validation for all cross-sheet relationships
- [x] Add reconciliation checks for unclassified, unmapped, and duplicated transactions
- [x] Add a unified project employee master page with employee code, name, role, status, and cost center
- [x] Add employee dropdowns to attendance and custody records
- [x] Auto-populate employee name from selected employee code and validate custody ownership
- [x] Link employee master records to payroll and project/admin classification
- [x] Add planned start date, planned end date, duration, schedule progress, and schedule status per contract line
- [x] Link contract-line schedule status to the weekly program and stage progress
- [x] Add a home-page summary showing on-track, warning, delayed, and overdue contract lines
- [x] Add clear contract input area for pre-tax value, VAT amount/rate, and post-tax contract value
- [x] Add clear planned budget input per contract line and distinguish user inputs from calculated fields
- [x] Verify all dashboard and variance formulas respond to contract and line-item inputs
- [x] Add project profile fields for project name, owner, responsible engineer, consultant, main contractor, location, contract number, and project status
- [x] Surface project profile fields on the home page and relevant reports
- [x] Add contractor master fields: tax number, commercial registration, IBAN, bank, contact, contract type, and status
- [x] Add contractor selection per contract line and stage with automatic contractor-detail lookup
- [x] Surface contractor compliance details in contractor, contract, and payment-related views
- [x] Add attachment register for contractor documents and financial-claim/supporting documents
- [x] Link attachment records to contractor code, subcontract/contract line, certificate number, document type, date, and file path/link
- [x] Add guidance that files are stored outside workbook and linked, keeping the workbook lightweight
- [x] Add expense-classification and payroll-classification dropdown validations
- [x] Add workbook reconciliation controls for unclassified rows, missing mappings, and duplicate transaction references
- [x] Add distinct overdue schedule state and summary count
- [x] Add contractor lookup and selection to payment certificates and stage-level views
- [x] Add comprehensive end-to-end validation for all dropdown-driven links
- [x] Run an end-to-end dropdown scenario covering expense, payroll, custody, receipt, certificate, contractor, employee, cost-center, contract-line, and schedule selections with downstream assertions
- [x] Replace contractor XLOOKUP formulas with cross-engine-compatible lookup formulas and re-run end-to-end dropdown tests
- [x] Assert receipt-driven cash-flow or dashboard totals in the end-to-end scenario
- [x] Assert employee-code propagation and payroll classification outcomes
- [x] Assert project versus administrative expense classification outcomes
- [x] Assert executive dashboard/report values update from the scenario
- [x] Auto-populate payroll employee name from selected employee code with a cross-engine-compatible lookup formula
- [x] تعديل إجمالي الإيراد ليعتمد على الإيراد المعترف به من مبيعات الوحدات
- [x] حصر صفحة المستخلصات في مستخلصات المقاولين
- [x] دمج المستحقات داخل صفحة المصروفات عبر أعمدة المصروف والمدفوع فعليًا والمستحق
- [x] إعادة توجيه التقارير والداشبورد واختبار الربط بعد تعديل الإيراد والمصروفات
- [x] توحيد اتجاه جميع أوراق المصنف إلى اليمين لليسار
- [x] إضافة حدود وتسطير واضح لجداول الإدخال والتقارير مع الحفاظ على التنسيق
- [x] إزالة أو إخفاء أقسام العرض التلقائي غير المخصصة للإدخال من صفحات الموظف
- [x] التحقق من بقاء الصيغ والروابط والتقارير سليمة بعد تبسيط الواجهة
- [ ] عرض أسماء مراحل مركز التكلفة في القوائم المنسدلة بدل الأكواد مع الحفاظ على الأكواد الداخلية
- [ ] اختبار القوائم المنسدلة والربط بالتقارير بعد تغيير قيم العرض
- [ ] إظهار المورد أو المستفيد تلقائيًا من بيانات البند والمقاول المرتبط
- [ ] دعم قائمة الموردين عند تعدد الموردين للبند والتحقق من الربط
- [ ] إضافة مورد أساسي ومورد فرعي لكل بند أو مرحلة
- [ ] إظهار المورد الأساسي تلقائيًا وإتاحة اختيار المورد الفرعي في الحركات
- [x] إنشاء صفحة موحدة تربط مبيعات الوحدات بالدفعات المحصلة والإيراد المعترف به
- [x] ربط الصفحة الموحدة بالداشبورد وقائمة الدخل واختبار التحصيل والمتبقي
- [x] ربط مؤشرات الإيراد والتحصيل في لوحة المؤشرات مباشرة بصفحة مبيعات وتحصيلات
- [ ] اختبار لوحة المؤشرات بعد إدخال بيع ودفعة محصلة في الصفحة الموحدة
- [x] تقليل ارتفاعات الصفوف والمساحات الفارغة في الصفحة الرئيسية
- [x] تظليل عناوين الأقسام وروابط فتح الصفحات بألوان واضحة
- [x] إضافة عداد الأيام المتبقية للمشروع في الصفحة الرئيسية اعتمادًا على تاريخ البدء والنهاية
- [x] اختبار حالات العداد: متبقي، منتهٍ، وتواريخ ناقصة
- [x] إضافة عداد الأيام المتبقية للمرحلة الحالية مع اسم المرحلة وحالتها
- [x] إضافة شريط علوي واضح لاختيار حالة المرحلة والمرحلة النشطة
- [x] ربط العداد بالمرحلة المختارة في الشريط العلوي
- [x] إصلاح قائمة المرحلة النشطة بحيث تعرض أسماء المراحل فعليًا
- [x] اختبار ظهور أسماء المراحل في القائمة وربطها بالعداد
- [x] حصر قائمة المرحلة النشطة في أسماء المراحل الفعلية واستبعاد إدارة ومصاريف عامة
- [x] توحيد تصنيف المشروع مع نوع المصروف ومنع التعارض والتكرار في التقارير
- [x] جعل المرحلة/البند في المصروفات قائمة أسماء مراحل بدل كتابة الكود
- [x] إظهار كود مركز التكلفة تلقائيًا من اسم المرحلة المختار
- [x] تثبيت قائمة نوع المصروف كمشروع/تشغيلي أو إداري للشركة واختبار الربط
- [x] اختبار تكاملي يثبت عدم ازدواج المصروف في التقارير بعد مسار الإدخال الجديد
- [x] مراجعة الصيغ والاختبارات القديمة التي تعتمد على Q/D يدويًا وإعادة تشغيل السيناريو الشامل
- [x] تحديث اختبار end-to-end ليستخدم نوع المصروف واسم المرحلة بدل D/Q يدويًا
- [x] إعادة تشغيل اختبار end-to-end بعد مسار الإدخال الجديد
- [x] التحقق من قيم لوحة المؤشرات بعد إدخال مصروف مشروع وإداري دون ازدواج
- [x] اختبار لوحة المؤشرات صراحةً بعد إدخال مصروف مشروع وإداري بمسار C/E الجديد
- [x] مطابقة مؤشرات لوحة المؤشرات مع التقارير المصدرية دون ازدواج
- [x] إنشاء صفحة كشف حساب موحدة للموردين والمقاولين مرتبطة بالحركات المالية
- [x] إضافة اختصار واضح لكشف حساب الموردين في الصفحة الرئيسية
- [x] اختبار رصيد المورد وتفاصيل الحركات والمدفوعات والمستخلصات
- [x] توسيع تفاصيل كشف حساب الموردين لتغطي كامل نطاق المصروفات والمستخلصات
- [x] اختبار كشف الحساب بعدة مصروفات ومستخلصات خارج الصفوف الأولى
- [x] التحقق من شمول المدفوعات والتسويات المطلوبة في رصيد المورد
- [x] مراجعة مصادر حركة المورد وتحديد أي تسويات إضافية مطلوبة في تصميم النظام
- [x] فحص جميع أوراق حركة المورد وتوثيق المصادر الداخلة والمستبعدة من كشف الحساب
- [x] اختبار عدم وجود مصدر إضافي للمورد خارج المصروفات والمستخلصات أو إضافته للكشف
- [x] إضافة assertion آلي يثبت أن مصادر حركة المورد المستخدمة في الكشف تقتصر على المصروفات والمستخلصات
- [x] تشغيل اختبار تغطية المصادر وتوثيق نجاحه قبل التسليم


- [x] توثيق معادلة رصيد المورد واختبارها على حركة تسوية أو إثبات عدم وجود مصدر إضافي
- [x] إضافة اختيار تقويم لخلايا إدخال التواريخ في جميع الصفحات المناسبة
- [x] دمج مبيعات الوحدات ومبيعات وتحصيلات في صفحة واحدة للإدخال والمتابعة
- [x] تحويل الخانات القابلة للاختيار إلى قوائم منسدلة مرتبطة بالبيانات الأساسية
- [x] اختبار القوائم المنسدلة وعدم كسر الروابط والصيغ
- [x] إعادة توجيه الإيراد والتحصيل والتقارير إلى الصفحة الموحدة دون تكرار
- [x] اختبار البيع والتحصيل والإيراد والمتبقي بعد الدمج
- [x] اختبار تحقق التاريخ وتنسيقه وعدم كسر الصيغ المرتبطة
- [x] توثيق أن المصنف يضيف تحقق تاريخ وتنسيقًا موحدًا، مع التحقق من دعم التقويم الفعلي في بيئة Excel/LibreOffice
- [x] تحديث عناوين بداية/نهاية الأسبوع في صفحات المراحل إلى بداية/نهاية المرحلة
- [x] إضافة تحقق تاريخ موحد لكل خلية إدخال مرتبطة بتاريخ مع الحفاظ على الصيغ
- [x] تحديد أن التقويم المرتبط بماكرو غير مناسب لأن المصنف سيُرفع إلى Google Sheets
- [ ] مراجعة آلية التقويم السابقة الخاصة بـ Excel Windows وتحديد سبب عدم ظهورها في النسخة الحالية
- [ ] إضافة تقويم فعلي لخلايا التاريخ في نسخة Excel Windows مع توضيح متطلبات التفعيل
- [ ] تحسين إعدادات خلايا التاريخ لتكون متوافقة مع أداة التاريخ في Google Sheets دون ماكرو
- [x] عرض قيم التاريخ بصيغة عربية مقروءة مثل 3 مارس 2026 مع الحفاظ على القيمة التاريخية
- [ ] إضافة قائمة منسدلة للشهور في صفحة الرواتب
- [ ] إضافة عمود مستقل للسنة بجوار الشهر في صفحة الرواتب وربطه بالبيانات دون كسر الصيغ
- [x] تنفيذ اختبار إعادة حساب عبر LibreOffice بعد إدخال تواريخ واختيارات من القوائم والتحقق من النتائج downstream
- [x] إعداد مصفوفة نهائية للحقول: قائمة منسدلة أو تاريخ أو كتابة حرة مع سبب التصنيف

- [x] استكمال جرد الحقول المرجعية القابلة للاختيار وتغطيتها بقوائم منسدلة أو توثيق سبب إبقائها كتابة حرة
- [x] إضافة اختبار شامل للقوائم والتواريخ والصيغ المرتبطة بعد إعادة الحساب
- [x] تحسين التصميم البصري للداشبورد إلى بطاقات ومؤشرات احترافية
- [x] مراجعة بصرية واختبار ثبات صيغ الداشبورد بعد التنسيق
- [x] اختبار مصدر قائمة المرحلة النشطة ومحتواها المرحلي وربط الاختيار بالعداد
- [x] تحسين الشكل الجمالي لشريط العدادات والاختيارات في أعلى الصفحة الرئيسية
- [x] إضافة قائمة منسدلة لاختيار حالة المرحلة الحالية
- [x] إضافة قائمة منسدلة لاختيار المرحلة النشطة وإعادة ربط العداد بها

- [x] إصلاح عدم ظهور الموردين أو المقاولين المسجلين داخل قائمة المورد/المستفيد والتحقق من نطاق القائمة

- [x] إعادة ضبط تناسق الصفحة الرئيسية: أحجام البطاقات، المحاذاة، المساحات، العناوين، وأزرار الوصول السريع مع الحفاظ على الروابط والصيغ

- [x] فحص وإزالة أي روابط خارجية غير مقصودة تشير إلى مسارات محلية مثل input.xlsx مع الحفاظ على الروابط الداخلية

- [x] إصلاح عدم انتقال مصروف الحفر إلى التكلفة الفعلية ومعالجة خلايا #REF و#ERROR في صفحة المصروفات

- [x] إصلاح خلايا التصنيف الفارغة وأخطاء #REF و#ERROR الظاهرة في صفحة المصروفات وربط مصروف الحفر بالتكلفة الفعلية

- [x] تكبير أبعاد الخلايا والصفوف والأعمدة بدرجة بسيطة ومتوازنة مع الحفاظ على وضوح الصفحات وعدم اتساعها المفرط

- [x] توحيد عرض قبل الضريبة والضريبة وبعد الضريبة للتكاليف والمصروفات والمبيعات، وتوضيح أن مؤشرات المصروفات والإيراد في الواجهة الرئيسية بدون ضريبة

- [x] التحقق من صفحة العقد الرئيسي وإظهار قيمة البند قبل الضريبة والضريبة وبعد الضريبة بوضوح في جدول البنود

- [x] إعادة ترتيب أعمدة بند العقد لتظهر متجاورة: القيمة قبل الضريبة، الضريبة، القيمة بعد الضريبة بجوار قيمة البند

- [x] إصلاح قائمة اختيار المورد في كشف حساب الموردين بعد إعادة ترتيب أعمدة العقد
- [x] توضيح أن قيمة البند في العقد والبرنامج الزمني مسجلة قبل الضريبة وإظهار الضريبة والإجمالي عند الحاجة

- [x] إظهار قيمة البند قبل الضريبة والضريبة والقيمة بعد الضريبة داخل صفحات المراحل مثل الحفر 01 وربطها بالعقد الرئيسي

- [x] إصلاح سهم قائمة اختيار المورد/المقاول في كشف الحساب وإزالة أخطاء #REF من تفاصيل الكشف

- [x] إعادة ربط قائمة المورد/المقاول مباشرة بخلايا أسماء المقاولين الفعلية في ورقة المقاولون والتحقق من ظهور الأسماء

- [x] استبدال مصدر قائمة المورد/المقاول بمصدر محلي داخل ورقة كشف الحساب لا يعتمد على نطاق خارجي

- [x] تصحيح بداية نطاق قائمة المقاولين ليقرأ أول صف أسماء فعلي بعد العناوين دون حذف الصفوف التمهيدية

- [x] تصحيح بداية نطاق قائمة المقاولين ليقرأ أول صف أسماء فعلي بعد العناوين دون حذف الصفوف التمهيدية

- [x] إصلاح الفاصل الأفقي أو إعداد التجميد الذي يجعل النص المكتوب فوقه غير واضح في صفحة المقاولين

- [x] ضبط صفحة المقاولين RTL وإزالة فواصل العرض أو الحدود التي تجعل النص غير واضح

- [x] إعادة إنشاء صفحتي المقاولين وكشف حساب الموردين من الصفر بتصميم RTL مع الحفاظ على البيانات والروابط

- [x] إعادة إنشاء مصنف إدارة المشروع كاملًا من نسخة نظيفة مع الحفاظ على البيانات الأساسية وإعادة بناء كشف حساب الموردين والروابط والقوائم

- [x] إضافة قائمة مشروع في الرواتب بخياري وادي نمار والقدية، مع فصل تقارير القدية عن مشروع نمار
- [x] إظهار إجمالي رواتب/مصروفات القدية كاختصار مستقل في الرئيسية
- [x] إضافة اختصارات في الرئيسية لكل الصفحات التي لا يوجد لها وصول مباشر
- [x] إعادة بناء المصنف بالكامل من نسخة نظيفة وتسليم نسخة واحدة مستقرة

- [x] التحقق فعليًا من أن سهم قائمة المورد/المقاول في كشف الحساب يظهر الأسماء المسجلة قبل تسليم النسخة
- [x] إصلاح القائمة المنسدلة الفارغة في كشف حساب الموردين بحيث تعرض أسماء المقاولين الفعلية
- [x] استبدال قائمة الموردين الفارغة بمصدر مسمى مباشر من ورقة المقاولين مع اختبار فتحها في Excel/LibreOffice
- [x] حل مشكلة عدم استجابة قائمة كشف حساب الموردين في Excel الفعلي باستخدام آلية توافق بديلة
- [x] نقل اختيار المورد/المقاول إلى خلية جديدة غير مدمجة وواضحة أعلى كشف الحساب وربط الصيغ بها
- [x] نقل عمود المشروع المرتبط بالراتب إلى موضع مبكر في صفحة الرواتب مع الحفاظ على صيغ التقارير
- [x] إعادة بناء تخطيط جدول الرواتب بحيث يظهر المشروع بجوار تصنيف الراتب قبل بيانات المبلغ
- [x] إعادة اختبار القائمة واختيار المورد وفصل وادي نمار عن القدية بعد إعادة الترتيب

- [x] Enforce single-entry data ownership: each expense, payroll, custody, certificate, sale, and collection is entered once in its designated source register and never re-entered in reports
- [x] Document the source-register-to-report map and label report sheets as read-only/calculated views
- [x] Test that one transaction propagates to all linked views exactly once without duplicate counting

- [x] Prepare and deliver the updated workbook with one-time source entry and linked calculated reports

- [x] Hide legacy stage worksheets from normal user navigation and leave المراحل الموحدة as the single visible stage report
- [x] Verify hidden stage worksheets remain intact as formula sources and do not break workbook calculations

- [x] Superseded by user choice: keep the consolidated report name as المراحل الموحدة and hide every remaining individual construction-stage worksheet
- [x] Verify no individual construction-stage worksheet remains visible after the final consolidated report choice

- [x] Keep the consolidated report name as المراحل الموحدة while hiding all individual construction-stage worksheets

- [x] Delete individual construction-stage worksheets from the delivery workbook, leaving المراحل الموحدة as the only stage page
- [x] Recalculate and verify formulas, hyperlinks, dropdown validations, and report references after deleting stage worksheets

- [x] Apply direct contract-to-unified-stages linkage so stage identity and budget are entered once in العقد الرئيسي and reflected automatically
- [x] Validate one-time entry propagation across expenses, payroll, custody, certificates, collections, and dashboard without duplicate totals

- [x] Add payroll due/paid/outstanding calculations with tax-free treatment
- [x] Link outstanding payroll to the home-page accrued-expenses shortcut without double counting
- [x] Test paid and unpaid payroll scenarios across payroll, expenses, dashboard, and unified stages

- [x] Set project timer dates to 2026-08-01 through 2029-01-31 for the 30-month project duration
- [x] Set excavation stage timer dates to 2026-08-01 through 2026-08-31 and validate countdown edge cases

- [x] Style the project and current-stage countdown shortcuts as compact circular clock-style widgets on الرئيسية

- [x] Superseded by user decision: use تكلفة خامات inside التكاليف والمصروفات instead of a separate materials register; material, tax, payment, stage, cost-center, and project links are handled in the unified transaction row
- [x] Link تكلفة خامات totals to project cost, stage cost, cost center, dashboard, and accrued expenses without duplicate counting
- [x] Test material tax, payment, stage propagation, and total-cost calculations

- [x] Rename المصروفات to التكاليف والمصروفات and add تكلفة خامات as a selectable transaction type
- [x] Ensure material transactions use the same tax, payment, stage, cost-center, due, and dashboard paths without duplicate entry

- [x] Expand the transaction-type dropdown to cover materials, operating tools, equipment rental, contractors, transport, labor, maintenance, services, operating, and administrative costs
- [x] Verify each dropdown value maps to the correct project/company classification and reports

- [x] Expand مركز التكلفة to show each contract/material cost line such as iron, cement, ceramic, insulation, tools, and equipment under its stage
- [x] Link line-item budgets and actual costs from العقد الرئيسي and التكاليف والمصروفات without duplicate totals
- [x] Test line-item cost-center propagation and variance calculations

- [x] Complete the consolidated workbook pass covering renamed costs/expenses, payroll due tracking, unified stages, categorized cost center, and clock-style timers
- [x] Run one final end-to-end workbook validation and deliver the tested file

- [ ] Complete web ERP parity with the Excel operating model while preserving one-time source entry
- [x] Add and validate missing operational modules: detailed cost-center line items, materials/cost types, payroll due tracking, custody, attendance, certificates, supplier statements, attachments, and exports
- [ ] Complete role-based permissions, approval workflows, audit trail, project isolation, and user management for the ERP
- [ ] Reconcile web dashboard and reports against the unified workbook logic with end-to-end integration tests

- [x] Build a line-by-line Excel-to-web parity matrix covering every requested field, rule, dropdown, calculation, report, and workflow
- [ ] Do not declare web parity complete until every matrix item has a working UI, backend rule, and passing test

- [x] Build explicit revenue, expense, payroll, and tax report views with project and period filters in the web reports module
- [x] Add tests covering revenue, expense, payroll, tax, supplier statement, cash-flow, and project-performance report totals

- [x] Audit every ERP router read/write endpoint, including vendor and administrative queries, for consistent project-membership enforcement
- [x] Add permission tests proving non-admin users cannot read or write outside assigned projects across ERP modules and comparison dashboards

- [x] Redesign homepage shortcut cards with a polished visual hierarchy, balanced spacing, clear color states, icons, and clickable detail links
- [x] Verify the redesigned shortcut cards remain readable and responsive in Arabic RTL desktop and mobile layouts

- [x] إضافة حقلي وحدة القياس والكمية إلى مصدر التكاليف والمصروفات وربطهما بالـ API والواجهة مع الحفاظ على الضريبة وعدم ازدواج الحركة
- [x] إضافة تصنيف المشروع تشغيلي/إداري إلى قاعدة البيانات وواجهة إنشاء المشاريع وسجلها
- [x] إضافة فحص اكتمال بيانات المقاولين ومستنداتهم وربطه بتنبيهات لوحة القيادة مع اختبارات
- [x] إضافة اختبار مستقل لإجماليات اختصارات الصفحة الرئيسية بعد ربط الإيراد والتحصيلات
- [ ] اختبار واجهة فعلية لمسار بيع وحدة ثم تحصيل دفعة والتحقق من تحديث لوحة القيادة لحظيًا
- [ ] استكمال ربط فحص المستندات الإلزامية بالمستخلصات وطلبات الدفع
- [ ] استكمال صلاحيات الأدوار التفصيلية للمستخدمين
- [ ] استكمال التحقق الشامل النهائي لمسارات العمليات والتقارير قبل التسليم
- [ ] استكمال تكامل Meta Ads متعدد الحسابات، وهو نطاق منفصل عن ERP المشروع الحالي
- [ ] استكمال مقارنة خيارات الاستضافة والتشغيل متعدد المستخدمين بعد تثبيت نطاق ERP

> ملاحظة: البنود القديمة الخاصة بملف Excel محفوظة كسجل تاريخي ولا تعني أن النسخة الحالية تحتاج إعادة تنفيذها.

- [x] منع أدوار viewer/reviewer من إنشاء مصروفات ورواتب ومبيعات وتحصيلات، مع السماح للمدير والمالية والإدخال ضمن نطاق المشروع
- [x] توسيع حارس الصلاحيات إلى العهد والمستخلصات والمرفقات وتعديلات السجلات

- [x] إصلاح مسار صفحة المعاملات المالية الذي ظهر 404 عند فتح /finance والتحقق من الرابط الصحيح في التنقل

- [x] توحيد dashboard.summary مع calculateFinancialSummaryTotals لضمان أن مبيعات الوحدات والتحصيلات والإيرادات المعترف بها تأتي من مصدر حسابي واحد
- [x] إضافة اختبار API/واجهة كامل ينشئ مشروعًا ووحدة وبيعًا وتحصيلًا ثم يقرأ dashboard.summary من نفس التدفق

- [x] إضافة اختبار صلاحيات قابل للتشغيل يثبت وصول admin والكتابة لأدوار manager/finance/input ومنع reviewer/viewer

- [x] إظهار شرح عربي واضح لصلاحيات الأدوار داخل شاشة المستخدمين قبل إسناد المستخدم للمشروع

- [x] مراجعة RTL والاستجابة على الهاتف للداشبورد والمالية والمستخدمين دون تداخل واضح

- [x] فحص المستخلصات الناقصة للمقاول أو المرفق الداعم داخل dashboard.summary وربطها بتنبيه المستندات التفصيلي
- [x] توسيع فحص طلبات الدفع والمرفقات المطلوبة حسب نوع المعاملة

- [x] إضافة اختبار API تكاملي ينشئ بيع وحدة وتحصيلًا مستلمًا ثم يتحقق من dashboard.summary وfinancialSummary من نفس الحالة
- [ ] إضافة اختبار واجهة فعلي لصفحة المبيعات والتحصيلات الموحدة يثبت تحديث بطاقات الداشبورد بعد الإدخال

- [x] إعادة إبطال استعلامات الداشبورد والتقرير المالي تلقائيًا بعد نجاح بيع أو تحصيل من الصفحة الموحدة
- [x] مراجعة بصرية لصفحة المبيعات والتحصيلات على سطح المكتب RTL
- [ ] اختبار تفاعل واجهة كامل عبر إدخال قيم في النموذج والتحقق من البطاقات بعد التحديث

- [x] إظهار رسالة داخل صفحة المبيعات والتحصيلات تؤكد أن الإدخال مرة واحدة وينعكس تلقائيًا على الداشبورد والتقارير

- [x] إضافة members.mine وربط صفحة المبيعات والتحصيلات بإخفاء نماذج الإدخال عن viewer/reviewer مع اختبار عضوية finance

- [x] إضافة trace للموافقات وسجل التدقيق إلى سجلات المبيعات والتحصيلات والمصروفات والرواتب والموردين والمستخلصات والعهد والحضور والمرفقات
- [x] اختبار controls.trace من مسار API فعلي، ومراجعة بصرية لصفحة التشغيل RTL

- [x] ربط نموذج الرواتب بملخص حضور شهري حسب المشروع والشهر والسنة مع عرض الحاضر والغائب والمتأخر

- [x] توسيع اختبار التتبع التكاملي ليشمل المورد العام والمستخلص والعهدة والمرفق والحضور والمبيعات والتحصيلات والمصروفات والرواتب

- [x] إضافة اختبار متصفح smoke للمسارات الأساسية ورسالة التسجيل مرة واحدة، مع توثيق توقف التفاعل الكامل عند شاشة تسجيل الدخول المحلية

- [x] إضافة stageId اختياري إلى مبيعات الوحدات وترحيل قاعدة البيانات
- [x] إظهار اختيار المرحلة في نموذج البيع وربط التحصيلات بها داخل cashFlow المرحلي
- [x] اختبار API لتوزيع التحصيل على المرحلة عند وجود stageId، مع بقاء قاعدة غير المصنف للحالات القديمة

- [x] إضافة جدول approval_policies لإعداد حد اعتماد مختلف لكل مشروع ونوع حركة ومبلغ
- [x] إضافة إجراءات API إدارية لعرض وتعديل سياسات الاعتماد مع عزل المشروع
- [x] إضافة واجهة إعدادات مبسطة لحدود الاعتماد الافتراضية وإضافة اختبار سياسة، وتطبيق الحد ديناميكيًا على إنشاء الحركات واختبار اختلاف النتيجة

- [x] تطبيق حالة pending على المبيعات والتحصيلات الأعلى من حد الموافقة ومنعها من التأثير في التقارير قبل الاعتماد
- [x] إضافة اختبارات حدود الموافقة للرواتب والمستخلصات والمبيعات والتحصيلات
- [x] إظهار نتيجة الموافقة والحد الفعّال في واجهات الحركات أو التتبع


- [x] إضافة شاشة عربية لمعاينة ملفات Excel محليًا وعرض الأوراق والعناوين والصفوف غير الفارغة دون حفظ
- [ ] تنفيذ مطابقة نهائية وإدخال الحركات من Excel مع مفتاح منع التكرار وسجل تسوية


- [ ] اعتماد وادي نمار كمشروع افتراضي للاستيراد القديم
- [ ] تجاهل صفوف القالب والصيغ والصفوف الفارغة أثناء الاستيراد
- [ ] مطابقة الصفوف التشغيلية ومنع تكرار الحركة وإظهار تقرير الاستثناءات


## Excel payroll and employee custody enhancement

- [ ] إعادة بناء صفحة عهد الموظفين كسجل حركة يشمل عهدة مستلمة ومصروفات وتسويات وتصنيف المشروع أو الإداري
- [ ] إنشاء كشف حساب عهد الموظفين بفلتر موظف من قائمة منسدلة وإظهار الحركات والرصيد
- [ ] ربط حركات العهد بالمجاميع والملخصات والاختصارات الرئيسية دون تكرار
- [ ] إضافة مسير رواتب شهري مرتبط بالشهر والسنة والحضور والغياب
- [ ] إضافة خصم الغياب تلقائيًا من الراتب مع توضيح أساس الخصم
- [ ] إضافة نسبة تحمل التكلفة بين وادي نمار والمهدية مع توزيع تلقائي للمبلغ
- [ ] نقل تصنيف الراتب إلى الأعمدة الأولى في صفحة الرواتب
- [ ] تغيير اسم المشروع الثاني من القدية إلى المهدية في الأوراق والقوائم والصيغ
- [ ] الحفاظ على دمج مبيعات الوحدات والدفعات المحصلة وربطهما بالإيراد
- [ ] اختبار القوائم المنسدلة والصيغ والملخصات بعد التعديل وتسليم نسخة Excel


## Two-project Excel separation

- [x] جعل وادي نمار والمهدية قائمتين رسميتين للمشروعات في كل صفحات الإدخال
- [x] إلزام تحديد المشروع لكل بند وحركة قابلة للتسجيل مع منع تركه فارغًا
- [x] إنشاء لوحة مؤشرات مستقلة للمهدية مع مؤشرات الإيراد والتكلفة والتحصيل والمستحقات
- [ ] فصل صيغ وتقارير نمار والمهدية مع إبقاء الإجمالي العام للمشروعين
- [ ] اختبار عدم اختلاط حركات المشروعين والقوائم والصيغ والملخصات


- [x] إعادة بناء صفحة مبيعات الوحدات والدفعات المحصلة كصفحة تشغيلية واحدة شاملة
- [x] ربط كل دفعة بوحدة أو عملية بيع ومشروع محدد مع حساب المقبوض والمتبقي والإيراد
- [x] اختبار انعكاس البيع والدفعات في لوحة نمار ولوحة المهدية والإجمالي العام


- [x] إخفاء صفحات المراحل الفردية من واجهة المستخدم والإبقاء على صفحة المراحل الموحدة كتقرير
- [x] التأكد من أن صفحة المراحل الموحدة تستمد بياناتها من العقد والتكاليف ولا تحتوي إدخالًا مكررًا
- [x] اختبار الروابط بعد إخفاء صفحات المراحل وتسليم نسخة مصححة


## Final workbook alignment

- [ ] استخدام آخر نسخة Excel المعتمدة ذات المراحل الموحدة كمصدر وحيد للتعديل
- [ ] نقل عمود اختيار المشروع إلى الأعمدة الأولى في كل صفحات الإدخال دون كسر الصيغ
- [ ] اختبار بقاء المراحل الموحدة وصفحات المراحل الفردية مخفية بعد النقل


## Attached final workbook hhh.xlsx

- [x] اعتماد هه.xlsx كمصدر وحيد وعدم الرجوع للنسخ الأقدم
- [x] نقل اختيار المشروع إلى الأعمدة الأولى في جميع جداول الإدخال داخل هه.xlsx
- [x] إنشاء داشبورد مستقلة لوادي نمار وداشبورد مستقلة للمهدية داخل هه.xlsx
- [x] الحفاظ على صفحة المراحل الموحدة وإخفاء صفحات المراحل الفردية إن وجدت
- [x] اختبار فصل مؤشرات المشروعين وتسليم الملف المعدل


## Active project countdown on home page

- [ ] إزالة قسم مراحل المشروع بالكامل من الصفحة الرئيسية في آخر نسخة Excel
- [ ] إنشاء قائمة منسدلة للمشروعات النشطة التي تحتوي على تاريخ بداية ونهاية
- [ ] عرض الأيام المتبقية للمشروع المختار مع حالات منتهٍ وتواريخ ناقصة
- [ ] اختبار العداد والقائمة وعدم التأثير على لوحات المشروعين


- [ ] إزالة الفهرس من الصفحة الرئيسية في آخر نسخة Excel


- [ ] حذف صفحات داشبورد وادي نمار وداشبورد المهدية من آخر نسخة Excel
- [ ] نقل مؤشرات كل مشروع إلى صفحته الرئيسية الخاصة وتحديث الروابط
- [ ] اختبار عدم وجود روابط مكسورة بعد حذف صفحات الداشبورد


## Project selector at page start

- [x] إضافة خانة اختيار المشروع في أعلى العقد والبرنامج الزمني والصفحات التشغيلية
- [x] جعل اختيار المشروع إلزاميًا قبل تعبئة بيانات الصفحة مع رسالة إرشادية واضحة
- [x] الحفاظ على عمود المشروع داخل كل صفوف الحركات وعدم تعارضه مع محدد الصفحة
- [x] اختبار القوائم والصيغ والروابط بعد إضافة محدد المشروع


## Dropdown source audit

- [x] تدقيق كل مصادر القوائم المنسدلة في آخر نسخة Excel
- [x] إصلاح قائمة المشروع وقائمة الموظفين والمراحل والموردين ومراكز التكلفة وغيرها
- [x] اختبار وجود قيم فعلية في مصدر كل قائمة وتطبيقها على الخلايا الصحيحة
- [x] اختبار عهد الموظفين وباقي صفحات الإدخال بعد إصلاح القوائم


## Project column placement correction

- [ ] نقل عمود المشروع من الأول إلى الثالث أو الرابع حسب بنية كل جدول
- [ ] إصلاح قائمة المشروع بحيث تعرض وادي نمار والمهدية فعليًا في كل الصفحات
- [ ] اختبار عمود المشروع في عهد الموظفين وباقي الصفحات بعد تغيير موضعه


## Custody movement ledger

- [x] إعادة بناء صفحة عهد الموظفين كسجل حركة مالية مستقل لكل قبض وصرف ورد وتسوية
- [x] إضافة نوع الحركة واتجاهها ومبلغها وربطها بالموظف والمشروع
- [x] تحويل كشف حساب العهد إلى تقرير تجميعي يوضح إجمالي المقبوض والمصروف والرصيد
- [x] ربط حركات العهد بالمجاميع والداشبورد دون تكرار
- [x] اختبار سيناريو قبض 500 ثم صرف 100 ثم حساب الرصيد 400

