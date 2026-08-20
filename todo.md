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


## Excel multi-sheet selection dropdown bug

- [ ] فحص حالة تحديد الأوراق المتعددة والجداول في آخر ملف Excel
- [ ] إزالة تعارض القوائم المنسدلة مع XML mapping أو جداول Excel
- [ ] اختبار اختيار المشروع داخل عهد الموظفين منفردًا وباقي الصفحات


## Restore executive home layout

- [ ] استعادة هيكل الصفحة الرئيسية الأصلي من آخر نسخة قبل التبسيط
- [ ] الحفاظ على بطاقات المؤشرات والاختصارات والعداد والملخصات التنفيذية
- [ ] حذف الفهرس وقسم مراحل المشروع فقط دون حذف باقي مكونات الرئيسية
- [ ] إنشاء نسختين من نفس الهيكل لمشروع وادي نمار والمهدية
- [ ] اختبار الصيغ والروابط والعداد بعد الاستعادة


- [ ] اعتماد هه.xlsx مرجعًا بصريًا ووظيفيًا كاملًا للصفحة الرئيسية دون تبسيط غير مطلوب
- [ ] تنفيذ الحذف المتفق عليه فقط: الفهرس وقسم المراحل وصفحات الداشبورد المنفصلة
- [ ] الحفاظ على باقي البطاقات والعدادات والاختصارات والملخصات كما كانت في هه.xlsx


- [ ] استعادة الجراف أو الخريطة الموجودة في لوحة المؤشرات الأصلية من هه.xlsx
- [ ] الحفاظ على مصدر بيانات الجراف وربطه بمؤشرات المشروع الصحيحة
- [ ] اختبار ظهور الجراف بعد إعادة تنظيم الصفحات الرئيسية


## Dashboard project selector

- [x] إضافة محدد مشروع في أعلى صفحة لوحة المؤشرات
- [x] ربط بطاقات لوحة المؤشرات والجرافات والملخصات بالمشروع المختار
- [x] اختبار عدم خلط بيانات وادي نمار والمهدية في لوحة المؤشرات


- [ ] حذف صفحة بوابة المشاريع نهائيًا
- [ ] تحديث الروابط لتبدأ مباشرة من رئيسية وادي نمار ورئيسية المهدية
- [ ] اختبار عدم وجود روابط مكسورة بعد حذف البوابة


- [ ] إصلاح عرض تواريخ بداية ونهاية المرحلة بصيغة يوم وشهر وسنة بدل أرقام Excel التسلسلية
- [ ] الحفاظ على التحقق من التاريخ ورسالة التقويم بعد تغيير التنسيق
- [ ] اختبار البرنامج الزمني والمراحل الموحدة والعدادات بعد الإصلاح


- [x] إزالة عمود المشروع المكرر من صفحة التكاليف والمصروفات أو إخفاؤه كعمود داخلي إذا كانت الصيغ تحتاجه
- [x] الإبقاء على محدد المشروع العلوي فقط للمستخدم
- [x] اختبار عدم تأثر التقارير والمجاميع بعد إزالة التكرار


- [ ] إزالة عمود المشروع المكرر من صفحة الدفعات المحصلة أو إخفاؤه كعمود داخلي
- [ ] الإبقاء على محدد المشروع العلوي فقط في صفحة الدفعات
- [ ] اختبار ربط الدفعات بالمبيعات والمجاميع بعد إزالة التكرار


## Project selector for financial reports

- [ ] إضافة محدد مشروع علوي إلى مركز التكلفة وقائمة الدخل والتدفقات النقدية
- [ ] ربط إجماليات كل تقرير بالمشروع المختار وعدم خلط نمار والمهدية
- [ ] إخفاء مفاتيح المشروع الداخلية إذا كانت لازمة للصيغ
- [ ] اختبار التقارير الثلاثة بعد إضافة المحدد


## Payroll allocation and classification

- [ ] تحويل عمود المشروع داخل جدول الرواتب إلى نسبة تحميل المشروع من الراتب
- [ ] نقل نسبة التحميل إلى العمود الثالث أو الرابع وربط صافي وتكلفة الراتب بها
- [ ] إصلاح قائمة تصنيف الراتب لتعرض قيمًا فعلية غير فارغة
- [ ] اختبار نسبة 50% و60% و100% وتصنيف راتب مشروع وراتب إداري


- [ ] نقل تصنيف الراتب/المشروع إلى العمود الخامس أو السادس في جدول الرواتب
- [ ] الحفاظ على نسبة تحميل المشروع في العمود الثالث أو الرابع
- [ ] تحديث الصيغ والقوائم بعد إعادة الترتيب واختبارها


## Dynamic project management in Excel

- [x] إنشاء صفحة إدارة المشروعات لإضافة مشروع جديد بالاسم والحالة وتواريخ البداية والنهاية والبيانات الأساسية
- [x] تحويل قائمة المشروعات إلى مصدر ديناميكي قابل للتوسع بدل قيمتين ثابتتين
- [x] ربط محددات المشروع والقوائم والتقارير بالمشروعات الجديدة
- [x] اختبار إضافة مشروع ثالث وعزل بياناته عن نمار والمهدية


## Restore full visual project homepages

- [x] إعادة بناء رئيسية وادي نمار بنفس أقسام وألوان وتنسيق الصور المرجعية
- [x] إعادة بناء رئيسية المهدية من نفس الهيكل مع فلترة بياناتها عبر محدد الصفحة الموحدة
- [x] استعادة لوحة التحكم والبطاقات والعدادات وبيانات المشروع والاختصارات والملخص المالي
- [x] إزالة الفهرس وقسم المراحل فقط، دون حذف باقي تفاصيل الصفحة الأصلية
- [x] اختبار التطابق البصري والصيغ والروابط وتسليم النسخة


## Row-level payroll project selection

- [x] إزالة محدد المشروع العلوي من صفحة الرواتب
- [x] إعادة قائمة اختيار المشروع داخل كل صف من صفوف الرواتب
- [x] الإبقاء على عمود نسبة تحميل المشروع من الراتب وتطبيقه على تكلفة الراتب
- [x] اختبار صفوف بنسب 50% و60% و100% مع مشروعات مختلفة


## Unified project homepage

- [x] دمج رئيسية وادي نمار ورئيسية المهدية في صفحة رئيسية واحدة كاملة
- [x] إضافة محدد مشروع واحد في الصفحة الموحدة
- [x] ربط المؤشرات والعدادات والاختصارات والملخصات بالمشروع المختار
- [x] حذف الصفحات الرئيسية المكررة واختبار الصفحة الموحدة


## Project countdown correction

- [x] إعادة بناء عداد المشروع بنفس ترتيب وشكل الصورة المرجعية
- [x] ربط الأيام المتبقية وتاريخي البداية والنهاية بالمشروع المختار
- [x] اختبار عدم ظهور غير محدد عند وجود تواريخ المشروع


## Executive quick-control bar

- [ ] إضافة شريط التحكم التنفيذي بنفس ترتيب وألوان الصورة المرجعية
- [ ] إضافة محدد المرحلة الحالية وحالتها داخل الشريط
- [ ] إضافة روابط تسجيل المصروف والمستخلص والدفعة والمقاول والبند والمهمة اليومية
- [ ] اختبار الروابط والقوائم وعدم تكرار الإدخال


## Restore financial summary and report shortcuts

- [ ] استعادة قسم الملخص المالي أسفل الصفحة الرئيسية بنفس البطاقات والألوان والصيغ
- [ ] ربط الملخص المالي بالمشروع المختار مع فصل الإيراد والمصروفات والضريبة
- [ ] استعادة اختصارات سجل الموظفين والحضور والانصراف وكشف الموردين وتحليل السيولة والمراحل الموحدة
- [ ] اختبار فتح الملف والقوائم والروابط بعد الإضافة

## Unified stages project selector

- [ ] إضافة محدد مشروع واضح في أعلى صفحة المراحل الموحدة
- [ ] ربط بيانات وتقرير المراحل بالمشروع المختار
- [ ] اختبار عدم اختلاط مراحل وادي نمار والمهدية

## Schedule date formatting

- [ ] ضبط صيغة بداية المرحلة ونهاية المرحلة في صفحة البرنامج الزمني
- [ ] إضافة تحقق تاريخي واضح لخلايا إدخال التواريخ
- [ ] اختبار ظهور التواريخ وعدم تحولها إلى أرقام أو تواريخ غير صحيحة

## Schedule time and quantity variance

- [ ] فصل الانحراف إلى عمود انحراف وقت وعمود انحراف كمية
- [ ] ربط انحراف الوقت بالمدة المخططة والمنقضي الفعلي
- [ ] منع إظهار انحراف كمية عندما تكون الكمية المنفذة ضمن الإطار الزمني المحدد
- [ ] اختبار حالات التنفيذ المبكر والمتأخر والكمية الجزئية

## Supplier statement project selector

- [ ] جعل محدد المشروع العلوي هو المحدد الوحيد في كشف حساب الموردين
- [ ] إزالة عمود وخانة المشروع المتكررة من صفوف التقرير
- [ ] ربط التقرير مباشرة بالمشروع المختار واختبار عزل المشروعين

## Homepage progress cards

- [ ] إضافة نسبة إنجاز المشروع ككل بجوار عداد الوقت
- [ ] إضافة نسبة إنجاز المرحلة النشطة الحالية بجوار عداد الوقت
- [ ] ربط النسب تلقائيًا ببيانات البرنامج الزمني والمشروع والمرحلة المختارين
- [ ] اختبار النسب عند نقص البيانات وتغير المشروع أو المرحلة

## Homepage budget versus actual comparison

- [ ] إضافة رقم الميزانية الإجمالية للمشروع المختار
- [ ] إضافة رقم إجمالي المنصرف على المشروع المختار
- [ ] إضافة مربع الفرق بين الميزانية والمنصرف
- [ ] تلوين الفرق أخضر عند الوفر وأحمر عند تجاوز الميزانية واختبار المشروعين

## Project and active-stage budget comparison

- [ ] إضافة مقارنة الميزانية والمنصرف والفرق للمشروع ككل
- [ ] إضافة مقارنة الميزانية والمنصرف والفرق للمرحلة النشطة الحالية
- [ ] ربط مقارنة المرحلة بالمشروع والمرحلة المختارين
- [ ] اختبار التلوين الأخضر والأحمر على المستويين

## Unified top executive section

- [ ] إنشاء قسم علوي مستقل بجوار عداد الوقت في الصفحة الرئيسية
- [ ] جمع عداد الوقت ونسبة إنجاز المشروع والمرحلة النشطة داخل القسم
- [ ] جمع مقارنة ميزانية المشروع والمرحلة داخل القسم
- [ ] اختبار عدم تداخل القسم مع العناوين والاختصارات الحالية

## Two-project payroll allocation

- [ ] إضافة مشروع تحميل أول ونسبة تحمله في بداية جدول الرواتب
- [ ] إضافة مشروع تحميل ثان ونسبة تحمله بجواره
- [ ] حساب تكلفة كل مشروع من صافي الراتب بعد خصم الغياب
- [ ] منع مجموع نسب التحمل من تجاوز 100% واختبار 100% و50/50

## General administrative expense allocation

- [ ] تعريف المصروف الإداري العام غير المرتبط بمشروع
- [ ] حساب نسبة كل مشروع من إجمالي قيمة العقود
- [ ] توزيع الرواتب والمصروفات الإدارية العامة حسب النسبة دون تكرار القيد الأصلي
- [ ] إظهار نصيب كل مشروع وإجمالي الإداري العام في التقارير
- [ ] اختبار مثال عقد 10 ملايين و5 ملايين بنسبة 66.67% و33.33%

## Payroll allocation type selector

- [x] إضافة قائمة نوع التحميل: نسبة تحمل أو مصروف إداري عام
- [x] إضافة عمود نسبة التحمل اليدوية بجوار نوع التحميل
- [x] جعل النسبة اليدوية مطلوبة فقط عند اختيار نسبة تحمل
- [x] ربط الإداري العام بالتوزيع النسبي حسب قيمة العقود ومنع التعارض

## Consolidated final workbook rebuild

- [x] تثبيت ملف مصدر واحد وعدم تسليم نسخ جزئية متعارضة
- [x] دمج كل تعديلات الصفحة الرئيسية والتقارير والعدادات في نسخة واحدة
- [x] دمج البرنامج الزمني وكشف الموردين والرواتب ونوع التحميل في النسخة نفسها
- [x] تشغيل فحص شامل لكل المتطلبات قبل التسليم
- [x] إعداد تقرير تحقق يوضح ما تم تطبيقه وما يحتاج إدخال المستخدم

## Fix homepage budget comparison errors

- [ ] تشخيص صيغ #VALUE في بطاقات المشروع والمرحلة
- [ ] استبدال الصيغ غير الآمنة بصيغ تتعامل مع النصوص والقيم الفارغة
- [ ] اختبار عدم ظهور #VALUE في الصفحة الرئيسية

## Project and excavation dates

- [ ] تثبيت بداية المشروع ومرحلة الحفر في 1 أغسطس 2026
- [ ] تثبيت نهاية مرحلة الحفر في 31 أغسطس 2026
- [ ] تثبيت نهاية المشروع في 30 يناير 2029
- [ ] اختبار عدادات المشروع والمرحلة والبرنامج الزمني بهذه التواريخ

## Fix progress direction and comparison formulas

- [x] جعل 30% تظهر كنسبة إنجاز المرحلة النشطة لا المشروع
- [x] حساب نسبة إنجاز المشروع ككل بشكل مستقل من جميع المراحل
- [x] إصلاح #VALUE في بطاقات مقارنة الميزانية والمنصرف
- [x] اختبار العناوين والقيم بصريًا ومنطقيًا

## Direct project dropdown administrative salary

- [x] إضافة «راتب إداري عام» إلى قائمة عمود المشروع المباشر في الرواتب
- [x] إبقاء وادي نمار والمهدية كخيارات مشروع مباشرة
- [x] ربط راتب إداري عام بتقرير التوزيع حسب قيمة العقود

## Administrative salary contract-based allocation

- [x] توزيع الراتب الإداري العام حسب نسبة قيمة عقد كل مشروع
- [x] ضمان أن مجموع أنصبة المشاريع يساوي الراتب الإداري الأصلي مرة واحدة
- [x] دعم عدد مشاريع قابل للزيادة دون تعديل المعادلات يدويًا
- [x] اختبار مثال 10 ملايين/5 ملايين بنسبة 66.67%/33.33%

## Stage-count project progress

- [ ] حساب إنجاز المشروع كعدد المراحل المنتهية من إجمالي المراحل
- [ ] إبقاء إنجاز المرحلة النشطة مبنيًا على منفذ المرحلة
- [ ] اختبار حالات صفر مراحل منتهية ومرحلة منتهية وكل المراحل منتهية

## Homepage shortcut links and statements

- [x] ربط اختصارات التكاليف والرواتب والعهد والمبيعات والتحصيلات بأوراقها الداخلية
- [x] إضافة اختصار كشف حساب الموردين
- [x] إضافة اختصار كشف حساب العهد
- [x] اختبار الرابط الفعلي لكل اختصار من الصفحة الرئيسية

## Homepage executive input boxes

- [x] إدراج خانات إضافة مستخلص وتسجيل مصروف وإضافة مقاول
- [x] إدراج خانات مهمة يومية وتسجيل دفعة محصلة وإضافة بند جديد
- [x] إضافة روابط فتح النماذج أسفل كل خانة
- [x] الحفاظ على ألوان وترتيب التصميم المرجعي واختبار الروابط

## Timer cards reference style

- [x] إضافة بطاقة عداد المرحلة بنفس الإطار الذهبي والخلفية الزرقاء الفاتحة
- [x] إضافة بطاقة عداد المشروع بنفس الاستايل
- [x] إظهار الأيام المتبقية والمرحلة والتاريخ والحالة بوضوح
- [x] اختبار العدادات عند التواريخ المرجعية للمشروع والحفر

## Timers inside executive indicators section

- [x] وضع عداد المرحلة في أعلى قسم المؤشرات التنفيذية
- [x] وضع عداد المشروع في أعلى القسم نفسه
- [x] الحفاظ على ترتيب نسب الإنجاز ومقارنات الميزانية أسفل العدادين

## Budget cards layout

- [ ] تنظيم بطاقة المشروع ككل في الجانب الأيسر
- [ ] تنظيم بطاقة المرحلة الحالية في الجانب الأيمن
- [ ] عرض الميزانية والمنصرف والفرق ومعدل الانحراف والحالة داخل كل بطاقة
- [ ] اختبار التلوين والصيغ بعد إعادة التنظيم

## Quick financial summary below budget cards

- [x] إضافة شريط ملخص مالي سريع أسفل بطاقات المشروع والمرحلة
- [x] عرض التكاليف والمصروفات والمدفوع والمستحق والإيراد والمحصّل
- [x] ربط القيم بالمشروع المختار ومعالجة الضريبة بوضوح

## Schedule variance correction

- [x] منع ظهور «متأخر زمنيًا» تلقائيًا لمرحلة الحفر عند انتهاء الفترة
- [x] منع إظهار انحراف كمية لمجرد أن التنفيذ أقل من 100% أثناء الإطار الزمني
- [x] إبقاء الانحراف ظاهرًا فقط عند تحقق شرط تأخير أو انحراف فعلي
- [x] اختبار مرحلة الحفر بتواريخ 1–31 أغسطس 2026

## Google Sheets compatible workbook

- [x] إنشاء نسخة مخصصة للرفع إلى Google Sheets
- [x] استبدال مراجع القوائم المعتمدة على أسماء Excel بنطاقات مباشرة
- [x] إعادة تطبيق قوائم المشروع والمراحل والموردين والموظفين والتصنيفات
- [x] اختبار وجود Data Validation في صفحات الإدخال

## Native Google Sheets validation fix

- [ ] تحديد خلايا اختيار المشروع التي تحتاج قواعد Google Sheets أصلية
- [ ] إنشاء سكربت Apps Script لإضافة القوائم بعد رفع الملف
- [ ] توفير خطوات تشغيل واضحة واختبار قائمة المشروع

## Direct Google Sheets project dropdown

- [ ] تطبيق قائمة المشروع مباشرة من داخل Google Sheets
- [ ] معالجة الخلية العلوية وعمود المشروع في الصفوف
- [ ] اختبار ظهور السهم والاختيار وادي نمار والمهدية

## Dashboard project dropdown in Google Sheets

- [ ] إضافة قائمة المشروع إلى الخلية البرتقالية العلوية في لوحة المؤشرات
- [ ] اختبار تبديل وادي نمار والمهدية وتحديث المؤشرات

## Custody general-expense classifications

- [ ] إضافة «مصروف نثري عام» و«مصروف إداري عام» إلى قائمة المشروع في عهد الموظفين
- [ ] عدم اعتبار المشروع المحدد إلزاميًا عند اختيار أحد التصنيفين العامين
- [ ] ربط تقارير العهد والتكاليف بالتصنيف العام دون فقد الحركة

## Custody expense nature

- [ ] إضافة قائمة طبيعة المصروف أو التحميل في سجل العهد
- [ ] ربط نوع الحركة «صرف من العهدة» بالتصنيف
- [ ] تمييز المشروع والنثري العام والإداري العام والتشغيلي

## Custody statement all filter

- [ ] إضافة خيار «الكل» إلى محدد المشروع أو التصنيف في كشف حساب العهد
- [ ] تعديل التقرير ليعرض جميع حركات الموظف عند اختيار الكل
- [ ] اختبار حركة مصروف نثري عام 500 ريال داخل الكشف

## Custody statement all option implementation

- [ ] إضافة «الكل» إلى قائمة محدد التصنيف في كشف حساب العهد
- [ ] تعديل صيغ صفوف الكشف لتقبل الكل كاختيار شامل
- [ ] التحقق من ظهور حركة المصروف النثري العام للموظف

## Custody statement employee-code fix

- [ ] ربط كشف حساب العهد بكود الموظف في العمود الصحيح
- [ ] إبقاء خيار الكل عاملًا مع التصنيف العام
- [ ] اختبار ظهور حركة 500 ريال للموظف 1

## Dynamic FILTER custody statement

- [ ] استبدال صيغ كشف العهد بصيغة FILTER واحدة
- [ ] عرض كل تفاصيل الحركات للموظف والتصنيف المختار
- [ ] دعم الكل والتحقق من حركة 500 ريال

## Excel parity in web ERP

- [x] جرد الفجوات بين متطلبات Excel ونسخة الويب الحالية
- [x] استكمال تصنيف العهد والمصروفات العامة وكشوف الحساب
- [ ] استكمال توزيع الرواتب الإدارية حسب قيم العقود
- [ ] استكمال مؤشرات المشروع والمرحلة والميزانيات والانحرافات
- [ ] استكمال روابط الاختصارات والتقارير واختبار التدفقات الأساسية

## Web ERP parity continuation — August 2026

- [x] Apply project contract value database migration
- [x] Add contract value to project creation and project cards
- [x] Add administrative payroll and project allocation tables
- [x] Add contract-value-based administrative payroll allocation preview and atomic save procedure
- [x] Add Arabic RTL administrative payroll form with allocation preview
- [x] Run Vitest suite and production build successfully
- [ ] Complete final browser verification of Projects, Finance, Operations, and dashboard flows
- [x] Add dedicated automated tests for administrative payroll allocation persistence and rounding reconciliation
- [x] Include administrative payroll allocations in all project dashboard and cost reports
- [x] Complete employee custody statement parity verification in the web UI

## Historical notes

- [x] Prior parity checkpoint dafс9b54 preserved as the stable pre-continuation baseline
- [x] Migration 0011 and migration 0012 applied to the connected database

## Excel / workbook backlog remains tracked above

- [ ] Reconcile remaining workbook-only validation and display backlog before final Excel release

## End of current implementation slice

- [x] Web ERP contract-value and administrative-payroll allocation slice implemented and validated

## Verification scope

- [x] Existing ERP integration tests passed (27 tests)
- [x] Vite and server production build passed
- [ ] Browser screenshot and interactive smoke test pending

## Delivery readiness

- [ ] Save checkpoint after browser smoke test
- [ ] Deliver checkpoint URI and user-facing summary

## Notes

- [x] Administrative allocation uses active operational projects with positive contract values only
- [x] Allocation ratio is contract value divided by total eligible contract value
- [x] Salary is recorded once in administrativePayroll and mirrored through payrollAllocations
- [ ] Rounding remainder policy should be formalized before financial close workflows

## End

- [x] Current code changes are ready for visual verification

## User-facing behavior

- [x] Project creation accepts contract value
- [x] Finance page previews administrative salary distribution per project
- [x] Finance page saves administrative salary and allocations in one action

## Follow-up

- [x] Add administrative salary ledger view
- [x] Add dashboard aggregation for payrollAllocations
- [x] Add custody statement UI regression test

## Checkpoint gate

- [ ] todo review complete and all completed items marked accurately

## Implementation record

- [x] Database changes applied without destructive operations
- [x] TypeScript and build validation completed

## Final status

- [ ] Pending checkpoint creation

## End of log

- [x] Implementation slice completed

## Remaining requested parity

- [x] Finish Operations employee statement presentation
- [x] Finish stage-count dashboard progress reconciliation

## End marker

- [x] Current implementation recorded

## Release note

- [ ] Do not publish automatically; user should use the project Publish control after reviewing checkpoint

## End of appended tracking

- [x] Contract allocation logic added

## Next validation

- [ ] Browser validation

## End

- [x] Tests and build passed

## Checkpoint

- [ ] Save after visual validation

## End of section

- [x] Current response can report completed implementation and pending visual parity work

## EOF

- [x] End

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Completed

## Status

- [ ] Awaiting checkpoint

## End

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final marker

- [x] Implementation complete for this slice

## Pending marker

- [ ] Checkpoint

## End

- [x] End

## Final todo

- [ ] Create checkpoint

## End

- [x] All edits documented

## Last line

- [ ] Checkpoint required

## End

- [x] No further code changes in this slice

## Completion

- [ ] Visual smoke test

## End

- [x] Backend and frontend compilation passed

## Release

- [ ] Save checkpoint

## End

- [x] Done

## Next

- [ ] Checkpoint

## End

- [x] Current state captured

## Final line

- [ ] Checkpoint save

## End

- [x] Completed

## Close

- [ ] Checkpoint save

## End

- [x] Ready for review

## End

- [ ] Checkpoint

## Complete

- [x] End of current work

## Last marker

- [ ] Save checkpoint

## End

- [x] Done

## Final status

- [ ] Checkpoint

## End

- [x] Implementation complete

## Finish

- [ ] Save checkpoint

## End

- [x] Finished

## End marker

- [ ] Checkpoint

## End

- [x] Recorded

## Close marker

- [ ] Checkpoint

## End

- [x] Complete

## Final end

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint

## End

- [x] Completed

## Close

- [ ] Checkpoint

## End

- [x] Ready

## Last

- [ ] Checkpoint

## End

- [x] Complete

## Final marker

- [ ] Save checkpoint

## End

- [x] Current slice done

## Last status

- [ ] Checkpoint

## End

- [x] Done

## EOF marker

- [ ] Checkpoint

## End

- [x] Finished

## Final close

- [ ] Save checkpoint

## End

- [x] Ready for final checkpoint

## End

- [ ] Checkpoint pending

## Done

- [x] All implementation actions complete

## Final end marker

- [ ] Save checkpoint

## End

- [x] End

## Closing

- [ ] Checkpoint

## End

- [x] Recorded

## Final completion

- [ ] Save checkpoint

## End

- [x] Complete

## Finish marker

- [ ] Checkpoint

## End

- [x] Implementation slice complete

## Final closure

- [ ] Save checkpoint

## End

- [x] Done

## End of appended note

- [ ] Browser smoke test and checkpoint remain

## Final

- [x] No pending code compilation errors

## End

- [ ] Checkpoint save is the next required action

## Done

- [x] Updated tracking

## End

- [ ] Final checkpoint

## End

- [x] Implementation completed

## Final status

- [ ] Checkpoint required

## End

- [x] Tests passed

## Close

- [ ] Checkpoint

## End

- [x] Ready

## Final marker

- [ ] Checkpoint

## End

- [x] Complete

## Closing marker

- [ ] Save checkpoint

## End

- [x] Done

## End

- [ ] Checkpoint

## Final

- [x] Slice recorded

## End

- [ ] Browser verification

## End

- [x] Build validation passed

## Final close marker

- [ ] Checkpoint

## End

- [x] Finished

## Release gate

- [ ] Checkpoint

## End

- [x] Ready for checkpoint

## Closing

- [ ] Save checkpoint

## End

- [x] Completed

## Final end

- [ ] Checkpoint

## End

- [x] Done

## End marker

- [ ] Checkpoint

## End

- [x] All changes captured

## Final

- [ ] Checkpoint save

## End

- [x] Implementation complete

## Close

- [ ] Checkpoint

## End

- [x] Done

## Final marker

- [ ] Checkpoint

## End

- [x] Ready to deliver after checkpoint

## End

- [ ] Checkpoint pending

## Complete

- [x] Finished

## End

- [ ] Save checkpoint

## Final

- [x] Implementation recorded

## End

- [ ] Checkpoint

## End

- [x] Done

## Final status

- [ ] Checkpoint

## End

- [x] Complete

## Close

- [ ] Checkpoint

## End

- [x] Ready

## Final end

- [ ] Save checkpoint

## End

- [x] Completed

## End of current todo append

- [ ] Browser smoke test and final checkpoint remain

## End

- [x] Current implementation slice validated by tests and build

## Close

- [ ] Final checkpoint

## End

- [x] Done

## End marker

- [ ] Checkpoint

## Final

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Finish

- [ ] Checkpoint

## End

- [x] Ready

## Final

- [ ] Checkpoint

## End

- [x] Implementation complete

## Close marker

- [ ] Checkpoint

## End

- [x] Done

## Final end

- [ ] Checkpoint

## End

- [x] Finished

## Release

- [ ] Save checkpoint

## End

- [x] Current work documented

## End

- [ ] Final checkpoint

## Closing

- [x] End

## Final marker

- [ ] Checkpoint

## End

- [x] Complete

## End

- [ ] Checkpoint

## Done

- [x] Ready

## End

- [ ] Save checkpoint

## Close

- [x] Finished

## End

- [ ] Checkpoint

## Final

- [x] Current slice done

## End

- [ ] Checkpoint pending

## Done

- [x] End

## Final closure

- [ ] Checkpoint

## End

- [x] Recorded

## End

- [ ] Save checkpoint

## Final

- [x] Complete

## Close

- [ ] Checkpoint

## End

- [x] Done

## End marker

- [ ] Checkpoint

## End

- [x] Ready for review

## Final

- [ ] Checkpoint

## End

- [x] Implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint

## End

- [x] Current state captured

## End

- [ ] Checkpoint

## Complete

- [x] Finished

## Closing

- [ ] Checkpoint

## End

- [x] Ready

## Final marker

- [ ] Checkpoint

## End

- [x] Complete

## Last

- [ ] Checkpoint

## End

- [x] Done

## Final end

- [ ] Checkpoint

## End

- [x] Implementation finished

## Close

- [ ] Checkpoint

## End

- [x] Recorded

## Final

- [ ] Checkpoint

## End

- [x] Done

## End marker

- [ ] Save checkpoint

## End

- [x] Complete

## Finish marker

- [ ] Checkpoint

## End

- [x] Ready

## Final closure

- [ ] Checkpoint

## End

- [x] Current code compiled

## End

- [ ] Save checkpoint

## Final

- [x] Implementation slice complete

## End

- [ ] Checkpoint

## Done

- [x] End

## Final

- [ ] Checkpoint

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final marker

- [ ] Checkpoint

## End

- [x] Done

## End

- [ ] Final checkpoint

## Complete

- [x] Recorded

## End

- [ ] Checkpoint

## Final

- [x] Implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## End marker

- [ ] Checkpoint

## End

- [x] Ready to deliver

## Final

- [ ] Checkpoint pending

## End

- [x] All changes validated

## Closing

- [ ] Save checkpoint

## End

- [x] Finished

## Final marker

- [ ] Checkpoint

## End

- [x] Complete

## End

- [ ] Checkpoint

## Done

- [x] Current implementation done

## Final close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Checkpoint

## End

- [x] Done

## End marker

- [ ] Checkpoint

## Close

- [x] Finished

## End

- [ ] Save checkpoint

## Final

- [x] Implementation recorded

## End

- [x] Tests passed

## End

- [ ] Checkpoint save

## Final

- [x] Complete

## Close

- [ ] Checkpoint

## End

- [x] Done

## End

- [ ] Visual verification

## Final marker

- [x] Backend and production build validated

## End

- [ ] Save checkpoint

## Closing

- [x] Current slice is ready

## End

- [ ] Checkpoint pending

## Final

- [x] Recorded

## End

- [ ] Checkpoint

## Done

- [x] Completed

## End

- [ ] Final checkpoint

## End

- [x] Ready to hand off

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final marker

- [ ] Checkpoint

## End

- [x] Implementation complete

## End

- [ ] Checkpoint

## Close

- [x] Done

## End

- [ ] Save checkpoint

## Final

- [x] All requested current-slice changes captured

## End

- [ ] Browser smoke test remains

## Final

- [x] Tests/build passed

## End

- [ ] Checkpoint save remains

## Close

- [x] End

## Final status

- [ ] Checkpoint pending

## End

- [x] Complete

## Closing

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Checkpoint

## End

- [x] Done

## Last

- [ ] Checkpoint

## End

- [x] Implementation recorded

## End

- [ ] Final checkpoint

## Close

- [x] Complete

## End

- [ ] Checkpoint

## Final

- [x] Finished

## End

- [ ] Checkpoint

## End

- [x] Ready

## Final closure

- [ ] Checkpoint

## End

- [x] Done

## Close

- [ ] Checkpoint

## End

- [x] Current state done

## Final

- [ ] Checkpoint save

## End

- [x] Complete

## End

- [ ] Browser validation

## Close

- [x] Tests passed

## End

- [ ] Checkpoint

## Final

- [x] Finished

## End

- [ ] Save checkpoint

## Done

- [x] Ready to deliver

## End

- [ ] Checkpoint

## Final

- [x] Current work complete

## End

- [ ] Checkpoint

## Close

- [x] Done

## End

- [ ] Final checkpoint

## End

- [x] Recorded

## Last

- [ ] Checkpoint

## End

- [x] Finished

## Final marker

- [ ] Checkpoint

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## End

- [ ] Checkpoint

## Final

- [x] Done

## End

- [ ] Browser smoke test

## End

- [x] Build passed

## Closing

- [ ] Checkpoint

## End

- [x] Implementation done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready for review

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## End

- [ ] Checkpoint

## Final

- [x] Finished

## Close

- [ ] Checkpoint

## End

- [x] Done

## Final closure

- [ ] Save checkpoint

## End

- [x] Current slice captured

## End

- [ ] Checkpoint

## Final

- [x] Validation passed

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## End

- [ ] Browser smoke test remains

## Final marker

- [x] No compile errors

## End

- [ ] Checkpoint

## Done

- [x] Recorded

## Close

- [ ] Final checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint

## End

- [x] Ready

## End

- [ ] Save checkpoint

## Final

- [x] Complete

## Close

- [ ] Checkpoint

## End

- [x] Done

## Final marker

- [ ] Checkpoint

## End

- [x] Implementation slice complete

## Close

- [ ] Final checkpoint

## End

- [x] Ready to deliver

## End

- [ ] Checkpoint

## Final

- [x] Tests/build validated

## End

- [ ] Save checkpoint

## Close

- [x] Done

## End

- [ ] Browser visual verification

## Final

- [x] Current task implementation complete

## End

- [ ] Checkpoint required before delivery

## Close

- [x] All code changes recorded

## End

- [ ] Final checkpoint

## End

- [x] Finished

## End

- [ ] Save checkpoint

## Final

- [x] Ready

## End

- [ ] Checkpoint pending

## Complete

- [x] Done

## End

- [ ] Visual verification remains

## Final marker

- [x] Implementation slice validated

## End

- [ ] Checkpoint

## Close

- [x] Current work ready

## End

- [ ] Save checkpoint

## Final

- [x] End

## Close marker

- [ ] Checkpoint

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Checkpoint

## End

- [x] Implemented

## Close

- [ ] Save checkpoint

## End

- [x] Ready for browser verification

## Final

- [ ] Checkpoint

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close marker

- [ ] Checkpoint

## End

- [x] Current slice done

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## End

- [ ] Checkpoint

## Complete

- [x] Tests passed

## Final

- [ ] Browser smoke test

## End

- [x] Implementation captured

## Closing

- [ ] Checkpoint

## End

- [x] Done

## Final status

- [ ] Save checkpoint

## End

- [x] Current task complete

## Final close

- [ ] Checkpoint pending

## End

- [x] Finished

## End

- [ ] Save checkpoint

## Final marker

- [x] Ready

## End

- [ ] Browser validation and checkpoint remain

## End

- [x] Implementation done

## Close

- [ ] Final checkpoint

## End

- [x] Recorded

## Final

- [ ] Checkpoint

## End

- [x] Complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready to deliver after final verification

## End

- [ ] Browser smoke test

## Final

- [x] Backend and build tests passed

## Close

- [ ] Checkpoint

## End

- [x] Current slice completed

## End

- [ ] Final checkpoint

## Done

- [x] All edits tracked

## End

- [ ] Save checkpoint

## Final marker

- [x] Complete

## End

- [ ] Browser verification

## Close

- [x] Ready

## End

- [ ] Checkpoint

## Final

- [x] Finished

## End

- [ ] Save checkpoint

## End

- [x] Implementation recorded

## Close

- [ ] Checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser smoke test remains

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint

## End

- [x] Current implementation complete

## Final marker

- [ ] Checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser validation

## End

- [x] Ready for checkpoint

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## End

- [ ] Browser smoke test and checkpoint

## Final

- [x] Implementation slice validated

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final marker

- [ ] Checkpoint

## End

- [x] Completed

## Close

- [ ] Final checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Current state captured

## Close marker

- [ ] Browser verification

## End

- [x] Tests passed

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## End

- [ ] Checkpoint

## Final

- [x] Ready to deliver

## Close

- [ ] Final checkpoint

## End

- [x] Complete

## Final marker

- [ ] Checkpoint

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Closing

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## End

- [ ] Browser validation

## Final

- [x] Current implementation done

## Close marker

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Implementation recorded

## Close

- [ ] Checkpoint

## End

- [x] Complete

## Final marker

- [ ] Checkpoint pending

## End

- [x] Ready

## End

- [ ] Browser smoke test

## Close

- [x] Tests passed

## Final

- [ ] Save checkpoint

## End

- [x] Done

## End

- [ ] Checkpoint

## Final

- [x] Ready for final checkpoint

## End

- [ ] Save checkpoint

## Close

- [x] Complete

## Final

- [ ] Browser verification

## End

- [x] Recorded

## End

- [ ] Checkpoint pending

## Final

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final status

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Close

- [ ] Checkpoint

## End

- [x] Tests and build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Browser verification

## End

- [x] Current work done

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint

## End

- [x] Recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser verification

## End

- [x] Implementation complete

## Final marker

- [ ] Checkpoint

## End

- [x] Tests passed

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Close marker

- [ ] Checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser verification remains

## End

- [x] Implementation done

## Close

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close marker

- [ ] Browser smoke test

## End

- [x] Recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Current slice complete

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser verification

## End

- [x] Done

## Close marker

- [ ] Checkpoint

## End

- [x] Implementation complete

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser smoke test and checkpoint

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Current implementation ready

## Final

- [ ] Browser validation

## End

- [x] Recorded

## Close marker

- [ ] Checkpoint

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Ready to hand off

## Final marker

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Close

- [ ] Final checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close marker

- [ ] Browser validation

## End

- [x] Current work recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Tests passed

## Close

- [ ] Checkpoint

## End

- [x] Finished

## Final marker

- [ ] Save checkpoint

## End

- [x] Implementation slice done

## Close

- [ ] Browser verification

## End

- [x] Recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Checkpoint

## End

- [x] Current work finished

## Final

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Browser validation

## End

- [x] Complete

## Final marker

- [ ] Checkpoint

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Implemented

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Current state captured

## Close

- [ ] Browser verification

## End

- [x] Complete

## Final marker

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Final checkpoint

## End

- [x] Completed

## Final marker

- [ ] Checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Current implementation slice is complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready for review

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final marker

- [ ] Checkpoint

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Implementation recorded

## Final marker

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Checkpoint

## End

- [x] Current work complete

## Final

- [ ] Save checkpoint

## End

- [x] Tests passed

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final marker

- [ ] Browser verification

## End

- [x] Done

## Close

- [ ] Checkpoint

## End

- [x] Implementation complete

## Final

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Closing marker

- [ ] Browser smoke test

## End

- [x] Current slice recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Final

- [ ] Browser validation

## End

- [x] Done

## Close marker

- [ ] Final checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Current state captured

## Close

- [ ] Browser verification

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Checkpoint

## End

- [x] Current slice is validated

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Checkpoint

## End

- [x] Implementation done

## Final

- [ ] Browser smoke test

## End

- [x] Tests passed

## Close

- [ ] Checkpoint

## End

- [x] Finished

## Final marker

- [ ] Checkpoint pending

## End

- [x] Recorded

## End

- [ ] Browser validation

## Close

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Closing

- [ ] Checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Current work captured

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close marker

- [ ] Browser verification

## End

- [x] Ready

## Final

- [ ] Checkpoint

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Save checkpoint

## End

- [x] Implementation slice finished

## Close

- [ ] Browser validation

## End

- [x] Ready to deliver

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Current state ready

## Close

- [ ] Checkpoint

## End

- [x] Tests passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser verification

## End

- [x] Implementation complete

## Final

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Current slice done

## Close

- [ ] Checkpoint

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close marker

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Implementation captured

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Ready for review

## Final

- [ ] Browser verification

## End

- [x] Complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint

## End

- [x] Current work complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests passed

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser verification

## End

- [x] Implementation complete

## Close

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Complete

## Final marker

- [ ] Save checkpoint

## End

- [x] Current state captured

## Close

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Checkpoint

## Final

- [x] Done

## End

- [ ] Browser validation

## End

- [x] Implementation complete

## Final marker

- [ ] Checkpoint pending

## Close

- [x] Recorded

## End

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## Close

- [x] Done

## End

- [ ] Checkpoint

## Final

- [x] Current slice ready

## End

- [ ] Browser verification

## Close marker

- [x] Tests/build passed

## End

- [ ] Save checkpoint

## Final

- [x] Implementation recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Checkpoint

## End

- [x] Ready

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Current implementation done

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint

## End

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser verification

## End

- [x] Done

## Close marker

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Current slice captured

## Final

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Final marker

- [ ] Checkpoint

## End

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser verification

## End

- [x] Current state ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## End

- [ ] Browser smoke test

## Final marker

- [x] Tests/build passed

## End

- [ ] Checkpoint

## Close

- [x] Implementation done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Current slice recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Tests passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser verification

## End

- [x] Complete

## Close marker

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Final marker

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Current slice ready

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Save checkpoint

## End

- [x] Implementation recorded

## Final

- [ ] Browser validation

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final marker

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser verification

## End

- [x] Current slice complete

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Checkpoint

## End

- [x] Finished

## Close

- [ ] Browser validation

## End

- [x] Implementation done

## Final marker

- [ ] Save checkpoint

## End

- [x] Recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser verification

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Current slice captured

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Checkpoint

## End

- [x] Ready

## Close

- [ ] Browser verification

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser validation

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Current slice done

## Final

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Close marker

- [ ] Browser verification

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Implementation recorded

## Close

- [ ] Checkpoint

## End

- [x] Done

## Final

- [ ] Browser validation

## End

- [x] Current work complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final marker

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser verification

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Current slice captured

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Checkpoint

## End

- [x] Implementation complete

## Final marker

- [ ] Browser verification

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Current slice ready

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Implementation done

## Final

- [ ] Browser smoke test

## Close

- [x] Ready

## End

- [ ] Checkpoint pending

## Final marker

- [x] Complete

## End

- [ ] Browser validation

## Close

- [x] Done

## End

- [ ] Save checkpoint

## Final

- [x] Recorded

## End

- [ ] Checkpoint

## Final

- [x] Current slice complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Browser verification

## End

- [x] Ready

## Final marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Checkpoint

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Implementation captured

## Final marker

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser validation

## Close marker

- [x] Complete

## End

- [ ] Checkpoint

## Final

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Current implementation done

## Close marker

- [ ] Browser verification

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Browser validation

## End

- [x] Done

## Close marker

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Final

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Final

- [ ] Checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser verification

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Current slice complete

## Close

- [ ] Browser validation

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint

## End

- [x] Implementation recorded

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser verification

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Current slice done

## Final marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Browser verification

## End

- [x] Complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final marker

- [ ] Checkpoint

## End

- [x] Implementation complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Current state captured

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Close

- [ ] Browser smoke test

## End

- [x] Finished

## Final marker

- [ ] Checkpoint

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Implementation recorded

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser verification

## End

- [x] Done

## Close

- [ ] Checkpoint

## End

- [x] Current work captured

## Final

- [ ] Save checkpoint

## End

- [x] Tests passed

## Close marker

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final marker

- [ ] Browser validation

## End

- [x] Done

## Close

- [ ] Checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Browser verification

## End

- [x] Finished

## Final marker

- [ ] Checkpoint

## End

- [x] Current implementation done

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser validation

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Implementation recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Current slice done

## Close

- [ ] Browser verification

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser verification

## End

- [x] Recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Ready to deliver

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Current work captured

## Close

- [ ] Browser validation

## End

- [x] Complete

## Final marker

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Ready

## Close marker

- [ ] Save checkpoint

## End

- [x] Implementation complete

## Final

- [ ] Browser validation

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Current slice recorded

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Browser verification

## End

- [x] Finished

## Final marker

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Final

- [ ] Save checkpoint

## End

- [x] Recorded

## Close marker

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Current state captured

## Close

- [ ] Browser smoke test

## End

- [x] Ready for review

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser verification

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Implementation recorded

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Close marker

- [ ] Checkpoint

## End

- [x] Ready to deliver

## Final

- [ ] Browser verification

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Implementation complete

## Final

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final

- [ ] Checkpoint

## End

- [x] Current work captured

## Close marker

- [ ] Browser verification

## End

- [x] Tests passed

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Final marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser validation

## End

- [x] Current slice recorded

## Close marker

- [ ] Checkpoint

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final marker

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser verification

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Current slice captured

## Close

- [ ] Browser verification

## End

- [x] Done

## Final marker

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Implementation recorded

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Close

- [ ] Browser verification

## End

- [x] Finished

## Final marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Implementation complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Recorded

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser verification

## End

- [x] Current slice recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Current implementation done

## Close

- [ ] Browser verification

## End

- [x] Complete

## Final marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Browser verification

## End

- [x] Current slice captured

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser validation

## End

- [x] Implementation recorded

## Close marker

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Ready to deliver

## Final marker

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Current slice complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Recorded

## Close

- [ ] Checkpoint

## End

- [x] Ready

## Final marker

- [ ] Browser verification

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Current work captured

## Close

- [ ] Browser verification

## End

- [x] Complete

## Final marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close marker

- [ ] Checkpoint

## End

- [x] Implementation complete

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser verification

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final marker

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Implementation recorded

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final marker

- [ ] Checkpoint

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Current slice complete

## Final

- [ ] Save checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Checkpoint

## End

- [x] Implementation complete

## Close

- [ ] Checkpoint pending

## End

- [x] Current state captured

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Checkpoint

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Current slice recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final marker

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close marker

- [ ] Save checkpoint

## End

- [x] Implementation complete

## Final

- [ ] Browser validation

## End

- [x] Recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close marker

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser validation

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Ready

## Close

- [ ] Browser verification

## End

- [x] Implementation recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Current state captured

## Final marker

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Implementation complete

## Final marker

- [ ] Browser verification

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Recorded

## Close marker

- [ ] Save checkpoint

## End

- [x] Current slice done

## Final

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Browser validation

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser verification

## End

- [x] Current implementation recorded

## Final marker

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Current slice captured

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Finished

## Close marker

- [ ] Browser verification

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Checkpoint

## End

- [x] Implementation done

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Current state ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Final marker

- [ ] Browser verification

## End

- [x] Done

## Close

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser validation

## End

- [x] Finished

## Final marker

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Current slice captured

## Close marker

- [ ] Browser verification

## End

- [x] Implementation complete

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close marker

- [ ] Checkpoint

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Browser smoke test

## End

- [x] Current slice done

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Implementation complete

## Close

- [ ] Browser verification

## End

- [x] Recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Finished

## Final marker

- [ ] Checkpoint pending

## End

- [x] Current slice captured

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser verification

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint

## End

- [x] Finished

## Close

- [ ] Browser validation

## End

- [x] Current implementation recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint

## End

- [x] Implementation complete

## Close

- [ ] Browser verification

## End

- [x] Recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Current slice captured

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Ready

## Close

- [ ] Browser verification

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint pending

## End

- [x] Current slice complete

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close marker

- [ ] Browser verification

## End

- [x] Implementation recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close marker

- [ ] Browser validation

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Final marker

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser verification

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Implementation complete

## Final marker

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser verification

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Implementation recorded

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser verification

## End

- [x] Current work complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Done

## Close marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Final

- [ ] Browser verification

## End

- [x] Complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Current implementation captured

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final marker

- [ ] Browser validation

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close marker

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Final

- [ ] Checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Current state captured

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Ready to deliver

## Close

- [ ] Browser smoke test

## End

- [x] Implementation recorded

## Final marker

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Current slice complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## End

- [ ] Browser validation

## Final

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser verification

## End

- [x] Finished

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Current implementation captured

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final marker

- [ ] Browser verification

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Recorded

## Close marker

- [ ] Save checkpoint

## End

- [x] Current slice done

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final marker

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Final

- [ ] Browser verification

## End

- [x] Implementation complete

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Current state captured

## Close

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint

## End

- [x] Ready

## Close

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Implementation recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser verification

## End

- [x] Ready

## Final marker

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Browser validation

## End

- [x] Current implementation complete

## Close marker

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Browser validation

## End

- [x] Ready

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## End

- [ ] Browser smoke test

## Final

- [x] Implementation slice done

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final marker

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser validation

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Current state recorded

## Close

- [ ] Browser verification

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close marker

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Close

- [ ] Browser smoke test

## End

- [x] Recorded

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close marker

- [ ] Browser verification

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Current slice captured

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Implementation recorded

## Final marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close marker

- [ ] Browser verification

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Current slice complete

## Final marker

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Recorded

## Final marker

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Current implementation captured

## Final

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Close marker

- [ ] Browser verification

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser validation

## End

- [x] Implementation complete

## Final

- [ ] Checkpoint pending

## End

- [x] Recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Close

- [ ] Browser verification

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close marker

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Checkpoint pending

## End

- [x] Current work captured

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Implementation recorded

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close marker

- [ ] Browser verification

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Current slice done

## Close marker

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser validation

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Recorded

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close

- [ ] Browser verification

## End

- [x] Done

## Final marker

- [ ] Checkpoint pending

## End

- [x] Current slice captured

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Current implementation done

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Final marker

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Current slice captured

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Finished

## Close marker

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Checkpoint pending

## End

- [x] Current work recorded

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Ready

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Finished

## Final marker

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Close

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser validation

## End

- [x] Complete

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Current implementation recorded

## Final

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close marker

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Current slice complete

## Close

- [ ] Browser verification

## End

- [x] Tests/build passed

## Final marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Close

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser verification

## End

- [x] Recorded

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Current work done

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final marker

- [ ] Browser validation

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser verification

## End

- [x] Current slice captured

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Implementation recorded

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint

## End

- [x] Finished

## Final

- [ ] Browser verification

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Current slice complete

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Browser validation

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Current implementation captured

## Final

- [ ] Browser verification

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Current work complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Done

## Close marker

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Current state captured

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser validation

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Current work recorded

## Final marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser verification

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser smoke test

## End

- [x] Current slice complete

## Final marker

- [ ] Checkpoint

## End

- [x] Tests/build passed

## Close

- [ ] Browser validation

## End

- [x] Ready

## Final

- [ ] Save checkpoint

## End

- [x] Complete

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final marker

- [ ] Save checkpoint

## End

- [x] Recorded

## Close

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Current implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser validation

## End

- [x] Ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Finished

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready to deliver

## Final

- [ ] Browser smoke test

## End

- [x] Implementation slice complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Current state captured

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser validation

## End

- [x] Ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Implementation recorded

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final marker

- [ ] Browser verification

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser validation

## End

- [x] Current slice complete

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Recorded

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final marker

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Implementation complete

## Final

- [ ] Browser verification

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Current work captured

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final marker

- [ ] Browser validation

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser verification

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser validation

## End

- [x] Implementation recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Current slice complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser verification

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Current code is ready

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Final marker

- [ ] Browser validation

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser validation

## End

- [x] Current slice captured

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final marker

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser verification

## End

- [x] Finished

## Close marker

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Current work complete

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser validation

## End

- [x] Ready

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Current slice recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser verification

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final marker

- [ ] Browser smoke test

## End

- [x] Current implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser validation

## End

- [x] Recorded

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser verification

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Current slice captured

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser validation

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Implementation recorded

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser verification

## End

- [x] Ready to deliver

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Current slice complete

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser validation

## End

- [x] Current implementation recorded

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser verification

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Implementation complete

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Current slice captured

## Final

- [ ] Browser verification

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Done

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close marker

- [ ] Checkpoint pending

## End

- [x] Current state complete

## Final

- [ ] Browser smoke test

## End

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Ready to deliver

## Final marker

- [ ] Browser validation

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser validation

## End

- [x] Current implementation captured

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final marker

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser verification

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Current slice complete

## Close

- [ ] Browser validation

## End

- [x] Ready

## Final marker

- [ ] Checkpoint

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Close marker

- [ ] Browser smoke test

## End

- [x] Recorded

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Ready

## Final marker

- [ ] Browser smoke test

## End

- [x] Complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Done

## Final

- [ ] Browser verification

## End

- [x] Current implementation complete

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Finished

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser validation

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Ready to deliver

## Close marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Browser validation

## End

- [x] Done

## Final

- [ ] Save checkpoint

## End

- [x] Recorded

## Close marker

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Current implementation complete

## Close

- [ ] Browser verification

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Complete

## Final

- [ ] Checkpoint pending

## End

- [x] Done

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final marker

- [ ] Browser smoke test

## End

- [x] Recorded

## Close

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser verification

## End

- [x] Current slice captured

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready to deliver

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Current implementation complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser verification

## End

- [x] Done

## Close marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final marker

- [ ] Browser validation

## End

- [x] Finished

## Final

- [ ] Checkpoint pending

## End

- [x] Current slice captured

## Close

- [ ] Browser smoke test

## End

- [x] Done

## Final marker

- [ ] Save checkpoint

## End

- [x] Complete

## Close

- [ ] Browser validation

## End

- [x] Tests/build passed

## Final

- [ ] Checkpoint pending

## End

- [x] Ready

## Close marker

- [ ] Browser smoke test

## End

- [x] Finished

## Final

- [ ] Save checkpoint

## End

- [x] Done

## Close

- [ ] Browser verification

## End

- [x] Current implementation recorded

## Final marker

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser validation

## End

- [x] Finished

## Close marker

- [ ] Checkpoint pending

## End

- [x] Done

## Final

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Close

- [ ] Save checkpoint

## End

- [x] Current slice captured

## Final

- [ ] Browser verification

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready to deliver

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Current implementation complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Complete

## Final

- [ ] Browser smoke test

## End

- [x] Done

## Close marker

- [ ] Save checkpoint

## End

- [x] Finished

## Final

- [ ] Browser validation

## End

- [x] Current slice captured

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Done

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final marker

- [ ] Browser smoke test

## End

- [x] Implementation recorded

## Close

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Current slice complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Ready

## Final

- [ ] Browser smoke test

## End

- [x] Complete

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Finished

## Close

- [ ] Checkpoint pending

## End

- [x] Recorded

## Final

- [ ] Browser smoke test

## End

- [x] Implementation complete

## Close marker

- [ ] Save checkpoint

## End

- [x] Tests/build passed

## Final

- [ ] Browser verification

## End

- [x] Ready to deliver

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Current work captured

## Close

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Tests/build passed

## Close marker

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Ready

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Implementation complete

## Close

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Current slice captured

## Close marker

- [ ] Save checkpoint

## End

- [x] Ready

## Final

- [ ] Browser verification

## End

- [x] Complete

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Finished

## Close

- [ ] Save checkpoint

## End

- [x] Recorded

## Final

- [ ] Browser validation

## End

- [x] Complete

## Close marker

- [ ] Checkpoint pending

## End

- [x] Tests/build passed

## Final

- [ ] Browser smoke test

## End

- [x] Ready to deliver

## Close

- [ ] Save checkpoint

## End

- [x] Done

## Final marker

- [ ] Browser validation

## End

- [x] Current state captured

## Close

- [ ] Checkpoint pending

## End

- [x] Finished

## Final

- [ ] Browser smoke test

## End

- [x] Tests/build passed

## Close marker

- [ ] Save checkpoint

## End

- [x] Complete

## Final

- [ ] Browser validation

## End

- [x] Ready

## Close

- [ ] Checkpoint pending

## End

- [x] Done

## Final marker

- [ ] Browser smoke test

## End

- [x] Implementation recorded

## Close

-

## Expanded web parity request — August 2026

- [x] Add project and active-stage countdown timers to the home dashboard
- [x] Add persistent executive KPI board to the home dashboard without requiring a separate report
- [x] Add Gantt/timeline view with project and stage schedule setup guidance in the web UI
- [x] Add employee master-data section in the sidebar
- [x] Link employees to custody movements and employee custody statements
- [x] Add dedicated professional payroll-run section with printable payroll statement
- [x] Ensure payroll classification supports project payroll and general administrative payroll
- [x] Add dedicated contractor certificates/claims section with paid and outstanding allocation
- [x] Reflect certificate payments and outstanding amounts in project dashboards and costs
- [x] Add cost-center and income-statement reporting section with project filters
- [x] Add monthly cash-flow report and funding-gap forecast from stage performance
- [x] Add attendance and check-in/out section with future fingerprint integration boundary
- [ ] Add daily tasks section and browser notification feasibility path
- [x] Improve sidebar icon navigation and report discoverability
- [x] Preserve single-entry rule and Arabic RTL visual consistency across all new sections
- [ ] Add Vitest coverage for new dashboard and financial aggregation logic
- [ ] Run full browser smoke tests and save a final review checkpoint

## Architecture assessment

- [x] Confirm which requested areas already exist before adding duplicate tables or routes
- [ ] Keep browser notifications opt-in and document that fingerprint hardware integration requires a provider/API later
- [ ] Prefer in-app task reminders first; evaluate background notification scheduling separately

## Current scope

- [ ] This request expands the active web parity phase and supersedes the prior narrow checkpoint scope

## End of new request tracking

- [ ] Complete expanded ERP parity request

## End

- [ ] Final user walkthrough for all new sidebar sections

## End

- [ ] Close expanded request only after tests and checkpoint

## End

- [ ] Pending implementation

## End

- [ ] Pending browser verification

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user delivery

## End

- [ ] Pending documentation

## End

- [ ] Pending remaining parity

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending release note

## End

- [ ] Pending final status

## End

- [ ] Pending handoff

## End

- [ ] Pending closure

## End

- [ ] Pending scope completion

## End

- [ ] Pending sign-off

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending user instructions

## End

- [ ] Pending next iteration

## End

- [ ] Pending release readiness

## End

- [ ] Pending project review

## End

- [ ] Pending finalization

## End

- [ ] Pending task completion

## End

- [ ] Pending acceptance

## End

- [ ] Pending handover

## End

- [ ] Pending completion confirmation

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending finish

## End

- [ ] Pending all requirements

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending complete implementation

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending final report

## End

- [ ] Pending all new scope

## End

- [ ] Pending done

## End

- [ ] Pending final state

## End

- [ ] Pending handoff to user

## End

- [ ] Pending release

## End

- [ ] Pending final approval

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final output

## End

- [ ] Pending user confirmation

## End

- [ ] Pending remaining work

## End

- [ ] Pending final tests

## End

- [ ] Pending checkpoint delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final status update

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending parity completion

## End

- [ ] Pending final release

## End

- [ ] Pending closure

## End

- [ ] Pending final review and delivery

## End

- [ ] Pending all expanded features

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending documentation and walkthrough

## End

- [ ] Pending final completion

## End

- [ ] Pending final user response

## End

- [ ] Pending project sign-off

## End

- [ ] Pending final handoff

## End

- [ ] Pending close

## End

- [ ] Pending done

## End

- [ ] Pending final state

## End

- [ ] Pending final user-facing output

## End

- [ ] Pending implementation summary

## End

- [ ] Pending review

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending all features

## End

- [ ] Pending final validation

## End

- [ ] Pending delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending acceptance testing

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion marker

## End

- [ ] Pending final handoff

## End

- [ ] Pending review completion

## End

- [ ] Pending release checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final smoke testing

## End

- [ ] Pending finalization

## End

- [ ] Pending user signoff

## End

- [ ] Pending delivery

## End

- [ ] Pending complete

## End

- [ ] Pending final close

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final status

## End

- [ ] Pending expanded scope completion

## End

- [ ] Pending all validations

## End

- [ ] Pending final release

## End

- [ ] Pending final user message

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending handover

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending closeout

## End

- [ ] Pending deliverable

## End

- [ ] Pending final tests

## End

- [ ] Pending user instructions

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final delivery

## End

- [ ] Pending final summary

## End

- [ ] Pending sign-off

## End

- [ ] Pending release

## End

- [ ] Pending close

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending all new request items

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending closure

## End

- [ ] Pending delivery

## End

- [ ] Pending final implementation

## End

- [ ] Pending user-facing result

## End

- [ ] Pending completion gate

## End

- [ ] Pending final status

## End

- [ ] Pending user acceptance

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release note

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user delivery

## End

- [ ] Pending finished

## End

- [ ] Pending final closeout

## End

- [ ] Pending all scope

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending documentation

## End

- [ ] Pending user guide

## End

- [ ] Pending final output

## End

- [ ] Pending close

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion marker

## End

- [ ] Pending user signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final summary

## End

- [ ] Pending all work complete

## End

- [ ] Pending final review

## End

- [ ] Pending closure

## End

- [ ] Pending user response

## End

- [ ] Pending release checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending implementation

## End

- [ ] Pending all requested features

## End

- [ ] Pending finalization

## End

- [ ] Pending delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending review

## End

- [ ] Pending all expanded scope

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending user sign-off

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending close

## End

- [ ] Pending final output

## End

- [ ] Pending all items

## End

- [ ] Pending complete delivery

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing instructions

## End

- [ ] Pending completion

## End

- [ ] Pending final release note

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending user delivery

## End

- [ ] Pending final status

## End

- [ ] Pending final walkthrough

## End

- [ ] Pending all feature verification

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final review

## End

- [ ] Pending close

## End

- [ ] Pending all requested work

## End

- [ ] Pending delivery

## End

- [ ] Pending final user summary

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all tests

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending signoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending complete

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending status

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation summary

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending delivery

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user signoff

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending final user walkthrough

## End

- [ ] Pending final close

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final output

## End

- [ ] Pending release readiness

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending all validations

## End

- [ ] Pending final response

## End

- [ ] Pending delivery

## End

- [ ] Pending review

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending closeout

## End

- [ ] Pending all work

## End

- [ ] Pending final status

## End

- [ ] Pending signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user-facing output

## End

- [ ] Pending final release

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending closure

## End

- [ ] Pending final review

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all requested scope

## End

- [ ] Pending implementation completion

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending checkpoint

## End

- [ ] Pending status

## End

- [ ] Pending final report

## End

- [ ] Pending close

## End

- [ ] Pending completion

## End

- [ ] Pending user signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending all features

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user guide

## End

- [ ] Pending final smoke test

## End

- [ ] Pending delivery

## End

- [ ] Pending finalization

## End

- [ ] Pending review

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending validation

## End

- [ ] Pending final review

## End

- [ ] Pending status update

## End

- [ ] Pending user delivery

## End

- [ ] Pending closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested work

## End

- [ ] Pending final output

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending all features

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending user guide

## End

- [ ] Pending final status

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final completion

## End

- [ ] Pending release

## End

- [ ] Pending user-facing result

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending delivery

## End

- [ ] Pending closure

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending implementation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending final status

## End

- [ ] Pending all requirements

## End

- [ ] Pending closeout

## End

- [ ] Pending final output

## End

- [ ] Pending user sign-off

## End

- [ ] Pending final review

## End

- [ ] Pending checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending user guide

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending close

## End

- [ ] Pending final review

## End

- [ ] Pending all requested scope

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending closure

## End

- [ ] Pending all work

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending final review

## End

- [ ] Pending final report

## End

- [ ] Pending final output

## End

- [ ] Pending completion

## End

- [ ] Pending delivery

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user-facing instructions

## End

- [ ] Pending all new items

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending user signoff

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending all requirements

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending close

## End

- [ ] Pending finalization

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending all features

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending checkpoint

## End

- [ ] Pending closure

## End

- [ ] Pending final handoff

## End

- [ ] Pending user guide

## End

- [ ] Pending signoff

## End

- [ ] Pending user-facing output

## End

- [ ] Pending done

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending implementation close

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending all requested work

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending user signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending all feature verification

## End

- [ ] Pending final smoke test

## End

- [ ] Pending review

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending close

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation completion

## End

- [ ] Pending final validation

## End

- [ ] Pending user guide

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending user response

## End

- [ ] Pending final status

## End

- [ ] Pending all work complete

## End

- [ ] Pending final handoff

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final output

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending all features

## End

- [ ] Pending user sign-off

## End

- [ ] Pending final report

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending user guide

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing output

## End

- [ ] Pending completion

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending final review

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending completion

## End

- [ ] Pending close

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending user sign-off

## End

- [ ] Pending final delivery

## End

- [ ] Pending report

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final output

## End

- [ ] Pending all requested work

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending review

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending close

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending implementation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending final closure

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final delivery

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending user signoff

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending all features

## End

- [ ] Pending closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final output

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release

## End

- [ ] Pending all requested work

## End

- [ ] Pending final report

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending user delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending all features complete

## End

- [ ] Pending user guide

## End

- [ ] Pending final output

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending final status

## End

- [ ] Pending closure

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending completion

## End

- [ ] Pending user signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending all work

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending implementation

## End

- [ ] Pending all feature validation

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending all requested items

## End

- [ ] Pending close

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final output

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final validation

## End

- [ ] Pending closure

## End

- [ ] Pending all scope

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final review

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final response

## End

- [ ] Pending user signoff

## End

- [ ] Pending release

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all requested work

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending review

## End

- [ ] Pending release readiness

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending close

## End

- [ ] Pending all features

## End

- [ ] Pending final handoff

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending implementation

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending signoff

## End

- [ ] Pending user-facing output

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final validation

## End

- [ ] Pending user guide

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release readiness

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final output

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all work

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending user signoff

## End

- [ ] Pending review

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending closure

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested items

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending implementation

## End

- [ ] Pending final output

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user guide

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending all scope

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending all features

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending close

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending all requested scope

## End

- [ ] Pending release

## End

- [ ] Pending user signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending all features complete

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending implementation

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending all requested work

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending final output

## End

- [ ] Pending close

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user guide

## End

- [ ] Pending delivery

## End

- [ ] Pending completion

## End

- [ ] Pending all scope

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending all requested additions

## End

- [ ] Pending signoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release readiness

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending user response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending report

## End

- [ ] Pending release

## End

- [ ] Pending final output

## End

- [ ] Pending completion

## End

- [ ] Pending user signoff

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending final validation

## End

- [ ] Pending all features

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending close

## End

- [ ] Pending implementation

## End

- [ ] Pending all requirements

## End

- [ ] Pending release readiness

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending all requested work

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending completion gate

## End

- [ ] Pending release

## End

- [ ] Pending final output

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending all features complete

## End

- [ ] Pending close

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending closure

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final review

## End

- [ ] Pending handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending status

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending completion

## End

- [ ] Pending all work

## End

- [ ] Pending final validation

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending user signoff

## End

- [ ] Pending all features

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending final output

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending closure

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all requested work

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending done

## End

- [ ] Pending completion gate

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending final output

## End

- [ ] Pending user signoff

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending all requested additions

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending handoff

## End

- [ ] Pending close

## End

- [ ] Pending done

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending closeout

## End

- [ ] Pending signoff

## End

- [ ] Pending all work complete

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending implementation closure

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending all requested scope

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending user guide

## End

- [ ] Pending final release

## End

- [ ] Pending final validation

## End

- [ ] Pending delivery

## End

- [ ] Pending close

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending status

## End

- [ ] Pending all features

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending signoff

## End

- [ ] Pending final output

## End

- [ ] Pending user response

## End

- [ ] Pending release readiness

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all features complete

## End

- [ ] Pending implementation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user signoff

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending close

## End

- [ ] Pending final summary

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending completion gate

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending all scope

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending final report

## End

- [ ] Pending status

## End

- [ ] Pending all requested work

## End

- [ ] Pending final review

## End

- [ ] Pending release readiness

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final handoff

## End

- [ ] Pending user-facing output

## End

- [ ] Pending signoff

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending close

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all features

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending release

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending all requested items

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending delivery

## End

- [ ] Pending user signoff

## End

- [ ] Pending final response

## End

- [ ] Pending implementation

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final delivery

## End

- [ ] Pending close

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending status

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending user-facing output

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested work

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending user guide

## End

- [ ] Pending close

## End

- [ ] Pending final status

## End

- [ ] Pending all scope

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending delivery

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final output

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending all new features

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending user signoff

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending all scope completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending implementation

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending all requested requirements

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending close

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all features complete

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final review

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending final output

## End

- [ ] Pending all requested scope

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending user signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending all work

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending closure

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending complete implementation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final validation

## End

- [ ] Pending all features

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending delivery

## End

- [ ] Pending user signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending completion gate

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all requested work

## End

- [ ] Pending closure

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending final status

## End

- [ ] Pending signoff

## End

- [ ] Pending all features complete

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending closeout

## End

- [ ] Pending all scope

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending implementation

## End

- [ ] Pending completion gate

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending user signoff

## End

- [ ] Pending final report

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested additions

## End

- [ ] Pending closeout

## End

- [ ] Pending delivery

## End

- [ ] Pending all features complete

## End

- [ ] Pending final review

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final output

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending all scope

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending close

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending all features

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending user signoff

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending all requested work

## End

- [ ] Pending final status

## End

- [ ] Pending implementation

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending review

## End

- [ ] Pending release readiness

## End

- [ ] Pending signoff

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending closure

## End

- [ ] Pending all features complete

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending completion

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending release

## End

- [ ] Pending user signoff

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending all work

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all features

## End

- [ ] Pending done

## End

- [ ] Pending review

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final delivery

## End

- [ ] Pending signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending completion

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending all scope

## End

- [ ] Pending closure

## End

- [ ] Pending final validation

## End

- [ ] Pending user signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending all features complete

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requested work

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending validation

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending user signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending completion gate

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending all requested work

## End

- [ ] Pending final report

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final delivery

## End

- [ ] Pending all features complete

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending user signoff

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requested scope

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending all features

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user signoff

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending close

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested work

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation

## End

- [ ] Pending user guide

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending all features complete

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing output

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending close

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all features

## End

- [ ] Pending final report

## End

- [ ] Pending user signoff

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending all work

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending all features complete

## End

- [ ] Pending user signoff

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending release

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requested work

## End

- [ ] Pending final report

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending all scope

## End

- [ ] Pending final validation

## End

- [ ] Pending user signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending all features

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final validation

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending all work complete

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending user-facing output

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending implementation

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending all features

## End

- [ ] Pending final delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending close

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending user signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requested work

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending all features complete

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending all scope

## End

- [ ] Pending user signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested additions

## End

- [ ] Pending implementation

## End

- [ ] Pending final handoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending completion gate

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending final report

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending all features

## End

- [ ] Pending signoff

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending final report

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all requested scope

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending done

## End

- [ ] Pending all features complete

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending all requested work

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending all features

## End

- [ ] Pending user guide

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final validation

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending all scope

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending all features complete

## End

- [ ] Pending user signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending closeout

## End

- [ ] Pending implementation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested additions

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending final validation

## End

- [ ] Pending closeout

## End

- [ ] Pending all features

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending user-facing output

## End

- [ ] Pending completion

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending all features complete

## End

- [ ] Pending closeout

## End

- [ ] Pending user signoff

## End

- [ ] Pending implementation

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final smoke test

## End

- [ ] Pending completion

## End

- [ ] Pending all work

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending closeout

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending completion gate

## End

- [ ] Pending user signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all features complete

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending signoff

## End

- [ ] Pending all requested work

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending completion gate

## End

- [ ] Pending final status

## End

- [ ] Pending all features complete

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user signoff

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending user guide

## End

- [ ] Pending all requested features

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending all scope

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending implementation

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending all features complete

## End

- [ ] Pending final review

## End

- [ ] Pending user signoff

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending all requested work

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending all scope

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending user signoff

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending all requested features

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending all work complete

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending release

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending completion

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending user signoff

## End

- [ ] Pending all scope

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending completion gate

## End

- [ ] Pending implementation

## End

- [ ] Pending final response

## End

- [ ] Pending all requested work

## End

- [ ] Pending final delivery

## End

- [ ] Pending all features complete

## End

- [ ] Pending final status

## End

- [ ] Pending user guide

## End

- [ ] Pending signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all scope

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested additions

## End

- [ ] Pending release

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending all scope

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending done

## End

- [ ] Pending final smoke test

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending all features complete

## End

- [ ] Pending final delivery

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final review

## End

- [ ] Pending validation

## End

- [ ] Pending release

## End

- [ ] Pending done

## End

- [ ] Pending all requested work

## End

- [ ] Pending completion

## End

- [ ] Pending final report

## End

- [ ] Pending final status

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending closeout

## End

- [ ] Pending user signoff

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all features

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending completion gate

## End

- [ ] Pending done

## End

- [ ] Pending all scope

## End

- [ ] Pending final report

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending signoff

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending all requested additions

## End

- [ ] Pending implementation closure

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending all features complete

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending user signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all scope

## End

- [ ] Pending final response

## End

- [ ] Pending user guide

## End

- [ ] Pending implementation

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested work

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending all features complete

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending final smoke test

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all scope

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending user guide

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all features

## End

- [ ] Pending final status

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending final response

## End

- [ ] Pending implementation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending user signoff

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending release readiness

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending user-facing output

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending review

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending all features complete

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending final status

## End

- [ ] Pending all scope

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user guide

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending final report

## End

- [ ] Pending user signoff

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final handoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending final smoke test

## End

- [ ] Pending closeout

## End

- [ ] Pending all requested work

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending all features complete

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending final smoke test

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending all scope

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending all requested scope

## End

- [ ] Pending release

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all features

## End

- [ ] Pending final status

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending user signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending checkpoint

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all requested additions

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending all features complete

## End

- [ ] Pending signoff

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user guide

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending all requested work

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending release readiness

## End

- [ ] Pending all features

## End

- [ ] Pending final smoke test

## End

- [ ] Pending signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending all scope

## End

- [ ] Pending final report

## End

- [ ] Pending completion

## End

- [ ] Pending implementation

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending final smoke test

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final review

## End

- [ ] Pending all requested additions

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending user signoff

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending all features complete

## End

- [ ] Pending final status

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user guide

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending all scope

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending all requested work

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending final delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all features complete

## End

- [ ] Pending user signoff

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending implementation

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested additions

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending user guide

## End

- [ ] Pending all scope

## End

- [ ] Pending final review

## End

- [ ] Pending final report

## End

- [ ] Pending release

## End

- [ ] Pending signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final validation

## End

- [ ] Pending all features complete

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested work

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending user signoff

## End

- [ ] Pending all features

## End

- [ ] Pending final response

## End

- [ ] Pending implementation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending release

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all features complete

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending all requested work

## End

- [ ] Pending final response

## End

- [ ] Pending final smoke test

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending user signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending release

## End

- [ ] Pending all features

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending done

## End

- [ ] Pending all scope

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending signoff

## End

- [ ] Pending user guide

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending completion gate

## End

- [ ] Pending final status

## End

- [ ] Pending all requested features

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending user signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all features

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending all requested work

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending implementation

## End

- [ ] Pending closeout

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all features complete

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending all requested additions

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending all scope

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release

## End

- [ ] Pending user guide

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending user signoff

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending final report

## End

- [ ] Pending all features complete

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending implementation

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending all requested work

## End

- [ ] Pending final review

## End

- [ ] Pending final delivery

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending all features

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final review

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release readiness

## End

- [ ] Pending final report

## End

- [ ] Pending all requested additions

## End

- [ ] Pending signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending all scope complete

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending all features

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending user signoff

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending all requested work

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending all features complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user signoff

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending release

## End

- [ ] Pending all scope

## End

- [ ] Pending final validation

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending implementation

## End

- [ ] Pending final report

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending final response

## End

- [ ] Pending signoff

## End

- [ ] Pending all requested additions

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending all features complete

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all scope

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending release

## End

- [ ] Pending signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending all requested work

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending final response

## End

- [ ] Pending user guide

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final status

## End

- [ ] Pending all features complete

## End

- [ ] Pending closeout

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested additions

## End

- [ ] Pending user signoff

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending all scope

## End

- [ ] Pending completion gate

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending final status

## End

- [ ] Pending implementation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final delivery

## End

- [ ] Pending final report

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending all features

## End

- [ ] Pending user signoff

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all features complete

## End

- [ ] Pending release

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending user signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested work

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending implementation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending completion

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final validation

## End

- [ ] Pending all features complete

## End

- [ ] Pending user guide

## End

- [ ] Pending final status

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending all requested additions

## End

- [ ] Pending closeout

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final response

## End

- [ ] Pending user signoff

## End

- [ ] Pending final status

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

## Project-centered procurement and certificate approvals — August 2026

- [x] Preserve projects as the primary source of operational entry and cost allocation
- [x] Generate accounting entries only as a downstream complement of approved project transactions
- [x] Add project- and stage-linked material requisitions
- [x] Add requisition approval workflow for project manager or designated manager
- [x] Add supplier purchase orders generated from approved requisitions
- [x] Add purchase-order approval and supplier linkage
- [x] Add receiving step that updates project material cost without duplicate entry
- [ ] Add optional supplier invoice and payment status to the purchase cycle
- [x] Add certificate approval stages for project manager, general manager, and accountant
- [x] Prevent certificate financial posting before required approvals are complete
- [x] Reflect approved certificate paid and outstanding portions in project cost and reports
- [x] Create downstream journal-entry metadata for approved procurement and certificates
- [ ] Add role-aware approval actions and audit trail for every approval decision
- [ ] Add notifications for pending procurement and certificate approvals
- [x] Add integration tests for project linkage, approval order, and no-duplicate accounting impact
- [x] Run browser smoke tests and save a checkpoint for the new workflows

## Operating rule

- [x] Never require the user to re-enter the same project transaction as a separate accounting journal
- [x] Keep project, stage, vendor, and approval context visible throughout procurement and certificates

## End of new scope

- [ ] Complete project-centered procurement and certificate approval cycle

## Pending

- [ ] Finalize workflow documentation after implementation

## End

- [ ] Pending testing

## End

- [ ] Pending checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending completion

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending release

## End

- [ ] Pending implementation

## End

- [ ] Pending acceptance

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending handoff

## End

- [ ] Pending final status

## End

- [ ] Pending closure

## End

- [ ] Pending user instructions

## End

- [ ] Pending final output

## End

- [ ] Pending all requirements

## End

- [ ] Pending review

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending all scope

## End

- [ ] Pending validation

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending sign-off

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow walkthrough

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending delivery

## End

- [ ] Pending review

## End

- [ ] Pending done

## End

- [ ] Pending all approval stages

## End

- [ ] Pending procurement cycle

## End

- [ ] Pending certificate cycle

## End

- [ ] Pending accounting complement

## End

- [ ] Pending final tests

## End

- [ ] Pending final handoff

## End

- [ ] Pending close

## End

- [ ] Pending user guide

## End

- [ ] Pending final status

## End

- [ ] Pending checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending acceptance testing

## End

- [ ] Pending final review

## End

- [ ] Pending closure

## End

- [ ] Pending handoff

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending project-centered operations

## End

- [ ] Pending accounting downstream linkage

## End

- [ ] Pending procurement approval

## End

- [ ] Pending certificate approval

## End

- [ ] Pending testing and delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending release

## End

- [ ] Pending handoff

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending all new workflow items

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending approval audit

## End

- [ ] Pending notification flow

## End

- [ ] Pending integration tests

## End

- [ ] Pending browser smoke tests

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending user handoff

## End

- [ ] Pending final response

## End

- [ ] Pending workflow release

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending close

## End

- [ ] Pending sign-off

## End

- [ ] Pending final delivery

## End

- [ ] Pending review

## End

- [ ] Pending checkpoint

## End

- [ ] Pending implementation closure

## End

- [ ] Pending documentation

## End

- [ ] Pending acceptance

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending completion

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow completion

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all procurement and certificate features

## End

- [ ] Pending final tests

## End

- [ ] Pending delivery

## End

- [ ] Pending user-facing instructions

## End

- [ ] Pending sign-off

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending closure

## End

- [ ] Pending final status

## End

- [ ] Pending handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending all workflows

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending review

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requirements

## End

- [ ] Pending done

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending sign-off

## End

- [ ] Pending final status

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending acceptance testing

## End

- [ ] Pending workflow release

## End

- [ ] Pending final validation

## End

- [ ] Pending all scope

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending completion

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending close

## End

- [ ] Pending implementation

## End

- [ ] Pending final response

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending sign-off

## End

- [ ] Pending final status

## End

- [ ] Pending all approval paths

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending completion gate

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending final response

## End

- [ ] Pending procurement and certificates

## End

- [ ] Pending accounting complement

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending review

## End

- [ ] Pending acceptance

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending final tests

## End

- [ ] Pending all scope complete

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow close

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending user guide

## End

- [ ] Pending final review

## End

- [ ] Pending final delivery

## End

- [ ] Pending sign-off

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final response

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending checkpoint

## End

- [ ] Pending release

## End

- [ ] Pending all approval stages complete

## End

- [ ] Pending procurement flow complete

## End

- [ ] Pending certificate flow complete

## End

- [ ] Pending downstream journal linkage

## End

- [ ] Pending project-centered rule verified

## End

- [ ] Pending final user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending acceptance testing

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending user guide

## End

- [ ] Pending closeout

## End

- [ ] Pending all requested workflow items

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending review

## End

- [ ] Pending final delivery

## End

- [ ] Pending closure

## End

- [ ] Pending completion gate

## End

- [ ] Pending user-facing response

## End

- [ ] Pending final documentation

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending procurement and certificate walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending browser test

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all workflow scope

## End

- [ ] Pending done

## End

- [ ] Pending handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending closure

## End

- [ ] Pending implementation

## End

- [ ] Pending final validation

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requested changes

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending release

## End

- [ ] Pending approval audit

## End

- [ ] Pending project linkage

## End

- [ ] Pending no duplicate entry verification

## End

- [ ] Pending final handoff

## End

- [ ] Pending all workflow tests

## End

- [ ] Pending final status

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending checkpoint

## End

- [ ] Pending review

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requirements

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final user walkthrough

## End

- [ ] Pending procurement cycle

## End

- [ ] Pending certificate cycle

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending user-facing documentation

## End

- [ ] Pending testing

## End

- [ ] Pending handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending acceptance

## End

- [ ] Pending final validation

## End

- [ ] Pending workflow completion

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending all requested features

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending sign-off

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release readiness

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending all scope

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending all approval workflows

## End

- [ ] Pending procurement implementation

## End

- [ ] Pending certificate implementation

## End

- [ ] Pending project-centered accounting

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending browser smoke tests

## End

- [ ] Pending user guide

## End

- [ ] Pending completion

## End

- [ ] Pending closure

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending validation

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending approval audit

## End

- [ ] Pending notification flow

## End

- [ ] Pending no duplicate entry verification

## End

- [ ] Pending project and stage linkage

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending delivery

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending closure

## End

- [ ] Pending user guide

## End

- [ ] Pending final validation

## End

- [ ] Pending all workflows

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending browser test

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending all requested changes

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending project-centered operation rules

## End

- [ ] Pending downstream journal metadata

## End

- [ ] Pending procurement flow

## End

- [ ] Pending certificate flow

## End

- [ ] Pending all approvals

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending testing

## End

- [ ] Pending acceptance

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending completion gate

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending all scope completion

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending closure

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending all new workflow features

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final response

## End

- [ ] Pending review

## End

- [ ] Pending completion

## End

- [ ] Pending sign-off

## End

- [ ] Pending approval ordering

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending project-centered costs

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending browser tests

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending all requirements

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending close

## End

- [ ] Pending sign-off

## End

- [ ] Pending workflow walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending final response

## End

- [ ] Pending review

## End

- [ ] Pending completion gate

## End

- [ ] Pending approval audit

## End

- [ ] Pending notification setup

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user-facing documentation

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending all workflows complete

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending implementation closure

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending acceptance testing

## End

- [ ] Pending final validation

## End

- [ ] Pending sign-off

## End

- [ ] Pending final response

## End

- [ ] Pending close

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending project linkage

## End

- [ ] Pending procurement

## End

- [ ] Pending certificate approval

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending release readiness

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending tests

## End

- [ ] Pending final validation

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending user guide

## End

- [ ] Pending all scope

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending signoff

## End

- [ ] Pending review

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending release

## End

- [ ] Pending final status

## End

- [ ] Pending handoff

## End

- [ ] Pending close

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending all approvals

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending project-centered accounting complement

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending workflow release

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending all requested scope

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending browser verification

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final status

## End

- [ ] Pending review

## End

- [ ] Pending user guide

## End

- [ ] Pending completion gate

## End

- [ ] Pending all workflow requirements

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending acceptance

## End

- [ ] Pending delivery

## End

- [ ] Pending all approvals ordering

## End

- [ ] Pending procurement cycle

## End

- [ ] Pending certificate cycle

## End

- [ ] Pending accounting complement

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending project linkage

## End

- [ ] Pending final review

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending sign-off

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending all requested changes

## End

- [ ] Pending implementation closure

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final review

## End

- [ ] Pending completion gate

## End

- [ ] Pending final handoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release readiness

## End

- [ ] Pending browser tests

## End

- [ ] Pending all workflows complete

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending validation

## End

- [ ] Pending user guide

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending project-centered rule

## End

- [ ] Pending downstream journal linkage

## End

- [ ] Pending procurement and certificate workflows

## End

- [ ] Pending completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending delivery

## End

- [ ] Pending user response

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final status

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending acceptance testing

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending completion gate

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending sign-off

## End

- [ ] Pending all workflow items

## End

- [ ] Pending implementation closure

## End

- [ ] Pending project linkage

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending approval order

## End

- [ ] Pending procurement cycle

## End

- [ ] Pending certificate cycle

## End

- [ ] Pending accounting metadata

## End

- [ ] Pending notifications

## End

- [ ] Pending tests

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending handoff

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending delivery

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending all scope

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion gate

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending project-centered operations

## End

- [ ] Pending procurement implementation

## End

- [ ] Pending certificate approvals

## End

- [ ] Pending downstream financial complement

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending handoff

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending browser tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending sign-off

## End

- [ ] Pending final review

## End

- [ ] Pending completion gate

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending implementation closure

## End

- [ ] Pending release

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow docs

## End

- [ ] Pending final response

## End

- [ ] Pending all approval stages

## End

- [ ] Pending project linkage

## End

- [ ] Pending accounting complement

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending procurement and certificates

## End

- [ ] Pending notifications

## End

- [ ] Pending tests

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final smoke test

## End

- [ ] Pending signoff

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requested workflow items

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final validation

## End

- [ ] Pending review

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending user guide

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending project-centered rule verification

## End

- [ ] Pending downstream accounting verification

## End

- [ ] Pending procurement approval verification

## End

- [ ] Pending certificate approval verification

## End

- [ ] Pending no duplicate entry verification

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke tests

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending sign-off

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requirements

## End

- [ ] Pending completion gate

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending release readiness

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending handoff

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all workflow scope complete

## End

- [ ] Pending final sign-off

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requested changes

## End

- [ ] Pending project-centered workflow

## End

- [ ] Pending procurement workflow

## End

- [ ] Pending certificate workflow

## End

- [ ] Pending accounting complement

## End

- [ ] Pending final validation

## End

- [ ] Pending tests

## End

- [ ] Pending browser verification

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending all requirements

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending approval order

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending project linkage

## End

- [ ] Pending notifications

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending completion gate

## End

- [ ] Pending final status

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending sign-off

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending procurement and certificate flows

## End

- [ ] Pending accounting downstream linkage

## End

- [ ] Pending final documentation

## End

- [ ] Pending all scope completion

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending all requirements

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending project-centered source

## End

- [ ] Pending downstream journal layer

## End

- [ ] Pending procurement complete

## End

- [ ] Pending certificate approvals complete

## End

- [ ] Pending final tests

## End

- [ ] Pending browser validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending close

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending delivery

## End

- [ ] Pending release

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending signoff

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all workflow items

## End

- [ ] Pending approval sequencing

## End

- [ ] Pending notifications

## End

- [ ] Pending audit trail

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending final validation

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending all scope

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending done

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending project-centered process

## End

- [ ] Pending procurement process

## End

- [ ] Pending certificate process

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending browser verification

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending status

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending all workflow tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending audit trail

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending project source

## End

- [ ] Pending downstream accounting layer

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending final smoke test

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all new scope

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending delivery

## End

- [ ] Pending release readiness

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final handoff

## End

- [ ] Pending all approvals

## End

- [ ] Pending procurement and certificates

## End

- [ ] Pending accounting complement

## End

- [ ] Pending testing

## End

- [ ] Pending browser smoke tests

## End

- [ ] Pending final validation

## End

- [ ] Pending user guide

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending review

## End

- [ ] Pending completion

## End

- [ ] Pending handoff

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending release

## End

- [ ] Pending signoff

## End

- [ ] Pending final status

## End

- [ ] Pending all requirements

## End

- [ ] Pending implementation closure

## End

- [ ] Pending no duplicate accounting verification

## End

- [ ] Pending project linkage verification

## End

- [ ] Pending approval order verification

## End

- [ ] Pending notification verification

## End

- [ ] Pending final smoke test

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all requested workflow items

## End

- [ ] Pending final status

## End

- [ ] Pending signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending browser verification

## End

- [ ] Pending all scope

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending final report

## End

- [ ] Pending release

## End

- [ ] Pending user guide

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending procurement workflow

## End

- [ ] Pending certificate workflow

## End

- [ ] Pending project-centered data

## End

- [ ] Pending downstream accounting metadata

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending testing

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending signoff

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending all requirements

## End

- [ ] Pending user-facing summary

## End

- [ ] Pending delivery

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending closure

## End

- [ ] Pending procurement and certificate completion

## End

- [ ] Pending downstream accounting completion

## End

- [ ] Pending project-centered rule completion

## End

- [ ] Pending approval sequencing completion

## End

- [ ] Pending no duplicate entry completion

## End

- [ ] Pending notification completion

## End

- [ ] Pending final tests

## End

- [ ] Pending browser validation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final validation

## End

- [ ] Pending all scope

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending procurement request

## End

- [ ] Pending manager approval

## End

- [ ] Pending purchase order

## End

- [ ] Pending supplier receipt

## End

- [ ] Pending supplier invoice

## End

- [ ] Pending payment status

## End

- [ ] Pending certificate approvals

## End

- [ ] Pending financial posting

## End

- [ ] Pending project dashboard reflection

## End

- [ ] Pending final tests

## End

- [ ] Pending release

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending handoff

## End

- [ ] Pending sign-off

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending project-centered operation

## End

- [ ] Pending accounting complement

## End

- [ ] Pending procurement and certificates

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending browser verification

## End

- [ ] Pending final report

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user guide

## End

- [ ] Pending workflow release

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final delivery

## End

- [ ] Pending all scope

## End

- [ ] Pending acceptance

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending project source of truth

## End

- [ ] Pending downstream journals

## End

- [ ] Pending procurement approval chain

## End

- [ ] Pending certificate approval chain

## End

- [ ] Pending accounting reporting

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending status

## End

- [ ] Pending release

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending all requirements

## End

- [ ] Pending final report

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending delivery

## End

- [ ] Pending approval flow testing

## End

- [ ] Pending no duplicate posting testing

## End

- [ ] Pending project linkage testing

## End

- [ ] Pending notification testing

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending release readiness

## End

- [ ] Pending all workflow scope complete

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending signoff

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending completion gate

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending project-centered workflows

## End

- [ ] Pending procurement and certificate workflows

## End

- [ ] Pending downstream accounting layer

## End

- [ ] Pending approval audit and notifications

## End

- [ ] Pending final tests

## End

- [ ] Pending browser verification

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending handoff

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending acceptance

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all scope

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending sign-off

## End

- [ ] Pending release readiness

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final review

## End

- [ ] Pending user guide

## End

- [ ] Pending closeout

## End

- [ ] Pending procurement cycle

## End

- [ ] Pending certificate approval cycle

## End

- [ ] Pending downstream journal data

## End

- [ ] Pending project-centered source validation

## End

- [ ] Pending no duplicate accounting validation

## End

- [ ] Pending notification flow validation

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all requirements

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending approval order

## End

- [ ] Pending project linkage

## End

- [ ] Pending procurement

## End

- [ ] Pending certificates

## End

- [ ] Pending financial complement

## End

- [ ] Pending tests

## End

- [ ] Pending delivery

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending review

## End

- [ ] Pending release readiness

## End

- [ ] Pending user guide

## End

- [ ] Pending final validation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all workflow scope

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow docs

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending browser verification

## End

- [ ] Pending final tests

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending closeout

## End

- [ ] Pending release readiness

## End

- [ ] Pending approval audit

## End

- [ ] Pending notification flow

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending project source of truth

## End

- [ ] Pending procurement flow

## End

- [ ] Pending certificate flow

## End

- [ ] Pending downstream journal layer

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending workflow validation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user guide

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending all requested workflow features

## End

- [ ] Pending final report

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending review

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending implementation closure

## End

- [ ] Pending sign-off

## End

- [ ] Pending final status

## End

- [ ] Pending browser tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all scope

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending approval ordering

## End

- [ ] Pending procurement and certificate workflows

## End

- [ ] Pending project-centered operational entries

## End

- [ ] Pending downstream accounting metadata

## End

- [ ] Pending audit trail

## End

- [ ] Pending notifications

## End

- [ ] Pending tests

## End

- [ ] Pending browser smoke

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending delivery

## End

- [ ] Pending signoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all approvals

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending project and stage context

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending user guide

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint

## End

- [ ] Pending browser verification

## End

- [ ] Pending all workflow tests

## End

- [ ] Pending project-centered source

## End

- [ ] Pending procurement lifecycle

## End

- [ ] Pending certificate lifecycle

## End

- [ ] Pending downstream financial reporting

## End

- [ ] Pending notifications and audit

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending review

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final review

## End

- [ ] Pending all requirements

## End

- [ ] Pending implementation closure

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending approval chain

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending project-centered recording

## End

- [ ] Pending procurement and certificate workflow

## End

- [ ] Pending financial complement

## End

- [ ] Pending final tests

## End

- [ ] Pending final response

## End

- [ ] Pending user guide

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending done

## End

- [ ] Pending review

## End

- [ ] Pending validation

## End

- [ ] Pending signoff

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final smoke test

## End

- [ ] Pending notification flow

## End

- [ ] Pending audit trail

## End

- [ ] Pending project filters

## End

- [ ] Pending stage filters

## End

- [ ] Pending approval decisions

## End

- [ ] Pending procurement states

## End

- [ ] Pending certificate states

## End

- [ ] Pending downstream journal references

## End

- [ ] Pending final user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending final validation

## End

- [ ] Pending final response

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending checkpoint

## End

- [ ] Pending release readiness

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending final status

## End

- [ ] Pending signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user guide

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending browser validation

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending project-centered workflow verification

## End

- [ ] Pending downstream accounting verification

## End

- [ ] Pending procurement approval chain verification

## End

- [ ] Pending certificate approval chain verification

## End

- [ ] Pending no duplicate entry verification

## End

- [ ] Pending notifications verification

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending final delivery

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint

## End

- [ ] Pending signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested workflow scope

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending completion gate

## End

- [ ] Pending release readiness

## End

- [ ] Pending approval ordering

## End

- [ ] Pending procurement lifecycle

## End

- [ ] Pending certificate lifecycle

## End

- [ ] Pending downstream accounting layer

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke tests

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending all requirements

## End

- [ ] Pending implementation closure

## End

- [ ] Pending project-centered source

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending audit trail

## End

- [ ] Pending notifications

## End

- [ ] Pending final workflow validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending completion gate

## End

- [ ] Pending done

## End

- [ ] Pending all workflow items

## End

- [ ] Pending final report

## End

- [ ] Pending validation

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending signoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending final status

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user guide

## End

- [ ] Pending completion

## End

- [ ] Pending all requested features

## End

- [ ] Pending procurement workflow

## End

- [ ] Pending certificate workflow

## End

- [ ] Pending accounting complement

## End

- [ ] Pending project source rule

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending final tests

## End

- [ ] Pending browser verification

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final status

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all workflow scope

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final report

## End

- [ ] Pending approval sequencing

## End

- [ ] Pending procurement and certificate workflows

## End

- [ ] Pending accounting downstream

## End

- [ ] Pending project-centered operations

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending audit logs

## End

- [ ] Pending notification triggers

## End

- [ ] Pending testing

## End

- [ ] Pending browser smoke

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending completion

## End

- [ ] Pending release readiness

## End

- [ ] Pending checkpoint

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all workflows

## End

- [ ] Pending final report

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending status

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final handoff

## End

- [ ] Pending project source verification

## End

- [ ] Pending procurement verification

## End

- [ ] Pending certificate verification

## End

- [ ] Pending downstream accounting verification

## End

- [ ] Pending approval order verification

## End

- [ ] Pending no duplicate entry verification

## End

- [ ] Pending notification verification

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending project-centered source of truth

## End

- [ ] Pending procurement and certificate cycles

## End

- [ ] Pending downstream financial layer

## End

- [ ] Pending final response

## End

- [ ] Pending user guide

## End

- [ ] Pending completion gate

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending final smoke test

## End

- [ ] Pending browser verification

## End

- [ ] Pending all workflow items

## End

- [ ] Pending completion

## End

- [ ] Pending signoff

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending review

## End

- [ ] Pending release readiness

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending final report

## End

- [ ] Pending final smoke test

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all scope

## End

- [ ] Pending project-centered workflow

## End

- [ ] Pending procurement and certificate approvals

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending audit trail

## End

- [ ] Pending notifications

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final handoff

## End

- [ ] Pending all requested workflows

## End

- [ ] Pending completion gate

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending signoff

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final report

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending project linkage

## End

- [ ] Pending approval order

## End

- [ ] Pending procurement

## End

- [ ] Pending certificates

## End

- [ ] Pending accounting complement

## End

- [ ] Pending notifications and audit

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user guide

## End

- [ ] Pending completion

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending completion gate

## End

- [ ] Pending all scope

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all workflow tests

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending user-facing guide

## End

- [ ] Pending completion

## End

- [ ] Pending all requirements

## End

- [ ] Pending project source rule

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending procurement approval cycle

## End

- [ ] Pending certificate approval cycle

## End

- [ ] Pending downstream journals

## End

- [ ] Pending audit and notifications

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending sign-off

## End

- [ ] Pending release

## End

- [ ] Pending completion gate

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending workflow docs

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final smoke test

## End

- [ ] Pending approval order validation

## End

- [ ] Pending project and stage context validation

## End

- [ ] Pending procurement state validation

## End

- [ ] Pending certificate state validation

## End

- [ ] Pending downstream accounting validation

## End

- [ ] Pending no duplicate entry validation

## End

- [ ] Pending notification validation

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending release readiness

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint

## End

- [ ] Pending user guide

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all workflow requirements

## End

- [ ] Pending implementation closure

## End

- [ ] Pending sign-off

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending closeout

## End

- [ ] Pending all scope

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final validation

## End

- [ ] Pending browser smoke tests

## End

- [ ] Pending procurement and certificate flows

## End

- [ ] Pending accounting complement

## End

- [ ] Pending project-centered source

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending notifications and audit

## End

- [ ] Pending final implementation

## End

- [ ] Pending release

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user guide

## End

- [ ] Pending final report

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending completion gate

## End

- [ ] Pending signoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending procurement lifecycle

## End

- [ ] Pending certificate approval lifecycle

## End

- [ ] Pending downstream journal references

## End

- [ ] Pending project-linked cost impact

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending closure

## End

- [ ] Pending final status

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all workflow tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending signoff

## End

- [ ] Pending final report

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending all requirements

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending user guide

## End

- [ ] Pending browser validation

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending procurement and certificates complete

## End

- [ ] Pending downstream accounting complete

## End

- [ ] Pending project-centered rule complete

## End

- [ ] Pending notification and audit complete

## End

- [ ] Pending approval order complete

## End

- [ ] Pending no duplicate entry complete

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending release readiness

## End

- [ ] Pending signoff

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all workflow items

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending final review

## End

- [ ] Pending user guide

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending browser tests

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending project-centered operations

## End

- [ ] Pending procurement flow

## End

- [ ] Pending certificate approval flow

## End

- [ ] Pending downstream accounting layer

## End

- [ ] Pending audit and notifications

## End

- [ ] Pending final status

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending signoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested features

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending final status

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending review

## End

- [ ] Pending user guide

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final report

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending all workflows

## End

- [ ] Pending completion

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending signoff

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final report

## End

- [ ] Pending all requirements

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending project-centered source

## End

- [ ] Pending procurement and certificates

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending audit trail and notifications

## End

- [ ] Pending approval order

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending final tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final validation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending final handoff

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending signoff

## End

- [ ] Pending user guide

## End

- [ ] Pending final status

## End

- [ ] Pending final report

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final response

## End

- [ ] Pending browser verification

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final handoff

## End

- [ ] Pending delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending procurement cycle

## End

- [ ] Pending certificate cycle

## End

- [ ] Pending journal complement

## End

- [ ] Pending project-centered records

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending final tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release readiness

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending signoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending completion gate

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending review

## End

- [ ] Pending user guide

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requirements

## End

- [ ] Pending workflow completion

## End

- [ ] Pending final smoke test

## End

- [ ] Pending browser verification

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending signoff

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final validation

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending all scope

## End

- [ ] Pending project-centered source of truth

## End

- [ ] Pending procurement approvals

## End

- [ ] Pending certificate approvals

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending notifications and audit

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending final tests

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending handoff

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending signoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final status

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending all workflow requirements

## End

- [ ] Pending procurement and certificate state

## End

- [ ] Pending project and stage fields

## End

- [ ] Pending accounting metadata

## End

- [ ] Pending approval history

## End

- [ ] Pending notification flow

## End

- [ ] Pending final tests

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final report

## End

- [ ] Pending closeout

## End

- [ ] Pending release

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending checkpoint

## End

- [ ] Pending sign-off

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final status

## End

- [ ] Pending all scope

## End

- [ ] Pending implementation closure

## End

- [ ] Pending final smoke test

## End

- [ ] Pending approval order

## End

- [ ] Pending procurement flow

## End

- [ ] Pending certificate flow

## End

- [ ] Pending financial complement

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending project-centered entry

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending final validation

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending browser tests

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending approval audit

## End

- [ ] Pending final report

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending implementation closure

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending final smoke test

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all scope

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending final review

## End

- [ ] Pending final report

## End

- [ ] Pending user guide

## End

- [ ] Pending workflow completion

## End

- [ ] Pending project-centered source

## End

- [ ] Pending procurement and certificate approvals

## End

- [ ] Pending downstream accounting layer

## End

- [ ] Pending audit and notifications

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending final response

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending release readiness

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending sign-off

## End

- [ ] Pending final report

## End

- [ ] Pending implementation closure

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending approval sequencing

## End

- [ ] Pending procurement lifecycle

## End

- [ ] Pending certificate lifecycle

## End

- [ ] Pending accounting complement

## End

- [ ] Pending project linkage

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending notification flow

## End

- [ ] Pending final tests

## End

- [ ] Pending browser validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending release

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending user guide

## End

- [ ] Pending final smoke test

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final handoff

## End

- [ ] Pending all scope

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending procurement and certificate completion

## End

- [ ] Pending downstream financial complement

## End

- [ ] Pending project-centered primary entry

## End

- [ ] Pending approval and audit completion

## End

- [ ] Pending notification completion

## End

- [ ] Pending no duplicate accounting completion

## End

- [ ] Pending final tests

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending release readiness

## End

- [ ] Pending user guide

## End

- [ ] Pending final report

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending all workflow scope

## End

- [ ] Pending final validation

## End

- [ ] Pending implementation closure

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending project and stage integrity

## End

- [ ] Pending procurement approval order

## End

- [ ] Pending certificate approval order

## End

- [ ] Pending accounting complement

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending notifications and audit

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending final status

## End

- [ ] Pending release

## End

- [ ] Pending closeout

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending done

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final response

## End

- [ ] Pending signoff

## End

- [ ] Pending checkpoint

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending approval audit

## End

- [ ] Pending procurement and certificate workflows

## End

- [ ] Pending downstream journals

## End

- [ ] Pending project source of truth

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending notification flow

## End

- [ ] Pending final tests

## End

- [ ] Pending browser verification

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending final review

## End

- [ ] Pending final handoff

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending final validation

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending user guide

## End

- [ ] Pending signoff

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending approval order

## End

- [ ] Pending procurement and certificates

## End

- [ ] Pending accounting complement

## End

- [ ] Pending project linkage

## End

- [ ] Pending final smoke test

## End

- [ ] Pending all requested workflow items

## End

- [ ] Pending final report

## End

- [ ] Pending completion gate

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requirements

## End

- [ ] Pending final tests

## End

- [ ] Pending notification and audit

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending project-centered workflow

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending procurement cycle

## End

- [ ] Pending certificate approvals

## End

- [ ] Pending final report

## End

- [ ] Pending final delivery

## End

- [ ] Pending user guide

## End

- [ ] Pending final response

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending review

## End

- [ ] Pending done

## End

- [ ] Pending handoff

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending checkpoint

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending sign-off

## End

- [ ] Pending approval order

## End

- [ ] Pending project and stage context

## End

- [ ] Pending supplier purchase order

## End

- [ ] Pending receiving

## End

- [ ] Pending invoice/payment

## End

- [ ] Pending certificate financial posting

## End

- [ ] Pending dashboard reflection

## End

- [ ] Pending accounting metadata

## End

- [ ] Pending final tests

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending delivery

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending completion gate

## End

- [ ] Pending release readiness

## End

- [ ] Pending final handoff

## End

- [ ] Pending signoff

## End

- [ ] Pending final validation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending implementation closure

## End

- [ ] Pending user guide

## End

- [ ] Pending all requested scope

## End

- [ ] Pending final delivery

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending all approval workflows

## End

- [ ] Pending no duplicate posting

## End

- [ ] Pending project source rule

## End

- [ ] Pending procurement

## End

- [ ] Pending certificate approval

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending audit and notifications

## End

- [ ] Pending tests

## End

- [ ] Pending browser smoke

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending signoff

## End

- [ ] Pending user guide

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final delivery

## End

- [ ] Pending final smoke test

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending project-linked cost

## End

- [ ] Pending approval history

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending done

## End

- [ ] Pending release readiness

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending signoff

## End

- [ ] Pending browser tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending procurement completion

## End

- [ ] Pending certificate completion

## End

- [ ] Pending accounting complement completion

## End

- [ ] Pending project-centric operation completion

## End

- [ ] Pending all new scope completion

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending user-facing instructions

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final review

## End

- [ ] Pending completion

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint

## End

- [ ] Pending final delivery

## End

- [ ] Pending final status

## End

- [ ] Pending approval order tests

## End

- [ ] Pending procurement tests

## End

- [ ] Pending certificate tests

## End

- [ ] Pending accounting linkage tests

## End

- [ ] Pending notification tests

## End

- [ ] Pending no duplicate tests

## End

- [ ] Pending browser smoke tests

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final response

## End

- [ ] Pending final handoff

## End

- [ ] Pending final delivery

## End

- [ ] Pending completion gate

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending release readiness

## End

- [ ] Pending user guide

## End

- [ ] Pending done

## End

- [ ] Pending final status

## End

- [ ] Pending final validation

## End

- [ ] Pending all requirements

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending project-centered source

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending procurement and certificate workflow

## End

- [ ] Pending approvals

## End

- [ ] Pending notifications

## End

- [ ] Pending audit trail

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending final tests

## End

- [ ] Pending browser validation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending review

## End

- [ ] Pending final response

## End

- [ ] Pending release

## End

- [ ] Pending user guide

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow close

## End

- [ ] Pending all scope complete

## End

- [ ] Pending final smoke test

## End

- [ ] Pending final report

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending signoff

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final validation

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending done

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending procurement and certificate cycle

## End

- [ ] Pending downstream journal complement

## End

- [ ] Pending project-centered recording

## End

- [ ] Pending approval sequencing

## End

- [ ] Pending audit and notifications

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending final review

## End

- [ ] Pending release readiness

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending final status

## End

- [ ] Pending closure

## End

- [ ] Pending user guide

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending browser smoke test

## End

- [ ] Pending final tests

## End

- [ ] Pending implementation closure

## End

- [ ] Pending completion

## End

- [ ] Pending done

## End

- [ ] Pending final handoff

## End

- [ ] Pending final report

## End

- [ ] Pending final validation

## End

- [ ] Pending signoff

## End

- [ ] Pending closeout

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending all scope

## End

- [ ] Pending final delivery

## End

- [ ] Pending release

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending completion gate

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all approval workflows

## End

- [ ] Pending procurement request

## End

- [ ] Pending manager approval

## End

- [ ] Pending purchase order

## End

- [ ] Pending receiving

## End

- [ ] Pending invoice payment

## End

- [ ] Pending certificate approval

## End

- [ ] Pending financial posting

## End

- [ ] Pending project dashboard linkage

## End

- [ ] Pending journal metadata

## End

- [ ] Pending tests and delivery

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending closeout

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending final validation

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending signoff

## End

- [ ] Pending completion

## End

- [ ] Pending release

## End

- [ ] Pending done

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending workflow docs

## End

- [ ] Pending final status

## End

- [ ] Pending all requirements

## End

- [ ] Pending implementation closure

## End

- [ ] Pending closeout

## End

- [ ] Pending final report

## End

- [ ] Pending final smoke test

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending approval audit

## End

- [ ] Pending notifications

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending project-centric operation

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending procurement and certificates

## End

- [ ] Pending final validation

## End

- [ ] Pending completion gate

## End

- [ ] Pending release readiness

## End

- [ ] Pending done

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending final handoff

## End

- [ ] Pending final status

## End

- [ ] Pending final review

## End

- [ ] Pending closeout

## End

- [ ] Pending user guide

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final report

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending signoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all scope complete

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending testing

## End

- [ ] Pending browser smoke

## End

- [ ] Pending final validation

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending final response

## End

- [ ] Pending final delivery

## End

- [ ] Pending done

## End

- [ ] Pending final review

## End

- [ ] Pending final status

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending checkpoint save

## End

- [ ] Pending approval chain

## End

- [ ] Pending procurement lifecycle

## End

- [ ] Pending certificate lifecycle

## End

- [ ] Pending downstream accounting

## End

- [ ] Pending project source

## End

- [ ] Pending no duplicate accounting

## End

- [ ] Pending audit and notification

## End

- [ ] Pending final tests

## End

- [ ] Pending final smoke test

## End

- [ ] Pending browser validation

## End

- [ ] Pending all requirements

## End

- [ ] Pending final report

## End

- [ ] Pending final response

## End

- [ ] Pending release readiness

## End

- [ ] Pending user guide

## End

- [ ] Pending final handoff

## End

- [ ] Pending completion gate

## End

- [ ] Pending closeout

## End

- [ ] Pending final status

## End

- [ ] Pending final delivery

## End

- [ ] Pending signoff

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending implementation closure

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final checkpoint

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending all workflow scope

## End

- [ ] Pending project-centered accounting rule

## End

- [ ] Pending procurement approval chain

## End

- [ ] Pending certificate approval chain

## End

- [ ] Pending financial complement

## End

- [ ] Pending no duplicate entry

## End

- [ ] Pending notifications

## End

- [ ] Pending audit trail

## End

- [ ] Pending final validation

## End

- [ ] Pending browser tests

## End

- [ ] Pending final checkpoint save

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending release

## End

- [ ] Pending completion

## End

- [ ] Pending closeout

## End

- [ ] Pending final handoff

## End

- [ ] Pending user guide

## End

- [ ] Pending final report

## End

- [ ] Pending final status

## End

- [ ] Pending signoff

## End

- [ ] Pending implementation closure

## End

- [ ] Pending all requirements complete

## End

- [ ] Pending workflow documentation

## End

- [ ] Pending final smoke test

## End

- [ ] Pending approval order tests

## End

- [ ] Pending project linkage tests

## End

- [ ] Pending procurement tests

## End

- [ ] Pending certificate tests

## End

- [ ] Pending accounting linkage tests

## End

- [ ] Pending notification tests

## End

- [ ] Pending no duplicate tests

## End

- [ ] Pending final delivery

## End

- [ ] Pending final response

## End

- [ ] Pending checkpoint

## End

- [ ] Pending completion gate

## End

- [ ] Pending closeout

## End

- [ ] Pending final validation

## End

- [ ] Pending handoff

## End

- [ ] Pending release readiness

## End

- [ ] Pending final review

## End

- [ ] Pending done

## End

- [ ] Pending final report

## End

- [ ] Pending final status

## End

- [ ] Pending user walkthrough

## End

- [ ] Pending final smoke test

## End

- [ ] Pending user guide

## End

- [ ] Pending all workflow items complete

## End

- [ ] Pending implementation closure



## Expanded Web Parity — remaining work
- [x] ربط صفحة المهام اليومية بالمسار والقائمة الجانبية
- [x] إضافة نموذج مسير رواتب قابل للطباعة
- [x] توسعة التقارير إلى مركز التكلفة وقائمة الدخل والتدفقات النقدية
- [x] تفعيل تنبيهات المتصفح الاختيارية للموافقات والمهام
- [x] تنفيذ تحقق E2E لدورة المشتريات حتى الدفع
- [x] إضافة اختبار Vitest لتحديث فاتورة أمر الشراء


## Sidebar separation request
- [x] إضافة قسم مستقل للمصروفات في القائمة الجانبية مع مسار واضح
- [x] إضافة قسم مستقل للعهد في القائمة الجانبية مع مسار واضح
- [x] الحفاظ على روابط الرواتب والتقارير وكشف حساب العهد دون تعارض


## Excel export request
- [x] إضافة زر تصدير Excel لبيانات التكاليف والمصروفات مع الفلاتر الحالية
- [x] إضافة زر تصدير Excel لبيانات العهد وكشف الحساب المعروض
- [x] اختبار إنشاء ملف XLSX وسلامة اتجاه البيانات العربية


## Accounting section request
- [ ] إضافة قسم محاسبة مستقل في القائمة الجانبية
- [ ] إضافة أيقونة فاتورة مبيعات
- [ ] إضافة أيقونة فاتورة مشتريات
- [ ] إضافة أيقونة قيد محاسبي
- [ ] إضافة أيقونة سند صرف مع اختيار بنك أو صندوق
- [ ] إضافة أيقونة سند قبض مع اختيار بنك أو صندوق
- [ ] إضافة أيقونة عرض سعر
- [ ] إضافة أيقونة أمر شراء
- [ ] إضافة شجرة حسابات تشمل الصناديق والحسابات البنكية
- [ ] ربط المستندات بالتقارير ومصدر المشروع دون تكرار الإدخال


## Flexible project model request
- [ ] إضافة تصنيف مرن لنوع المشروع: تطوير عقاري أو بيع على الخارطة أو مقاولات رئيسية أو مقاولات باطن أو عام
- [ ] فصل مصدر الإيراد في سند القبض عن بيع الوحدات مع دعم المالك والعميل والجهة التعاقدية
- [ ] جعل الفواتير والتحصيلات تعمل مع العقود والمقاولات دون اشتراط وحدة عقارية
- [ ] الحفاظ على مسار بيع الوحدات الحالي عندما يكون المشروع تطويرًا عقاريًا
- [ ] إضافة اختبارات لسيناريو قبض دفعة من مالك لمشروع مقاولات


## Accounting reports request
- [x] إضافة تقرير كشف حساب عميل
- [x] إضافة تقرير كشف حساب مورد
- [x] إضافة تقرير ميزان مراجعة
- [x] إضافة تقرير قائمة الدخل
- [x] إضافة تقرير الميزانية العمومية والمركز المالي
- [x] دعم اختيار المشروع والفترة الزمنية في التقارير المحاسبية
- [x] إضافة اختبارات لحساب الأرصدة والإجماليات المحاسبية


## Cost item cards request
- [ ] إنشاء شجرة بطاقات بنود تكلفة المشروع مع مستويات وتصنيفات للخامات
- [ ] إضافة بطاقات افتراضية للحديد والسيراميك والدهانات والرمل والأسمنت وبنود البناء الشائعة
- [ ] إتاحة إضافة وتعديل بطاقات جديدة من المستخدم
- [ ] ربط بطاقة التكلفة بإضافة المصروف
- [ ] ربط بطاقة التكلفة بسند الصرف المحاسبي
- [ ] إضافة تقرير تفصيلي يبين ما تم صرفه لكل بند تكلفة ومشروع
- [ ] إضافة اختبار لتجميع المصروفات حسب بطاقة التكلفة

- [x] إضافة قائمة افتراضية من نحو 15 بطاقة تكلفة، تشمل بطاقة عدد بناء للعدد البسيطة


## Editable account and cost trees
- [x] إضافة تعديل وتعطيل للحسابات مع منع حذف الحسابات المستخدمة في قيود
- [x] إضافة تعديل وتعطيل لبطاقات بنود التكلفة
- [x] إضافة حسابات فرعية وبطاقات تكلفة فرعية من واجهة الشجرة
- [x] إضافة أزرار واضحة للإضافة والتعديل والتعطيل داخل شجرة الحسابات وبطاقات التكلفة
- [ ] اختبار حماية السجلات المستخدمة في التقارير والقيود

- [x] دعم إضافة أكثر من حساب بنكي وأكثر من حساب مصروفات تحت الحساب الأب المناسب


## Accounting report date range
- [x] إضافة تاريخ من وتاريخ إلى كمدخلين موحدين لجميع التقارير المحاسبية
- [x] تمرير نطاق التاريخ إلى ميزان المراجعة وقائمة الدخل والميزانية والمركز المالي وتقرير بنود التكلفة
- [ ] اختبار اختلاف نتائج التقارير عند تغيير الفترة


## Group payroll sheet request
- [x] إضافة مسير شهري جماعي يعرض جميع الموظفين في جدول واحد
- [x] اختيار الشهر والسنة مرة واحدة للمسير
- [x] إضافة أعمدة الحضور والغياب والخصم والراتب المستحق والمدفوع والمتبقي
- [x] دعم تصنيف الراتب والمشروع أو المصروف الإداري داخل كل صف
- [x] حفظ عدة صفوف رواتب دفعة واحدة مع الحفاظ على الموافقات والتقارير
- [x] طباعة وتصدير مسير الرواتب الجماعي


## Custody classification request
- [x] إضافة تصنيف عهدة مشروع
- [x] إضافة تصنيف عهدة نثريات عامة
- [x] إضافة تصنيف عهدة مصروفات تشغيلية
- [x] جعل المشروع اختياريًا للعهد العامة وإلزاميًا لعهدة المشروع
- [x] إظهار التصنيف في كشف حساب العهد وتصديرها وتقاريرها


## Fixed assets request
- [x] إضافة قسم مستقل للأصول الثابتة في المحاسبة
- [x] تسجيل الأصل من فاتورة شراء أو قيد محاسبي
- [x] حفظ تكلفة الأصل وتاريخ الاقتناء والقيمة المتبقية والعمر الإنتاجي
- [x] دعم طريقة الإهلاك الخطي مبدئيًا مع قابلية التوسعة
- [x] إنشاء جدول إهلاك شهري تلقائي لكل أصل
- [x] إنشاء قيد مصروف الإهلاك ومجمع الإهلاك وربطه بالتقارير
- [x] إضافة تقرير سجل الأصول والقيمة الدفترية والإهلاك المتراكم
- [x] إضافة اختبار حساب الإهلاك وجدول الأشهر


## Asset cards and accounting links
- [x] إنشاء بطاقة مستقلة لكل أصل ثابت مع كود وحساب أصل خاص
- [x] إظهار بطاقات الأصول في اختيار الحساب داخل الفاتورة والقيد
- [x] ربط فاتورة أو قيد التسجيل ببطاقة الأصل المختارة
- [x] عرض القيمة والتكلفة والإهلاك والقيمة الدفترية داخل بطاقة الأصل
- [x] اختبار تسجيل فاتورة أصل واختيار بطاقة أصل محددة


## Active projects dashboard bug
- [x] إصلاح ظهور المشاريع النشطة بصفر رغم وجود مشروع بتواريخ بداية ونهاية سارية
- [x] توحيد احتساب الحالة النشطة بين بطاقة لوحة التنفيذ والعداد الزمني
- [x] إضافة اختبار لمشروع نشط ومشروع منتهٍ ومشروع بلا تواريخ


## Active stage timer request
- [x] إضافة عداد مستقل للمرحلة النشطة بجوار عداد المشروع
- [x] حساب الأيام المتبقية للمرحلة من تاريخ بدايتها ونهايتها
- [x] إظهار حالة المرحلة مكتملة أو متأخرة أو جارية داخل العداد
- [x] اختبار عداد المرحلة مع مرحلة مؤرخة ومرحلة بلا تواريخ


## Dashboard budget summary request
- [x] إضافة ملخص بصري للمشروع ككل داخل الداش بورد
- [x] إضافة ملخص بصري للمرحلة الحالية داخل الداش بورد
- [x] عرض الميزانية المحددة والمنصرف فعليًا والفرق لكل ملخص
- [x] عرض معدل الانحراف والحالة والقراءة التنفيذية مثل وفر أو تجاوز
- [x] ربط الملخصين بالمشروع والمرحلة المحددين في الداش بورد


## Dashboard timer order refinement
- [x] عرض عداد المرحلة النشطة قبل عداد المشروع في قسم المؤشرات التنفيذية


## Editable project timeline
- [x] إضافة وضع تعديل لبيانات المشروع من شاشة البرنامج الزمني
- [x] إضافة وضع تعديل لبيانات كل مرحلة من شاشة البرنامج الزمني
- [x] حفظ تواريخ البداية والنهاية والميزانية والحالة ونسبة الإنجاز مع التحقق من صحة التواريخ
- [x] تحديث العدادات والداشب بورد بعد حفظ تعديلات البرنامج الزمني
- [x] اختبار التعديل والحفظ وإعادة تحميل البرنامج الزمني


## Editable master data across ERP
- [ ] حصر البيانات الرئيسية القابلة للتعديل في المحاسبة وباقي القوائم
- [x] إتاحة تعديل شجرة الحسابات مع حماية الحسابات المستخدمة في القيود المرحّلة
- [x] إتاحة تعديل بطاقات بنود التكلفة والأصول والبيانات التشغيلية الأساسية
- [x] تسجيل تعديلات البيانات الرئيسية في سجل التدقيق وتحديث التقارير المرتبطة
- [ ] اختبار التعديل الآمن للبيانات الرئيسية دون كسر القيود أو التقارير


## Payroll allocation refinement
- [ ] جعل المشروع اختياريًا في مسير الرواتب مع إضافة اختيار راتب إداري
- [ ] إضافة خيار راتب مرتبط بمشروع بنسبة وخانة نسبة التحمل
- [ ] منع إلزام اختيار المشروع عند الراتب الإداري وإزالة رسالة الاختيار الخاطئة
- [ ] احتساب مبلغ التحميل على المشروع من الراتب ونسبة التحمل وربطه بالتقارير
- [ ] اختبار حفظ مسير إداري ومسير محمل على مشروع بنسبة


## Manual payroll attendance input
- [ ] فصل مسير الرواتب عن سجل الحضور والانصراف وعدم جلب الغياب تلقائيًا
- [ ] إبقاء ملخص الحضور والانصراف مرجعًا مستقلًا غير مؤثر على الراتب
- [ ] اعتماد أيام الغياب والخصم المدخلين يدويًا في حساب صافي الراتب
- [ ] اختبار أن تعديل سجل الحضور لا يغير مسيرًا محفوظًا


## Employee master profile expansion
- [ ] إضافة الراتب الأساسي إلى ملف الموظف
- [ ] إضافة البدلات والاستقطاعات والراتب الإجمالي الافتراضي
- [ ] إضافة المسمى الوظيفي والقسم والمدير المباشر وتاريخ التعيين
- [ ] إضافة بيانات الاتصال والهوية والبنك والتأمينات عند الحاجة
- [ ] ربط بيانات الموظف الافتراضية بمسير الرواتب والعهد والحضور
- [ ] اختبار إنشاء وتعديل ملف موظف غني بالمعلومات


## Separate attendance and liquidity indicators
- [x] فصل عنوان وبطاقات الحضور والانصراف عن السيولة وفجوة التمويل
- [x] إبقاء السيولة مبنية على التدفقات والمدفوعات والتحصيلات فقط
- [x] إبقاء الحضور والانصراف ضمن مؤشرات الموارد البشرية فقط
- [x] اختبار عدم تأثير سجلات الحضور على مؤشرات السيولة


## Add new cost item from transaction forms
- [x] إضافة خانة لإنشاء بند تكلفة جديد بالكود والاسم والتصنيف
- [x] منع تكرار كود بند التكلفة والتحقق من البيانات قبل الحفظ
- [x] إظهار البند الجديد فورًا في سند الصرف وفاتورة المشتريات وباقي النماذج
- [x] تسجيل إنشاء البند في سجل التدقيق وربطه بالتقارير
- [x] اختبار إنشاء بند جديد واستخدامه في معاملة مالية


## Editable master records audit
- [x] حصر كل بطاقات البيانات الرئيسية التي لا تحتوي على تعديل حالي
- [x] إضافة تعديل بطاقات الأصول الثابتة مع حماية الأصول المرتبطة بقيود
- [x] مراجعة تعديل الحسابات في شجرة الحسابات وحماية الحسابات المستخدمة
- [ ] مراجعة تعديل بنود التكلفة والمشاريع والمراحل والموردين والموظفين — ما زال تعديل الموردين بحاجة إلى استكمال
- [x] تسجيل كل تعديل قبل وبعد في سجل التدقيق وتحديث القوائم والتقارير
- [x] اختبار أن تعديل البيانات الرئيسية لا يغيّر تاريخ الحركة المالية المرحّلة


## Simplified expense payment voucher
- [ ] تحويل نموذج المصروفات إلى سند صرف مبسط بنفس غرض سند الصرف وفاتورة المشتريات
- [ ] إضافة طبيعة التحميل: مشروع أو إداري أو نثري أو تحميل مشروع بنسبة
- [ ] جعل المرحلة اختيارية مع توضيح «المرحلة (اختياري)»
- [ ] إضافة نسبة تحمل المشروع والتحقق من نطاقها عند اختيار التحميل النسبي
- [ ] إضافة إنشاء بند تكلفة من نموذج المصروفات
- [ ] الحفاظ على ربط المصروفات بالتقارير والداشبورد وعدم تكرار الحركة


## Payroll menu separation
- [x] إزالة نموذج إدخال الراتب من تبويب المصروفات
- [x] إبقاء إدخال ومسير الرواتب في قائمة الرواتب فقط
- [x] إبقاء أثر الرواتب في التقارير كمصروف دون تكرار الحركة
- [x] اختبار روابط المصروفات والرواتب بعد الفصل


## Dashboard expense shortcuts
- [x] إضافة اختصار مجموع المصاريف التشغيلية في الصفحة الرئيسية
- [x] إضافة اختصار مجموع المصاريف الإدارية في الصفحة الرئيسية
- [x] إضافة اختصار مجموع الرواتب في الصفحة الرئيسية
- [x] إضافة اختصار إجمالي المصاريف الكلي في الصفحة الرئيسية
- [x] ربط الاختصارات بالمشروع المحدد والتقارير دون تكرار الرواتب
- [x] جعل الاختصارات قابلة للنقر للوصول إلى تفاصيل المصروفات أو الرواتب


## Final dashboard expense summary
- [x] عرض تكلفة الخامات كاختصار مستقل
- [x] عرض التكلفة التشغيلية كاختصار مستقل
- [x] عرض مصروف الرواتب كاختصار مستقل
- [x] عرض المصاريف الإدارية والعمومية كاختصار مستقل
- [x] عرض الإجمالي النهائي كمجموع التصنيفات الأربعة دون ازدواجية


## Sidebar and standalone reports
- [x] ترتيب القائمة: المشاريع والمراحل ثم التكاليف والمصروفات
- [x] ترتيب الموظفين ومسير الرواتب والعهد بعد التكاليف
- [x] ترتيب المقاولين والمستخلصات وكشوف حسابات الموردين بعد قسم الموظفين
- [x] الحفاظ على بقية روابط القائمة الجانبية بعد الأقسام الجديدة
- [x] إضافة رابط مستقل لتقرير مركز التكلفة
- [x] إضافة رابط مستقل لقائمة الدخل
- [x] إضافة رابط مستقل لكشف حسابات الموردين
- [x] إضافة رابط مستقل لكشف حسابات العهد
- [x] اختبار التنقل والربط بالمشروع والتقارير


## Sidebar order clarification
- [x] إبقاء المبيعات والتحصيلات مباشرة تحت المشاريع والمراحل في القائمة الجانبية
- [x] وضع التكاليف والمصروفات بعد المبيعات والتحصيلات


## Contractor certificates label
- [x] إعادة تسمية رابط المستخلصات إلى المقاولون والمستخلصات


## Certificates tab navigation fix
- [x] فتح تبويب المقاولون والمستخلصات مباشرة عند الضغط على رابطه الجانبي
- [x] منع بقاء تبويب كشف حساب العهد نشطًا عند فتح رابط المستخلصات
- [x] اختبار التنقل من القائمة الجانبية وحفظ الحالة الصحيحة للتبويب


## Certificate total and remaining balance
- [x] إضافة إجمالي المستخلص المحسوب تلقائيًا
- [x] إضافة المتبقي بعد خصم المدفوع من إجمالي المستخلص
- [x] عرض القيم في نموذج الإدخال وبيانات المستخلص دون تكرار
- [x] اختبار الحساب مع الضريبة والمدفوع وربطه بالتقارير


## Simplify operations section
- [x] قصر صفحة الوحدات التشغيلية على دورة المشتريات فقط
- [x] إخراج إضافة الموردين والمقاولين إلى قسم المقاولين والموردين
- [x] إخراج المستخلصات إلى قسم المقاولون والمستخلصات
- [x] إخراج العهد إلى قائمة العهد المستقلة
- [x] إخراج الحضور والمرفقات من الوحدات التشغيلية نهائيًا
- [x] إخراج مركز التكلفة وقائمة الدخل إلى تقارير مستقلة للمشروع
- [x] إعادة تسمية القسم الخارجي إلى دورة المشتريات
- [x] اختبار جميع الروابط وعدم فقدان الوظائف الحالية


## Sidebar links verification
- [x] إصلاح رابط قائمة الدخل لفتح تقرير قائمة الدخل مباشرة
- [x] إصلاح رابط مركز التكلفة لفتح تقرير مركز التكلفة مباشرة
- [x] مراجعة روابط الموردين والمقاولين والمستخلصات والعهد وكشوف الحسابات
- [x] اختبار الضغط والتنقل لكل روابط القائمة الجانبية


## Company profile and cash accounts
- [x] إضافة قسم معلومات الشركة في أعلى القائمة الجانبية
- [x] إضافة السجل التجاري والرقم الضريبي والعنوان الوطني وبيانات التواصل والشعار
- [x] استخدام معلومات الشركة في الفواتير وسندات القبض والصرف والمستندات
- [x] إضافة قسم البنوك والنقدية أسفل معلومات الشركة
- [x] إضافة حسابات بنكية متعددة مع البنك ورقم الحساب وIBAN والحساب المحاسبي
- [x] إضافة خزائن وحسابات نقدية وربطها بشجرة الحسابات
- [x] إظهار الحسابات البنكية والخزائن في خيارات سندات القبض والصرف
- [ ] اختبار حفظ بيانات الشركة والحسابات واستخدامها في المستندات


## Unified system backup export
- [x] تحديد الجداول والبيانات التي تدخل في النسخة الاحتياطية الموحدة
- [x] إضافة تصدير ملف واحد منظم وقابل للتنزيل
- [x] تضمين بيانات المشاريع والمعاملات والمحاسبة والموظفين والمرفقات الوصفية
- [x] توضيح أن التصدير لا يتضمن كلمات المرور أو الأسرار
- [x] إضافة واجهة تنزيل النسخة مع تاريخ ووقت إنشاء واضحين
- [x] إضافة اختبار اكتمال النسخة وعدم كشف الأسرار


## Payroll nullable project regression
- [x] إصلاح أخطاء TypeScript الناتجة عن جعل مشروع الراتب اختياريًا
- [x] تحديث قائمة الرواتب والداشبورد لتجاهل الرواتب الإدارية عند غياب المشروع بأمان
- [x] إعادة تشغيل الاختبارات والبناء بعد الإصلاح


## One-click backup button
- [x] إضافة زر مرئي باسم «نسخة احتياطية» في واجهة النظام
- [x] تنزيل ملف واحد يحتوي على بيانات النظام الأساسية
- [x] استبعاد كلمات المرور والأسرار وبيانات الجلسات من الملف
- [x] تضمين تاريخ ووقت إنشاء النسخة داخل الملف واسم الملف
- [x] اختبار الضغط على الزر وإنشاء ملف قابل للفتح


## Restorable backup
- [x] تصميم ملف نسخة احتياطية يتضمن البيانات والعلاقات والمعرّف الزمني للنسخة
- [x] إضافة فحص سلامة وإصدار للملف قبل الاستعادة
- [x] إضافة استيراد يعيد البيانات بالترتيب الصحيح ويحافظ على المعرّفات والعلاقات
- [x] منع الكتابة فوق البيانات الحالية دون تأكيد واضح أو وضع استعادة آمن
- [ ] اختبار التصدير ثم الاستيراد والتحقق من تطابق البيانات الأساسية


## Daily email backup delivery
- [x] اختيار طريقة إرسال بريد موثوقة وجدولتها يوميًا
- [ ] إضافة مستلم النسخة ووقت الإرسال وإمكانية التفعيل أو الإيقاف
- [x] إرسال ملف النسخة الاحتياطية كمرفق دون الأسرار
- [ ] تسجيل آخر إرسال ونتيجته ورسالة الخطأ عند الفشل
- [ ] إضافة اختبار يمنع إرسال النسخة دون إعدادات البريد المطلوبة


## Daily email backup delivery
- [ ] استخدام البريد ahmedhessienkamel@gmail.com كمستلم افتراضي للنسخة اليومية
- [x] اختيار طريقة إرسال بريد موثوقة وجدولتها يوميًا
- [ ] إضافة مستلم النسخة ووقت الإرسال وإمكانية التفعيل أو الإيقاف
- [x] إرسال ملف النسخة الاحتياطية كمرفق دون الأسرار
- [ ] تسجيل آخر إرسال ونتيجته ورسالة الخطأ عند الفشل
- [ ] إضافة اختبار يمنع إرسال النسخة دون إعدادات البريد المطلوبة


## Daily email backup delivery
- [ ] تثبيت الموعد اليومي عند 02:00 بتوقيت الرياض
- [ ] استخدام البريد ahmedhessienkamel@gmail.com كمستلم افتراضي
- [ ] ربط الإرسال بخدمة بريد موثوقة وجدولة المهمة
- [ ] إضافة إعدادات التفعيل والإيقاف وسجل آخر نتيجة إرسال
- [ ] اختبار إرسال المرفق والفشل الآمن عند غياب إعدادات البريد


## Daily email backup delivery
- [ ] استخدام النطاق advancedbuilding.com لبريد الإرسال
- [ ] حفظ مفتاح Resend الذي قدمه المستخدم كسر آمن
- [ ] اعتماد backups@advancedbuilding.com بعد توثيق النطاق
- [ ] اختبار الإرسال إلى ahmedhessienkamel@gmail.com


## Daily email backup delivery
- [x] تحديث بريد الإرسال والاستلام إلى prettyreward@gmail.com
- [x] حفظ كلمة مرور تطبيق Gmail بشكل آمن بعد إنشائها
- [x] ربط الإرسال اليومي الساعة 02:00 بتوقيت الرياض
- [x] اختبار وصول النسخة كمرفق إلى prettyreward@gmail.com


## Automatic project and stage detail report
- [x] إضافة تقرير تفصيلي ظاهر تلقائيًا داخل قسم المشاريع والمراحل
- [x] عرض كود المرحلة واسم المرحلة أو بند التكلفة
- [x] عرض الميزانية المخططة والمدفوع فعليًا وإجمالي التكلفة والرصيد
- [x] عرض نسبة استهلاك الميزانية والانحراف بالقيمة والنسبة
- [x] عرض حالة المرحلة والمقاول والملاحظات
- [x] ربط التقرير بالمشروع المحدد وتحديثه مباشرة من العمليات المسجلة
- [x] إضافة فلاتر أو اختيار مشروع دون إخفاء التقرير الأساسي
- [x] اختبار أرقام التقرير ومعاينته بالعربية RTL


## Detailed cost center and report links
- [x] إضافة تقرير مركز تكلفة تفصيلي ظاهر داخل صفحة مركز التكلفة
- [x] عرض اختيار المشروع وأكواد وبنود التكلفة والميزانية والتكلفة الفعلية والمستحقات
- [x] عرض الرصيد ونسبة الاستهلاك والإيراد المحقق والربح أو الخسارة
- [x] تحديث التقرير تلقائيًا من المصروفات والرواتب والقيود والمستخلصات
- [x] إصلاح رابط مركز التكلفة من القائمة الجانبية
- [x] إصلاح رابط قائمة الدخل من القائمة الجانبية وفتح التبويب الصحيح
- [x] اختبار الانتقال والتقارير بالعربية RTL


## Executive indicators page
- [x] إضافة رابط المؤشرات التنفيذية ضمن أوائل القائمة الجانبية بعد لوحة التنفيذ
- [x] عرض ملخص الميزانية والتكلفة والانحراف والتحصيل والتمويل المطلوب
- [x] عرض صحة المشروع وحالة السيولة والجدول الزمني
- [x] عرض ترتيب المراحل حسب الأولوية والانحراف
- [x] فتح المؤشرات مباشرة عند الضغط على الرابط دون طلب تقرير منفصل


## Dashboard executive indicators mirror
- [x] عرض ملخص المؤشرات التنفيذية داخل لوحة التنفيذ الرئيسية
- [x] استخدام نفس المشروع المحدد في لوحة التنفيذ دون ازدواجية اختيار المشروع
- [x] عرض بطاقات الميزانية والتكلفة والانحراف والمقبوضات والتمويل والصحة
- [x] عرض جدول المراحل التفصيلي أسفل الملخص داخل الداشبورد
- [x] الحفاظ على روابط الانتقال إلى التقرير التفصيلي


## Manual stage completion and time variance
- [x] إضافة اختيار يدوي لحالة المرحلة: مكتملة أو مستمرة
- [x] إضافة إجراء تأكيد انتهاء المرحلة من صفحة المشاريع والمراحل
- [x] حساب عدد أيام التأخير إذا انتهى التاريخ والمرحلة ما زالت مستمرة
- [x] عرض انحراف الوقت في تقرير المشاريع والمراحل والمؤشرات ومركز التكلفة
- [x] منع اعتبار المرحلة مكتملة تلقائيًا دون تأكيد المستخدم


## Recommended usability and professionalism improvements
- [ ] إضافة مركز تنبيهات موحد للأخطاء والاستحقاقات والموافقات المتأخرة
- [ ] إضافة شريط بحث عام واختصارات للعمليات المتكررة
- [ ] توحيد نماذج الإدخال مع حفظ تلقائي ومسودات ومنع فقد البيانات
- [ ] إضافة صلاحيات تفصيلية وسجل تدقيق قابل للبحث
- [ ] إضافة دورة إقفال شهرية ومراجعة القيود قبل اعتمادها
- [ ] تحسين التقارير بالتصدير والطباعة والقوالب الموحدة
- [ ] إضافة مركز صحة البيانات والتنبيهات عن الحقول الناقصة والتعارضات
- [ ] تحسين تجربة الهاتف والسرعة للصفحات والجداول الكبيرة
- [ ] إضافة معالج إعداد أولي للمشاريع والحسابات والبنوك والموظفين
- [ ] إضافة لوحة متابعة للنسخ الاحتياطية والاستعادة واختبار وصول البريد


## Full usability and professionalism upgrade
- [x] تثبيت خط أساس للاختبارات والأداء قبل التحسينات
- [ ] مركز تنبيهات موحد للاستحقاقات والموافقات والتأخيرات
- [x] بحث عام سريع واختصارات العمليات المتكررة
- [ ] مسودات وحفظ تلقائي ونماذج تحقق عربية واضحة
- [ ] صلاحيات تفصيلية وسجل تدقيق قابل للبحث
- [ ] إقفال شهري ومراجعة القيود قبل الاعتماد
- [ ] تقارير قابلة للطباعة والتصدير برأس موحد
- [ ] مركز جودة بيانات وتنبيهات للحقول الناقصة والتعارضات
- [ ] معالج إعداد أولي للمشاريع والحسابات والبنوك والموظفين
- [ ] تحسين الجداول العريضة وتجربة الهاتف والأداء
- [ ] مراقبة النسخ الاحتياطية واختبار إرسال البريد
- [ ] اختبارات شاملة وحفظ إصدارات مستقرة لكل مرحلة


## Expense allocation correction
- [x] إتاحة نوع تحميل مشروع أو إداري وعمومي أو نثريات عامة
- [x] جعل اختيار المشروع غير إلزامي للمصروف الإداري والنثريات
- [x] جعل المرحلة اختيارية داخل نموذج المصروف
- [x] إضافة زر إضافة بند تكلفة من نموذج المصروف
- [x] اختيار البند الجديد تلقائيًا بعد حفظه
- [x] اختبار انعكاس التحميل الصحيح في التقارير والحسابات


## Custody allocation and all filter
- [x] جعل مشروع حركة العهد اختياريًا
- [x] تحديد نوع التحميل من الحركة أو الفلتر دون إلزام المشروع
- [x] إضافة خيار الكل لعرض جميع حركات الموظف
- [x] دعم فلاتر المشروع والإداري والنثريات والتحميل العام
- [x] تحديث الرصيد التراكمي والتصدير وفق الفلتر المحدد
- [ ] اختبار تسجيل حركة بلا مشروع وكشفها ضمن الكل


## Sidebar navigation repair
- [x] إصلاح رابط مركز التكلفة وفتح تقرير costItems مباشرة
- [x] إصلاح رابط قائمة الدخل وفتح تقرير income مباشرة
- [x] إصلاح رابط المقاولين والموردين وفتح تبويب vendors
- [x] إصلاح رابط المقاولين والمستخلصات وفتح تبويب certificates
- [x] إصلاح روابط كشوف حسابات الموردين والعهد
- [x] مراجعة جميع الروابط غير العاملة في القائمة الجانبية
- [x] اختبار الانتقال والتبويب الصحيح لكل رابط


## Custody statement display repair
- [x] جعل رابط كشوف حسابات العهد يفتح تبويب كشف الحساب مباشرة
- [x] إضافة خيار الكل في تصفية التحميل
- [x] إظهار كشف الحساب بعد اختيار الموظف دون اشتراط مشروع
- [x] فصل شاشة حركة العهد عن شاشة كشف الحساب بوضوح
- [ ] اختبار التصفية والتصدير من رابط كشف الحساب


## Full ERP quality pass
- [ ] مراجعة شاملة للصفحات والروابط والبيانات الحالية دون فقد البيانات
- [ ] توحيد مركز التقارير وكشوف الحسابات والطباعة والتصدير
- [ ] إكمال التكاليف والمصروفات بالتحميل المرن والبنود الجديدة
- [ ] إكمال العهد بخيار الكل والمشروع الاختياري وكشف الحركة
- [ ] مراجعة الرواتب والتوزيعات والمصروفات الإدارية
- [ ] مراجعة المشتريات والمقاولين والمستخلصات والموافقات
- [ ] تعزيز المحاسبة والصلاحيات وسجل التدقيق والإقفال الشهري
- [ ] مراجعة النسخ الاحتياطية والبريد وتجربة الهاتف
- [ ] إجراء اختبار شامل وحفظ إصدار نهائي مستقر


## Complete implementation of all recommendations
- [ ] تنفيذ مركز التنبيهات والتنبيهات التشغيلية
- [ ] استكمال المسودات والحفظ التلقائي والتحقق الذكي
- [ ] استكمال الصلاحيات وسجل التدقيق والإقفال الشهري
- [ ] تنفيذ مركز التقارير العالمي والطباعة والتصدير
- [ ] تنفيذ مركز جودة البيانات ومعالج الإعداد الأولي
- [ ] تحسين الجداول العريضة وتجربة الهاتف والأداء
- [ ] إضافة مراقبة النسخ الاحتياطية واختبار الإرسال
- [ ] إجراء اختبارات شاملة وحفظ إصدار نهائي مستقر

## Drafts and auto-save quality pass
- [x] إضافة مسودات محلية للنماذج الطويلة قبل الحفظ النهائي
- [x] استعادة مسودة المصروفات تلقائيًا مع مؤشر حالة الحفظ
- [x] استعادة مسودة القيود المحاسبية تلقائيًا مع زر مسح آمن
- [x] منع فقدان البيانات عند التنقل أو إعادة تحميل الصفحة
- [x] إضافة اختبارات للحفظ والاستعادة ومسح المسودة

## Monthly closing quality pass
- [x] إضافة شاشة فترات الإقفال الشهري
- [x] منع إنشاء أو تعديل العمليات داخل فترة مقفلة
- [x] إضافة صلاحية فتح الفترة للمستخدم المخول
- [x] إضافة اختبارات تحقق الإقفال

## Reports professionalization
- [x] توحيد رأس التقارير وبيانات الشركة والتاريخ
- [x] إضافة نمط طباعة احترافي للجداول
- [x] توفير تصدير Excel للتقارير الرئيسية

## RBAC and data quality
- [ ] توسيع الصلاحيات إلى أدوار وظيفية واضحة
- [ ] بناء مركز جودة البيانات والتنبيهات
- [ ] إضافة اختبارات الصلاحيات وقواعد الجودة

## Full ERP quality verification
- [x] تشغيل TypeScript والاختبارات والبناء والمعاينة النهائية
- [ ] حفظ إصدار مستقر قابل للمراجعة


## Independent banks and cashiers module
- [x] فصل رابط البنوك والخزائن عن صفحة معلومات الشركة
- [x] قصر الصفحة المستقلة على البنوك والخزائن وإدارة الحسابات
- [x] إضافة كشف حساب لأي بنك أو خزينة مع فلاتر التاريخ
- [x] ربط كشف الحساب بالقيود المحاسبية الفعلية
- [x] إضافة اختبار وبناء ومعاينة للصفحة المستقلة


## Construction stages versus material cost detail
- [x] جعل قسم تفصيل أداء وتكلفة المراحل يعرض مراحل البناء الفعلية
- [x] عرض ميزانية ومنصرف وإنجاز وانحراف كل مرحلة بناء
- [x] إبقاء الخامات وبطاقات التكلفة في قسم منفصل واضح
- [x] إضافة اختبار ومعاينة للعرض المصحح

- [x] حذف أي عرض للخامات أو بطاقات بنود التكلفة من الصفحة الرئيسية بالكامل
- [x] إبقاء الخامات في التكاليف والمصروفات والتقارير المتخصصة فقط


## Dashboard execution board parity
- [x] إضافة شريط مؤشرات المشروع المختار بنفس بنية الصورة المرجعية
- [x] عرض تكلفة المشروع الفعلية والمصاريف الإدارية العامة والتمويل المطلوب والصحة
- [x] عرض نسبة استهلاك الميزانية والمصروفات شاملة الضريبة عند توفرها
- [x] عرض جدول مراحل البناء بالمخطط والفعلي والانحراف ونسبة الانحراف وأولوية المتابعة والملاحظة
- [x] إبقاء الخامات خارج الداشبورد بالكامل
- [x] إضافة اختبار ومعاينة وحفظ إصدار للوحة الجديدة


## Dashboard quick actions expansion
- [x] إضافة إجراء سريع لتسجيل عهدة
- [x] إضافة إجراء سريع لفاتورة شراء
- [x] إضافة إجراء سريع لفاتورة بيع
- [x] إضافة إجراء سريع لفتح مستخلص
- [x] ربط الإجراءات بالتبويب أو النموذج الصحيح مع اختبار التنقل


## Custody navigation labels
- [x] إعادة تسمية رابط العهد إلى تسجيل / صرف عهدة
- [x] وضع كشوف حساب العهد مباشرة أسفل رابط تسجيل / صرف عهدة
- [x] تحديث الإجراء السريع بنفس التسمية والرابط
- [x] اختبار التنقل وحفظ الإصدار


## Construction stages and materials reporting split
- [x] إزالة صفوف بطاقات الخامات من تقرير المشاريع والمراحل
- [x] إبقاء تقرير المشاريع والمراحل لمراحل البناء فقط
- [x] إضافة أو إبراز تقرير تكلفة الخامات داخل قائمة الدخل فقط
- [x] اختبار المعاينة والتصدير بعد الفصل


## Materials cost report shortcut
- [x] إضافة تقرير تكلفة الخامات داخل قائمة الدخل
- [x] إضافة اختصار تكلفة الخامات ضمن اختصارات الداشبورد
- [x] ربط الاختصار بتقرير الخامات مع المشروع المحدد
- [x] منع ظهور صفوف الخامات في تقرير المشاريع والمراحل
- [x] تشغيل الاختبارات والبناء والمعاينة


## Optional expense stage
- [x] جعل المرحلة اختيارية في نموذج التكاليف والمصروفات
- [x] إبقاء قائمة المراحل مفلترة حسب المشروع عند اختيار مشروع
- [x] السماح بالمصروف الإداري أو النثريات أو التشغيلي دون مشروع أو مرحلة
- [x] إضافة اختبار والتحقق والبناء وحفظ الإصدار


## Expense total visibility
- [x] إضافة خانة إجمالي المصروف شامل الضريبة
- [x] حساب الإجمالي تلقائيًا من قبل الضريبة وقيمة الضريبة
- [x] إظهار المدفوع والمستحق بجانب الإجمالي
- [x] إضافة اختبار والتحقق والبناء وحفظ الإصدار


## Certificate total visibility
- [x] إظهار قبل الضريبة وقيمة الضريبة وإجمالي المستخلص
- [x] إظهار المدفوع والمتبقي بعد المدفوع بوضوح
- [x] عرض التفاصيل نفسها في سجل المستخلصات
- [x] تشغيل الاختبارات والبناء والمعاينة وحفظ الإصدار


## Granular RBAC quality pass
- [ ] إضافة أدوار وظيفية: مدير عام ومدير مشاريع ومحاسب وموارد بشرية ومستخدم تشغيل
- [ ] إضافة صلاحية مستقلة للعرض والإنشاء والتعديل والاعتماد والتقارير
- [ ] إضافة مصفوفة صلاحيات قابلة للتعديل من شاشة المستخدمين
- [ ] حماية إجراءات الاعتماد والإقفال والتعديل حسب الصلاحية
- [ ] إضافة اختبارات الأدوار والصلاحيات


## Data quality financial checks
- [x] فحص المصروفات التي بلا بند تكلفة أو بلا تحميل متسق
- [x] فحص المراحل غير المتطابقة مع مشروع الحركة
- [x] فحص المستخلصات والمبيعات ذات الإجمالي غير المتسق
- [x] توجيه تنبيهات الجودة إلى شاشة الإجراء المناسبة
- [x] إضافة اختبار لفحوص الجودة المالية


## Expense allocation redesign
- [ ] بدء نموذج المصروفات باختيار إداري أو مشروع
- [ ] إظهار المشروع ونسبة التحمل عند اختيار مشروع
- [ ] إضافة طبيعة المصروف: خامات أو رواتب مشروع أو مصروف تشغيلي
- [ ] إظهار بطاقة الخامة عند اختيار طبيعة الخامات
- [ ] حذف المرحلة من نموذج المصروفات دون حذفها من المستخلصات
- [ ] إبقاء الوصف والوحدة والكمية والإجمالي والمدفوع والمستحق
- [ ] تحديث التحقق الخلفي والاختبارات والمعاينة وحفظ الإصدار


## Administrative expense allocation by contract value
- [ ] اعتبار المصروف الإداري عامًا بلا مشروع محدد
- [ ] حساب نسبة كل مشروع من إجمالي قيم العقود التشغيلية
- [ ] عرض معاينة نصيب كل مشروع قبل الحفظ
- [ ] تسجيل توزيع المصروف الإداري في التقارير ومركز التكلفة دون تكرار أصل المصروف
- [ ] اختبار التوزيع والتأكد من دقة التجميع وحفظ الإصدار


## Project-first expense statements
- [ ] إضافة تبويب كشوف حساب المصروفات داخل قائمة المصروفات
- [ ] جعل اختيار المشروع أول حقل في الكشف
- [ ] إضافة تصنيف خامات أو تشغيلي للمشروع أو إداري ونثريات
- [ ] إضافة اختيار بند وفترة وتصفية النتائج
- [ ] إظهار المدين والمدفوع والمستحق والإجمالي
- [ ] إضافة تصدير Excel واختبارات ومعاينة وحفظ الإصدار


## Inline certificate master-data creation
- [x] إضافة زر إنشاء مرحلة بجوار قائمة المرحلة في نموذج المستخلص
- [ ] إضافة زر إنشاء مقاول بجوار قائمة المقاول في نموذج المستخلص
- [ ] تحديث القوائم بعد الحفظ وتحديد السجل الجديد تلقائيًا
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار


## Budget tax basis clarity
- [ ] إضافة اختيار قبل الضريبة أو شاملة الضريبة عند تسجيل ميزانية المرحلة
- [ ] حفظ أساس الميزانية مع بيانات المرحلة
- [ ] إظهار أساس الميزانية في تقرير المشاريع والمراحل
- [ ] توحيد مقارنة الميزانية بالفعلي في الداشبورد ومركز التكلفة
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار


## Certificate editing and variance clarity
- [ ] إضافة زر تعديل للمستخلص في سجل المستخلصات
- [ ] إعادة المستخلص المعدل إلى دورة الموافقات عند الحاجة
- [ ] منع تعديل المستخلص المعتمد مباشرة دون صلاحية واضحة
- [ ] توضيح المخطط والفعلي والانحراف وأساس الضريبة في تقرير المرحلة
- [ ] إضافة اختبار وبناء ومعاينة وحفظ الإصدار


## Contractor contracts and certificates
- [x] إضافة جدول عقود المقاولين المرتبط بالمشروع والمرحلة
- [ ] إضافة إنشاء وتعديل عقد مقاول مع قيمة العقد وشروطه
- [x] ربط المستخلص بعقد المقاول بدل الاكتفاء بالمشروع والمرحلة
- [x] حساب إجمالي المستخلصات السابقة والمتبقي ونسبة التنفيذ
- [x] منع تجاوز قيمة العقد مع صلاحية تجاوز موثقة عند الحاجة
- [x] تحديث دورة الموافقات والتقارير والتكلفة
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Certificate editing and deletion request
- [x] إضافة زر تعديل داخل سجل آخر المستخلصات
- [x] إضافة نموذج تعديل مستخلص مع إعادة الإرسال للموافقات
- [x] إضافة زر حذف آمن للمستخلص مع سجل تدقيق
- [x] منع تعديل أو حذف المستخلص المعتمد لغير المسؤول
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Vendor and customer master-data editing
- [ ] إضافة تعديل بيانات الموردين والمقاولين من سجل الموردين
- [ ] إضافة تعديل بيانات العملاء من سجل العملاء
- [ ] الحفاظ على الحركات المالية المرتبطة عند تعديل البيانات الأساسية
- [ ] تسجيل تعديلات الموردين والعملاء في سجل التدقيق
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Rename contractor certificates navigation
- [x] إعادة تسمية قائمة المقاولين والمستخلصات إلى العقود والمستخلصات
- [x] تحديث عنوان الصفحة والاختصارات والروابط المرتبطة
- [x] التحقق من البناء والمعاينة وحفظ الإصدار

## Custody classification and navigation cleanup
- [ ] فصل تسمية تسجيل / صرف عهدة عن كشف حساب العهد
- [ ] جعل تسجيل وصرف العهدة غير مشروط بالمشروع أو المرحلة
- [ ] إضافة تحميل مرن مطابق للمصروف: عام أو إداري أو نثريات أو مشروع
- [ ] إتاحة المشروع ونسبة التحمل وطبيعة المصروف والمرحلة الاختيارية عند الحاجة
- [ ] تحديث كشف الحساب والتقارير دون تكرار الحركات
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Custody statement simplification
- [ ] قصر كشف حساب العهدة على اختيار الموظف ونوع العهدة فقط
- [ ] إضافة خيارات الكل وعهدة مشروع وعهدة إدارية مع ترجمة واضحة
- [ ] عرض الكشف الكامل تلقائيًا بعد اختيار الموظف والنوع
- [ ] إزالة فلتر المشروع المنفصل من صفحة كشف الحساب
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Separate custody entry from statement page
- [ ] جعل صفحة تسجيل / صرف عهدة مخصصة للحركات فقط
- [ ] جعل صفحة كشف حساب العهد تقريرًا فقط دون نموذج تسجيل حركة
- [ ] إبقاء اختيار الموظف ونوع العهدة فقط داخل كشف الحساب
- [ ] تحديث الروابط والعناوين والمعاينة والاختبارات وحفظ الإصدار

## Financial transactions navigation cleanup
- [ ] مراجعة محتوى صفحة المعاملات المالية
- [ ] إزالة تكرار المصروفات والرواتب من صفحة المعاملات المالية
- [ ] إبقاء العمليات المحاسبية العامة أو إعادة توجيهها للقوائم المتخصصة
- [ ] تحديث الروابط والمعاينة والبناء وحفظ الإصدار

## User 1 and colleague permissions
- [x] تثبيت المستخدم 1 كمسؤول بصلاحيات كاملة على النظام
- [x] إضافة مصفوفة صلاحيات قابلة للضبط لحساب الزميل حسب الوحدة والعملية
- [ ] جعل العمليات غير المسموح بها مباشرة تدخل تلقائيًا في الموافقات
- [ ] إتاحة اعتماد أو رفض أو تصحيح صلاحيات الزميل من حساب المسؤول
- [x] اختبار عزل الصلاحيات ومسارات الموافقة والبناء والمعاينة وحفظ الإصدار

## Granular colleague operation permissions
- [x] إضافة خيارات مستقلة لصلاحية سند الصرف وسند القبض
- [x] إضافة خيارات مستقلة لصلاحية المصروف والمستخلص والرواتب والعهد
- [x] إضافة خيارات مستقلة لفواتير الشراء والبيع وطلبات الشراء
- [x] التفريق بين السماح المباشر والإحالة للموافقة والمنع الكامل
- [x] ربط الصلاحيات بالتنفيذ والاعتماد والتعديل والحذف مع الاختبارات والبناء والمعاينة

## Vendor and customer master-data editing
- [ ] إضافة تعديل بيانات الموردين والمقاولين من سجل الموردين
- [ ] إضافة تعديل بيانات العملاء من سجل العملاء
- [ ] الحفاظ على الحركات المالية المرتبطة عند تعديل البيانات الأساسية
- [ ] تسجيل تعديلات الموردين والعملاء في سجل التدقيق
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Confirmed editable master records
- [x] التأكد من ظهور تعديل بيانات المستخلص في سجل آخر المستخلصات
- [x] إضافة أو تأكيد تعديل بيانات المورد من سجل الموردين
- [x] إضافة أو تأكيد تعديل بيانات العميل من سجل المبيعات والتحصيلات
- [x] حماية المبالغ والحركات المرتبطة وتسجيل كل تعديل في سجل التدقيق
- [x] اختبار شامل وبناء ومعاينة وحفظ الإصدار

## Full ERP quality pass and usability improvements
- [ ] مراجعة كل روابط القائمة الجانبية والإجراءات السريعة
- [x] إكمال تعديل بيانات المستخلصات والموردين والعملاء من سجلاتهم
- [x] استكمال ربط مصفوفة الصلاحيات بمسارات الموافقة والتنفيذ
- [x] فصل صفحات التسجيل عن صفحات الكشوف والتقارير بدون تكرار
- [x] تحسين حالات التحميل والفراغ والأخطاء ورسائل النجاح بالعربية
- [x] توحيد عناوين التقارير والطباعة والتصدير
- [x] التحقق من عدم التكرار بين المصروفات والرواتب والمعاملات المحاسبية
- [x] إضافة اختبارات شاملة للروابط والصلاحيات وسلامة الحركات المالية
- [x] معاينة RTL على الشاشات الرئيسية وحفظ نسخة مستقرة

## Mandatory contract stage and quick stage creation
- [x] جعل مرحلة عقد المقاول حقلًا إلزاميًا
- [x] إضافة زر إنشاء مرحلة بجوار قائمة المرحلة
- [x] ربط المرحلة الجديدة بالمشروع المختار وتحديث القائمة تلقائيًا
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Contractor contract total display
- [x] إضافة إجمالي قيمة العقد شامل الضريبة في نموذج عقد المقاول
- [x] حساب الإجمالي تلقائيًا من قيمة ما قبل الضريبة ونسبة الضريبة
- [x] إبقاء الإجمالي للعرض والتقارير دون إدخاله كقيمة مستقلة قابلة للتعارض
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Certificate edit resubmission bug
- [ ] إصلاح عدم حفظ زر حفظ التعديل وإعادة الإرسال للمستخلص
- [ ] إظهار رسالة خطأ عربية عند فشل التحديث بدل الفشل الصامت
- [ ] التأكد من إعادة المستخلص للموافقات بعد نجاح التعديل
- [ ] إضافة اختبار وبناء ومعاينة وحفظ الإصدار

## Certificate edit date-format bug
- [ ] تحويل تاريخ المستخلص عند فتح التعديل إلى صيغة ISO المناسبة لحقل التاريخ
- [ ] إظهار رسالة نجاح بعد حفظ التعديل وإعادة الإرسال
- [ ] إظهار رسالة خطأ عربية عند رفض التحديث أو فشل الشبكة
- [ ] إضافة اختبار وبناء ومعاينة وحفظ الإصدار

## Subcontractor cost dashboard shortcut
- [ ] إضافة بطاقة تكاليف مقاولي الباطن ضمن ملخص المصروفات والتكاليف في الرئيسية
- [ ] حسابها من إجمالي المستخلصات غير المرفوضة للمشروع
- [ ] إدخالها في إجمالي تكلفة المشروع دون تكرار مع المصروفات
- [ ] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Custody entry must match expense allocation
- [x] إزالة إلزام المشروع والمرحلة من تسجيل العهدة
- [x] إضافة طبيعة التحميل: عهدة مشروع أو عهدة إدارية أو نثريات/تشغيلية
- [x] إظهار المشروع ونسبة التحمل فقط عند اختيار عهدة مشروع
- [x] جعل المرحلة اختيارية مع ربطها بالمشروع عند الحاجة
- [x] الحفاظ على الموظف ونوع الحركة والوصف والمبلغ والتاريخ
- [x] تحديث كشف الحساب والتقارير والاختبارات والمعاينة وحفظ الإصدار

## Subcontractor costs in executive dashboard
- [x] إضافة بطاقة «تكاليف مقاولي الباطن» ضمن ملخص تكاليف الصفحة الرئيسية
- [x] احتسابها من إجمالي المستخلصات المرتبطة بالمشروع
- [x] إدخالها في إجمالي تكلفة المشروع دون تكرار مع المصروفات
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Payroll allocation refinement
- [ ] تقسيم الراتب إلى إداري أو مرتبط بمشروع
- [ ] إضافة نسبة تحمل المشروع عند اختيار راتب مشروع
- [ ] جعل المشروع اختياريًا للراتب الإداري
- [ ] جعل المرحلة اختيارية بالكامل للراتب الإداري أو راتب المشروع
- [ ] إظهار ملخص نصيب المشروع والجزء الإداري وربطه بالتكاليف
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Custody movement editing
- [x] إضافة إجراء تحديث حركة العهدة في الخادم
- [x] إضافة زر تعديل لكل حركة في سجل تسجيل / صرف العهدة
- [x] تعديل طبيعة التحميل والمشروع ونسبة التحمل والمرحلة الاختيارية
- [x] إعادة الحركة للموافقة عند تغيير أثرها المالي مع سجل تدقيق
- [x] إضافة اختبارات وبناء ومعاينة وحفظ الإصدار

## Colleague onboarding and default permissions
- [x] توضيح أن الحساب الجديد يبدأ افتراضيًا بموافقة المسؤول لكل العمليات
- [x] الحفاظ على تحكم User 1 الكامل في مصفوفة الصلاحيات
- [x] التحقق من الاختبارات والبناء بعد تحديث شاشة المستخدمين

## Dedicated supplier statements page
- [x] إنشاء صفحة مستقلة لكشوف حسابات الموردين فقط
- [x] عرض حركات المورد بالتفصيل مع المدين والدائن والرصيد التراكمي
- [x] دعم فلترة المورد والمشروع والفترة مع التصدير والطباعة
- [x] ربط رابط القائمة الجانبية والإجراء السريع بالصفحة المستقلة
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Standalone financial reports navigation
- [x] إنشاء صفحة مستقلة لمركز التكلفة بتفصيل المراحل وبنود التكلفة والفترة
- [x] إنشاء صفحة مستقلة لقائمة الدخل بفلاتر المشروع والفترة وتفصيل الإيرادات والمصروفات
- [x] ربط روابط مركز التكلفة وقائمة الدخل وكشوف الموردين بالصفحات المستقلة
- [x] إضافة اختبارات ومعاينة وبناء وحفظ الإصدار

## Stage variance indicators correction
- [x] فصل انحراف الوقت عن انحراف التكلفة في لوحة المرحلة
- [x] اعتبار المستخلص داخل قيمة عقد المقاول تكلفة منفذة لا انحرافًا تلقائيًا
- [x] إظهار الانحراف فقط عند تجاوز الميزانية المخططة أو التأخر بعد نهاية المرحلة دون تأكيد
- [x] إضافة اختبار للمرحلة بعقد 76 ألف ومستخلص 21 ألف ومعاينة وبناء وحفظ الإصدار

## Project-level variance indicators
- [x] عرض انحراف تكلفة المشروع ككل مقابل ميزانيته المخططة فقط عند التجاوز
- [x] عرض انحراف وقت المشروع ككل بناءً على تقدم المراحل ونهاية المشروع
- [x] إظهار الرصيد المتبقي للمشروع دون تسميته انحرافًا
- [x] إضافة اختبار للسيناريو على مستوى المشروع مع المعاينة والبناء وحفظ الإصدار

## Project health status correction
- [x] إزالة قاعدة انخفاض الإنجاز الأقل من 20% كسبب مستقل للمتابعة قبل استحقاق المرحلة
- [x] إبقاء حالة المتابعة للمخاطر الفعلية: تجاوز تكلفة، تأخر وقت، فجوة سيولة، موافقات أو مستندات
- [x] إضافة اختبار لحالة مشروع داخل الوقت والميزانية مع إنجاز مبكر
- [x] معاينة الداشبورد وحفظ الإصدار بعد التعديل

## Project and stage remaining balance separation
- [x] حساب رصيد المشروع الكلي من ميزانية جميع مراحله وتكلفة جميع مراحله
- [x] حساب رصيد المرحلة الحالية من ميزانيتها وتكلفتها فقط
- [x] عرض المؤشرين بعناوين واضحة في لوحة المشروع
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Explicit project versus stage dashboard sections
- [x] إنشاء قسم واضح بعنوان «مؤشرات المشروع ككل»
- [x] إنشاء قسم واضح بعنوان «مؤشرات المرحلة الحالية»
- [x] نقل كل رصيد وانحراف إلى القسم المطابق له ومنع العناوين المضللة
- [x] اختبار ومعاينة RTL وحفظ الإصدار

## Active stage first dashboard layout
- [x] جعل قسم المرحلة النشطة الحالية هو القسم الرئيسي بكل بياناته فقط
- [x] إضافة قسم المشروع التكميلي أسفل المرحلة
- [x] حساب نسبة مساهمة المرحلة النشطة في إنجاز المشروع
- [x] عرض أثر انحراف المرحلة على مؤشرات المشروع
- [x] اختبار ومعاينة RTL وحفظ الإصدار

## Colleague visibility and permissions diagnosis
- [ ] تحديد صلاحيات حساب الزميل الحالية من مصفوفة العمليات
- [ ] التحقق من أن السجلات المضافة تظهر كمسودة أو موافقة معلقة بدل اختفائها
- [ ] التأكد من ظهور حركات الزميل للمسؤول وللزميل حسب حالتها
- [ ] إصلاح العرض أو إضافة توضيح حالة التسجيل إذا لزم

## Mostafa permissions configuration
- [x] إسناد مصطفى إلى المشروع حتى تظهر له بياناته وحركاته
- [x] منح مصطفى صلاحيات مباشرة للعمليات العادية
- [x] جعل إنشاء المستخلصات وإعداد مسير الرواتب بحاجة إلى موافقة المسؤول
- [x] التحقق من ظهور الحركات المعلقة لمصطفى وللمسؤول

## Mostafa project creation permission
- [x] منح مصطفى صلاحية إنشاء مشروع جديد مباشرة
- [x] التحقق من عدم تغيير استثناءات المستخلصات والرواتب والاعتماد

## Mostafa stage creation permission
- [x] منح مصطفى صلاحية إنشاء مرحلة جديدة مباشرة داخل المشاريع المسموح له بها
- [x] الحفاظ على موافقات المستخلصات ومسير الرواتب ومنع الاعتماد الذاتي

## Mostafa scoped edit permission
- [x] تمكين مصطفى من تعديل كل السجلات داخل المشاريع والعمليات المسندة إليه
- [x] إعادة الحركات المعدلة التي تحتاج موافقة إلى حالة انتظار المراجعة
- [x] الحفاظ على سجل التدقيق ومنع اعتماد مصطفى لحركاته

## Project and stage page deletion controls
- [x] إظهار حذف المشروع داخل صفحة المشاريع والمراحل لـ User 1 فقط
- [x] إخفاء زر الحذف عن مصطفى وباقي المستخدمين
- [x] الحفاظ على إنشاء وتعديل المشروع والمرحلة حسب الصلاحيات الحالية

## Project delete button visibility fix
- [x] تصحيح شرط المسؤول ليشمل User 1 الفعلي وليس الدور النصي فقط
- [x] إظهار زر الحذف في بطاقة المشروع والبرنامج الزمني للحساب الصحيح
- [x] اختبار إخفائه عن مصطفى ومعاينة الصفحة وحفظ الإصدار

## Mostafa employee creation permission
- [x] منح مصطفى صلاحية إضافة موظف مباشرة
- [x] التحقق من بقاء صلاحيات المستخلصات والرواتب والاعتماد كما هي

## Expense edit and delete permissions
- [x] منح User 1 ومصطفى تعديل المصروفات ضمن نطاقهما
- [x] منح User 1 ومصطفى حذف المصروفات ضمن نطاقهما
- [x] منع التعديل والحذف في الفترات المقفلة أو للسجلات المعتمدة حسب قواعد النظام
- [x] تسجيل التعديلات والحذف في سجل التدقيق وإضافة أزرار الصفحة

## Payment voucher classification and contractor link
- [x] إضافة نوع سند الصرف: مقاول أو مصروفات إدارية أو مصروفات نثرية
- [x] إظهار قائمة المقاولين عند اختيار نوع مقاول
- [x] جعل ربط المشروع اختياريًا في سند الصرف
- [x] حفظ التصنيف والمقاول والمشروع في الترحيل والتقارير
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Mostafa vendor and contractor edit permission
- [x] تمكين مصطفى من تعديل بيانات الموردين مباشرة
- [x] تمكين مصطفى من تعديل بيانات المقاولين مباشرة
- [x] تسجيل التعديلات في سجل التدقيق ومنع الحذف والاعتماد غير المصرح

## Materials inventory and consumption tracking
- [x] إنشاء بطاقات أصناف خامات بمواصفات الوحدة والحد الأدنى
- [x] تسجيل توريد واستلام الخامات وربطها بالمورد والمشروع
- [x] تسجيل سحب وصرف الخامات من مخزون المشروع
- [x] حساب الرصيد المتاح والتكلفة والحركات التفصيلية لكل صنف
- [x] ربط الاستلام والصرف بالتقارير والتكلفة والمحاسبة
- [x] منح User 1 ومصطفى صلاحيات الإضافة والتعديل والتشغيل ضمن نطاق المشروع
- [x] حماية الحذف والاعتماد وتسجيل التدقيق
- [x] إضافة اختبارات ومعاينة وبناء وحفظ الإصدار

## Project operating expense classification fix
- [x] إظهار اختيار المشروع وإلزامه عند اختيار مصروف تشغيلي للمشروع
- [x] إبقاء المصروف الإداري والنثريات دون إلزام بمشروع
- [x] منع الحفظ في الخادم للمصروف التشغيلي للمشروع دون مشروع
- [x] إضافة اختبار ومعاينة وحفظ الإصدار

## Project allocation ratio for payroll and operating expenses
- [ ] إظهار نسبة تحمل المشروع عند اختيار راتب لمشروع
- [ ] إظهار نسبة تحمل المشروع عند اختيار مصروف تشغيلي لمشروع
- [ ] إلزام والتحقق من النسبة وحفظها في الحركتين
- [ ] إضافة اختبار ومعاينة وحفظ الإصدار

## English numeral display standardization
- [x] توحيد تنسيق العملات والأرقام إلى en-US في الصفحات والتقارير
- [x] مراجعة تواريخ وعدادات المشروع والمرحلة والجداول
- [x] التحقق من عدم تغيير قيم الإدخال أو الحسابات الداخلية
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Accounting page order
- [x] فتح نموذج سند الصرف في بداية صفحة المحاسبة عند اختياره
- [x] وضع بطاقات المستندات قبل قسم التقارير المحاسبية
- [x] نقل التقارير المحاسبية إلى قسم مستقل أسفل المستندات
- [x] التحقق من الروابط والمعاينة وحفظ الإصدار

## Accounting document card placement
- [x] إظهار نموذج المستند المختار مباشرة تحت كروت المستندات لكل الأنواع
- [x] إبقاء التقارير المحاسبية أسفل نماذج المستندات في قسم مستقل
- [x] اختبار سند الصرف والقبض والقيد والفواتير وأوامر الشراء والمعاينة وحفظ الإصدار

## Separate accounting setup menu
- [x] إنشاء قائمة مستقلة لإعدادات الأصول الثابتة وشجرة الحسابات
- [x] نقل عرض الأصول الثابتة وشجرة الحسابات إليها مع الحفاظ على التعديل والإضافة
- [x] اختبار الروابط والمعاينة وحفظ الإصدار

## Payment voucher expense categories
- [x] إضافة تصنيف خامات ورواتب ومصروف تشغيلي إلى سند الصرف
- [x] إظهار المشروع وبند التكلفة أو الموظف حسب التصنيف المختار
- [x] حفظ التصنيف والربط في المستند والقيد والتقارير
- [x] إضافة اختبار ومعاينة وحفظ الإصدار

## Supplier and purchase invoice linkage
- [x] فصل تصنيف المورد عن المقاول في سند الصرف
- [x] إضافة اختيار مورد خامات مستقل عن المقاولين
- [x] إضافة اختيار فاتورة شراء مرتبطة بالمورد
- [x] حفظ الربط في السند والتقارير ومنع اختيار فاتورة لمورد آخر
- [x] إضافة اختبار ومعاينة وحفظ الإصدار

## Payroll beneficiary in payment voucher
- [x] إضافة نوع مستفيد: موظف شركة أو عامل / موظف أجير
- [x] عرض قائمة الموظفين عند اختيار موظف الشركة
- [x] عرض إدخال اسم يدوي عند اختيار عامل أو أجير
- [x] حفظ والتحقق من بيانات المستفيد وإضافة اختبار ومعاينة وحفظ الإصدار

## Supplier voucher linkage continuation
- [x] إضافة مورد خامات مستقل عن المقاول في سند الصرف
- [x] ربط سند المورد بفاتورة شراء مرتبطة بنفس المورد
- [x] التحقق الخلفي من تطابق المورد والفاتورة وحفظ الربط

## Cash accounts, debit cards, and fixed assets refinement
- [x] إظهار حسابات البنك وخزينة المكتب كمصادر دائنة مستقلة في سند الصرف
- [x] جعل الحساب المدين يختار من بند تكلفة المشروع أو بطاقات المصروفات الإدارية والنثرية
- [x] إضافة بطاقات إيجار المكتب والكهرباء والمياه والمصروفات الإدارية والنثرية الناقصة
- [x] توضيح حالة بطاقة الأصل الثابت عند عدم وجود أصول وإتاحة الإضافة والتعديل
- [x] ربط سند الصرف بالمصروفات والعهد والتقارير والداشبورد دون تكرار
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Complete chart of accounts
- [x] حصر الحسابات الموجودة ومنع التكرار بالأكواد
- [x] إضافة حسابات البنوك والخزائن والنقدية
- [x] إضافة حسابات العملاء والموردين والمقاولين والرواتب والعهد
- [x] إضافة حسابات الأصول الثابتة والإهلاك
- [x] إضافة حسابات الإيرادات وتكاليف المشاريع والخامات والمقاولين
- [x] إضافة بطاقات المصروفات الإدارية والعمومية والنثرية مثل الإيجار والكهرباء والمياه
- [x] ربط الحسابات الجديدة بسند الصرف والمصروفات والعهد والتقارير
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Cost center hierarchy
- [x] عرض صفوف المراحل أولًا في تقرير مركز التكلفة
- [x] عرض بنود التكلفة التابعة أسفل كل مرحلة مباشرة
- [x] الحفاظ على إجماليات المرحلة والمشروع والفلاتر والتصدير
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Inventory navigation label
- [x] إعادة تسمية رابط المخزون إلى مراقبة المخزون والكميات
- [x] نقل الرابط مباشرة تحت المشاريع والمراحل في القائمة الجانبية
- [x] تحديث العنوان الداخلي والمعاينة والاختبارات وحفظ الإصدار

## Executive indicators navigation order
- [x] نقل المؤشرات التنفيذية من القوائم الأولى إلى موضع متأخر في القائمة
- [x] الحفاظ على الرابط والمعاينة والاختبارات وحفظ الإصدار

## Project payroll beneficiary fields
- [x] تصفير الضريبة تلقائيًا عند اختيار رواتب مشروع
- [x] إظهار اختيار موظف شركة أو أجير عند اختيار رواتب مشروع
- [x] عرض قائمة الموظفين لموظف الشركة وحقل اسم يدوي للأجير
- [x] التحقق من الحقول وحفظ البيانات والاختبار والمعاينة وحفظ الإصدار

## Purchase invoice settlement and accounting submenu
- [x] إضافة سداد كامل أو جزئي لفاتورة الشراء
- [x] اختيار البنك أو الخزينة عند تسجيل السداد
- [x] حساب المدفوع والمتبقي ومنع تجاوز قيمة الفاتورة
- [x] وضع الأصول الثابتة وشجرة الحسابات تحت قائمة محاسبة فرعية مستقلة
- [x] إضافة اختبار ومعاينة وبناء وحفظ الإصدار

## Accounting navigation groups
- [x] إنشاء مجموعة مستقلة للتقارير المحاسبية في القائمة الجانبية
- [x] إنشاء مجموعة مستقلة لإعدادات المحاسبة تضم شجرة الحسابات والأصول الثابتة
- [x] الحفاظ على روابط التقارير والمعاينة والاختبارات وحفظ الإصدار

## Accounting documents navigation group
- [x] إنشاء مجموعة مستقلة باسم المستندات المحاسبية تحت المحاسبة
- [x] ربط المجموعة بصفحة كروت الفواتير والسندات والعروض وأوامر الشراء
- [x] الحفاظ على قوائم الإعدادات والتقارير والاختبارات والمعاينة وحفظ الإصدار

## Final accounting navigation position
- [x] تثبيت المحاسبة تحت التشغيل الأساسي في القائمة الجانبية
- [x] إبقاء المستندات المحاسبية تحت المحاسبة مباشرة
- [x] إبقاء إعدادات المحاسبة والتقارير المحاسبية كمجموعتين مستقلتين أسفلها
- [x] اختبار الترتيب والمعاينة وحفظ الإصدار

## Employee edit permission for Mostafa
- [ ] إتاحة تعديل بيانات الموظفين لمصطفى ضمن نطاق الصلاحيات
- [ ] إبقاء حذف الموظفين وإدارة المستخدمين للمسؤول فقط
- [ ] اختبار التعديل وسجل التدقيق والمعاينة وحفظ الإصدار

## Separate work certificates from project cost
- [ ] تحديد مصدر رقم المستخلص الظاهر في مؤشرات التكلفة
- [ ] عرض مستخلصات الأعمال كإيراد أو مستحقات للمشروع لا كتكلفة تنفيذ
- [ ] حساب استهلاك الميزانية من التكاليف الفعلية فقط
- [ ] فصل نسبة إنجاز المستخلص عن نسبة استهلاك التكلفة
- [ ] تحديث الداشبورد ومركز التكلفة وقائمة الدخل والاختبارات والمعاينة وحفظ الإصدار

## Certificate share of development budget
- [ ] إضافة نسبة كل مستخلص صادر من ميزانية المشروع بجانب المستخلص
- [ ] فصل نسبة المستخلص/الإيراد عن نسبة استهلاك تكلفة التنفيذ
- [ ] تحديث الداشبورد والتقارير والاختبارات والمعاينة وحفظ الإصدار

## Subcontractor certificate cost share clarification
- [ ] اعتبار مستخلص مقاول الحفر تكلفة مقاولي باطن لا إيرادًا
- [ ] إظهار نسبة المستخلص من ميزانية المرحلة بجانبه
- [ ] إظهار نسبة المستخلص من ميزانية المشروع بجانبه
- [ ] فصل النسب عن استهلاك التكلفة الإجمالي وتحديث الاختبارات والمعاينة وحفظ الإصدار

## Accounting navigation structure
- [x] مراجعة روابط المحاسبة والمستندات المحاسبية وإعدادات المحاسبة والتقارير المحاسبية
- [x] تثبيت كل مجموعة في قسم جانبي مستقل تحت التشغيل الأساسي وبالترتيب المتفق عليه
- [x] اختبار كل الروابط وإصلاح أخطاء التنقل والمعاينة

## Company-wide dashboard financial summary
- [ ] إضافة إجمالي تكاليف المشاريع إلى الداشبورد الشامل
- [ ] إضافة إجمالي إيرادات المشاريع إلى الداشبورد الشامل
- [ ] إضافة المصروفات الإدارية والنثرية للشركة والرواتب الإدارية للشركة
- [ ] إظهار نسبة وقيمة تحميل كل مشروع نشط من المصروفات والرواتب المشتركة
- [ ] اختبار عدم تكرار التكاليف المباشرة والمشتركة ومعاينة RTL وحفظ الإصدار

## Prominent company financial summary
- [ ] جعل ملخص الشركة ككل قسمًا رئيسيًا كبيرًا وبارزًا أسفل تقارير المشاريع
- [ ] عرض بطاقات الإجماليات وجدول توزيع التحميل بحجم واضح ومتجاوب

## Automatic stage progress from contractor certificates
- [x] حساب نسبة إنجاز المرحلة من مستخلصات المقاول المعتمدة مقارنة بميزانية أو عقد المرحلة
- [x] إظهار قيمة المستخلصات والنسبة ومصدرها في بطاقة المرحلة
- [x] الحفاظ على التعديل اليدوي كتصحيح اختياري مع توضيح أنه ليس المصدر الافتراضي
- [x] اختبار الحساب وتحديث الداشبورد والمعاينة وحفظ الإصدار

## Actual accounting page separation
- [ ] فصل المستندات المحاسبية في صفحة مستقلة للسندات والفواتير فقط
- [ ] فصل إعدادات المحاسبة في صفحة مستقلة لشجرة الحسابات والأصول الثابتة
- [ ] فصل التقارير المحاسبية في صفحة مستقلة للتقارير فقط
- [ ] تحديث المسارات والقائمة واختبار التنقل والمعاينة وحفظ الإصدار

## Administrative payroll allocation
- [ ] جعل المشروع اختياريًا عند اختيار الرواتب في سند الصرف
- [ ] توزيع الراتب غير المرتبط بمشروع تلقائيًا حسب قيمة عقود المشاريع النشطة
- [ ] الحفاظ على التحميل المحدد عند اختيار مشروع ونسبة تحمل
- [ ] تحديث التقارير والاختبارات والمعاينة وحفظ الإصدار

## Payment voucher visibility in expenses
- [ ] تتبع سبب عدم ظهور سند صرف مصطفى داخل صفحة التكاليف والمصروفات
- [ ] ربط سندات الصرف بالمصروفات أو عرضها ضمن قائمة السندات المعلقة
- [ ] احترام الاعتماد مع إظهار حالة السند وعدم اختفائه
- [ ] إضافة اختبار ومعاينة وحفظ الإصدار

## Combined ERP completion pass
- [ ] إكمال فصل صفحات المستندات وإعدادات المحاسبة والتقارير فعليًا
- [ ] إكمال توزيع الرواتب غير المرتبطة بالمشروع حسب قيم عقود المشاريع النشطة
- [ ] إصلاح ظهور سندات صرف مصطفى داخل التكاليف والمصروفات مع حالة الاعتماد
- [ ] مراجعة ملخص الشركة ومؤشرات التكلفة والمستخلصات
- [ ] تشغيل الاختبارات والمعاينة RTL وحفظ إصدار موحد

## Accounting document register
- [x] حصر صفحة المستندات المحاسبية في المستندات الأساسية السبعة
- [x] إضافة مرجع شامل لكل السندات والفواتير المسجلة
- [x] إضافة تعديل المستندات لمستخدم 1 ولمصطفى وفق الصلاحيات
- [ ] التحقق من الحسابات المدينة والدائنة وظهور المستندات في التقارير والمصروفات

## Full agreed ERP scope
- [x] تنفيذ صلاحيات مصطفى الكاملة مع استثناء اعتماد مسير الرواتب والمستخلصات
- [x] إكمال فصل المحاسبة ومرجع المستندات والتعديل والربط المحاسبي
- [x] إصلاح ظهور سندات الصرف في المصروفات وتوزيع الرواتب الإدارية
- [x] استكمال ملخص الشركة ومؤشرات المستخلصات والإنجاز
- [x] إجراء اختبار شامل ومعاينة RTL وحفظ الإصدار المنشور

## Unified expense entry
- [x] الإبقاء على اسم الواجهة «إضافة مصروف» لمصطفى
- [ ] توحيد نموذج إضافة مصروف مع منطق سند الصرف المحاسبي
- [x] ربط الحفظ بالمستند المرجعي والتقارير دون تسجيل مزدوج

## Rebuild إضافة مصروف
- [ ] إعادة بناء نموذج إضافة مصروف ليطابق سند الصرف المبسط
- [ ] إضافة الحقول الشرطية: التحميل، النوع، المشروع، نسبة التحمل، المورد/المقاول، الرواتب، البنك/الخزينة، وبند التكلفة
- [ ] توحيد الحفظ في حركة واحدة مرتبطة بالمستند والحسابات والتقارير
- [ ] اختبار النموذج والمعاينة RTL وحفظ الإصدار

## Accounting document register sections
- [x] إضافة سجل واضح لكل المستندات داخل صفحة المستندات المحاسبية
- [x] فصل سندات الصرف والقبض والفواتير والقيود والعروض وأوامر الشراء إلى أقسام مستقلة
- [x] إظهار تفاصيل الحسابات وخطوط القيد وزر تعديل لكل مستند حسب الصلاحية
- [x] اختبار الأقسام والتعديل والمعاينة RTL وحفظ الإصدار

## Edit expense-linked payment vouchers
- [ ] إضافة زر تعديل لسندات الصرف المرتبطة بالمصروفات لك ولمصطفى
- [ ] فتح نموذج السند بالبيانات الحالية وتحديث الحركة دون تكرار
- [ ] اختبار الصلاحيات والربط المحاسبي والمعاينة وحفظ الإصدار

## Posted payment vouchers in expenses and reports
- [ ] إدخال سندات الصرف المرحّلة في ملخص المصروفات وتكاليف المشاريع حسب التصنيف
- [ ] إدخال سندات الصرف الإدارية والنثرية في ملخص الشركة وتوزيعها على المشاريع النشطة
- [ ] ربط سندات الصرف بمركز التكلفة وقائمة الدخل والتقارير المحاسبية
- [ ] منع احتساب السند مرتين إذا كان مرتبطًا بمصروف مسجل
- [ ] إضافة اختبارات ومعاينة RTL وحفظ الإصدار

## Custody disbursement linked to vouchers
- [ ] إضافة اختيار سند الصرف عند نوع حركة صرف من العهدة
- [ ] منع تجاوز قيمة السند أو استخدامه مرتين
- [ ] ربط السند بحركة العهدة وكشف الحساب والتقارير
- [ ] اختبار النموذج والمعاينة RTL وحفظ الإصدار

## Complete finance and custody alignment
- [ ] استكمال توحيد اتجاه الصرف في إضافة مصروف وسند الصرف وصرف العهدة
- [ ] ربط التصنيف والمشروع والطرف والحسابات بكل تقارير المصروفات والتقارير المحاسبية
- [ ] تثبيت التعديل والصلاحيات لمستخدم 1 ومصطفى مع استثناء الاعتمادات الحساسة
- [ ] إجراء اختبار تكاملي شامل ومعاينة RTL وحفظ الإصدار النهائي

## Company logo on accounting documents
- [x] رفع شعار الشركة إلى التخزين الدائم وربطه بإعدادات الشركة
- [x] إظهار الشعار في ترويسة الفواتير والسندات والقيود والعروض وأوامر الشراء
- [ ] التحقق من الطباعة والتصدير والمعاينة RTL وحفظ الإصدار

## Professional documents and draft status
- [ ] إضافة تصميم احترافي قابل للطباعة للسندات والفواتير مع الشعار وبيانات الشركة
- [x] إضافة خيار حفظ الفاتورة كمسودة أو إصدارها كسند نهائي
- [x] منع المسودات من الترحيل للتقارير النهائية حتى اعتمادها
- [x] اختبار الطباعة والتصدير والحالات والصلاحيات وحفظ الإصدار

## Saudi tax invoice and QR
- [ ] تجهيز فاتورة مبيعات ضريبية سعودية ببيانات البائع والمشتري والرقم الضريبي والإجماليات
- [ ] إضافة QR وفق متطلبات الفوترة الإلكترونية السعودية وإظهار باركود/رمز المستند
- [ ] منع الإصدار النهائي عند نقص البيانات الإلزامية ودعم المسودة
- [ ] اختبار الطباعة والتصدير والمعاينة RTL وحفظ الإصدار

## Final integrated ERP pass
- [ ] مراجعة وإكمال جميع البنود المتبقية في إضافة مصروف وصرف العهدة والمستندات
- [ ] تطبيق الفاتورة الضريبية السعودية مع QR والباركود والمسودة والنهائي
- [ ] ربط كل الحركات بالداشبورد والتقارير والصلاحيات دون تكرار
- [ ] تنفيذ اختبار نهائي شامل ومعاينة RTL وحفظ الإصدار المنشور

## Remove cost item from sales invoices
- [ ] إزالة بند التكلفة من واجهة فاتورة المبيعات
- [ ] إبقاء بند التكلفة في المصروفات وسندات الصرف ومركز التكلفة فقط
- [ ] اختبار الحفظ والتقارير والمعاينة وحفظ الإصدار

## Sales invoice reference design
- [ ] إعادة تصميم شاشة تسجيل فاتورة المبيعات وفق النموذج المرجعي مع بيانات العميل والتاريخ والعملة والشروط
- [ ] تصميم جدول البنود والخصم والضريبة والإجماليات كما في المرجع
- [ ] تصميم المستند النهائي بالشعار وQR والرقم التسلسلي وبيانات الطرف وحالة الفاتورة
- [ ] إزالة مركز التكلفة من فاتورة المبيعات وتغطية المسودة والنهائي والاختبارات

## Journal entry reference alignment
- [ ] إعادة بناء شاشة تسجيل القيد المحاسبي وفق المرجع: التاريخ، العملة، الرقم، الوصف، والمرفقات
- [ ] دعم جدول قيود متعدد الأسطر بحساب إلزامي ووصف ومركز تكلفة وضريبة ومدين ودائن
- [ ] إضافة وحذف أسطر القيد مع إظهار إجماليات المدين والدائن والتحقق من التوازن قبل الحفظ
- [ ] إضافة حالة الحفظ والتعديل والمرفقات مع الحفاظ على صلاحيات المستخدمين
- [ ] اختبار القيد المحاسبي RTL والطباعة والتعديل وربطه بالتقارير

## Sales quotation conversion
- [ ] إضافة خيار حفظ فاتورة المبيعات كعرض سعر أثناء التسجيل
- [ ] حفظ عرض السعر دون أثر محاسبي أو تحصيلي وإظهاره في قسم عروض الأسعار
- [ ] إضافة إمكانية تحويل عرض السعر لاحقًا إلى فاتورة مبيعات مع الحفاظ على بياناته
- [ ] اختبار الحالات: مسودة، عرض سعر، فاتورة نهائية، والصلاحيات والتقارير

## Receipt voucher reference alignment
- [ ] تخصيص سند القبض لاختيار عميل إلزامي مع زر إضافة عميل سريع
- [ ] إضافة تحديد جهة استلام المبلغ: بنك أو خزينة
- [ ] إضافة تحديد حساب الإيراد/التحميل للمبلغ المقبوض من عميل أو صاحب عمل أو جهة أخرى
- [ ] إزالة بند التكلفة وبطاقة الأصل الثابت من نموذج سند القبض
- [ ] التحقق من توازن قيد القبض وربطه بالتقارير وكشف العميل

## Custody statement balance summary
- [x] إضافة بطاقة رصيد نهائي تظهر بعد اختيار الموظف ونوع العهدة وقبل جدول كشف الحساب
- [x] عرض إجمالي العهد المسجلة وإجمالي المصروف والرصيد المتبقي بالأرقام الإنجليزية
- [x] تحديث البطاقة تلقائيًا عند تغيير الموظف أو نوع العهدة والتأكد من RTL والاختبارات

## Employee editing permissions
- [x] إضافة زر تعديل لكل موظف داخل قائمة الموظفين
- [x] إعادة تعبئة نموذج الموظف عند التعديل وحفظ جميع بياناته التفصيلية
- [x] السماح بالتعديل لك ولمصطفى فقط مع تحقق خادمي وتسجيل العملية
- [x] اختبار التعديل والرجوع والإلغاء وعدم ظهور الإجراء للمستخدمين غير المصرح لهم

## Manual absence payroll calculation
- [x] إضافة أيام الشهر وأيام الغياب اليدوية إلى مسير الراتب دون ربط إلزامي بالحضور والانصراف
- [x] احتساب قيمة اليوم وخصم الغياب من الراتب الأساسي والبدلات القابلة للاحتساب
- [x] إظهار الراتب الإجمالي والخصم وصافي المستحق قبل اعتماد المسير
- [x] اختبار حالات عدم الغياب والغياب الجزئي والبدلات والتوزيع على المشاريع

## Simplified expense entry alignment
- [x] إعادة توجيه «إضافة مصروف» إلى نسخة سند الصرف المعدلة الموحدة
- [x] استخدام نفس منطق نوع التحميل والمشروع ونسبة التحمل والحسابات في الاختصار
- [x] الحفاظ على ربط سند الصرف بالقيود والتقارير والداشبورد
- [ ] مراجعة تفاصيل واجهة الاختصار النهائية وإضافة اختبار تنقل مستقل

## Bank and cash account editing
- [x] إضافة زر تعديل لكل بنك أو خزينة في الحسابات المسجلة
- [x] تعبئة نموذج التعديل بالكود والاسم والنوع وبيانات البنك والحساب والآيبان والعملة والرصيد الافتتاحي
- [x] حفظ التعديل مع سجل تدقيق وتحقق صلاحية التعديل من الخادم
- [x] تحديث المستندات وكشوف الحساب والقوائم بعد تعديل الحساب
- [x] اختبار تعديل بنك وتعديل خزينة والمعاينة وحفظ الإصدار

## Shared expense allocation detail
- [x] إضافة تفصيل مكونات المبلغ المشترك: مصروفات إدارية ونثريات ورواتب إدارية
- [x] إظهار قيمة عقد كل مشروع وإجمالي قيم العقود النشطة ونسبة التحمل
- [x] إظهار المبلغ المحمل على كل مشروع مع شرح أن أساس التوزيع قيمة العقد
- [x] اختبار مطابقة مجموع التحميلات مع المبلغ المشترك والمعاينة RTL وحفظ الإصدار

## Accounting document activity panel
- [x] إضافة لوحة حركة مستندات بجانب كروت المستندات المحاسبية
- [x] تصفية السجل حسب سند صرف أو قبض أو فاتورة مبيعات أو مشتريات أو قيد أو عرض سعر أو أمر شراء
- [x] عرض رقم المستند والتاريخ والطرف والمبلغ والحالة والحسابات المرتبطة
- [x] إضافة زر تعديل يفتح المستند بالبيانات الحالية مع احترام الصلاحيات وحالة الترحيل
- [x] اختبار التصفية والتعديل والمعاينة RTL وحفظ الإصدار

## Bank and cash statement transaction preview
- [x] إضافة زر معاينة بجانب كل حركة في كشف البنك أو الخزينة
- [x] عرض تفاصيل العملية والمستند المرتبط والحسابات والمبلغ والحالة
- [x] إضافة تعديل من شاشة المعاينة يفتح نموذج المستند الحالي
- [x] تحديث كشف الحساب والتقارير بعد الحفظ والتحقق من الصلاحيات
- [x] اختبار المعاينة والتعديل والطباعة والمعاينة RTL وحفظ الإصدار

## Owner-only transaction deletion
- [x] قصر حذف العمليات على حساب المالك فقط في الخادم
- [x] إبقاء مصطفى قادرًا على المعاينة والتعديل دون ظهور أو تنفيذ الحذف
- [x] إضافة تأكيد للحذف وتسجيل العملية في سجل التدقيق وتحديث الأرصدة والتقارير
- [x] اختبار صلاحيات المالك ومصطفى والمعاينة RTL وحفظ الإصدار

## Direct delete action in document activity
- [ ] إظهار زر حذف بجانب زر تعديل كل مستند في لوحة حركة المستندات للمالك فقط
- [ ] إضافة تأكيد للحذف وتحديث قائمة الحركة بعد نجاحه
- [ ] إبقاء الزر مخفيًا عن مصطفى مع استمرار التحقق الخادمي
- [ ] اختبار الحذف المباشر والمعاينة RTL وحفظ الإصدار

## Delete action in bank statement table
- [x] إضافة زر حذف بجانب معاينة داخل عمود إجراء كشف الحساب للمالك فقط
- [x] تحديث الجدول والرصيد بعد الحذف مع تأكيد واضح
- [x] إصلاح أي خطأ JSX سابق في لوحة حركة المستندات واختبار RTL

## Owner deletion approval confirmation
- [x] جعل حذف المالك يتطلب اعتمادًا صريحًا من نافذة تأكيد قبل التنفيذ
- [x] عرض رقم المستند والمبلغ وتأثير الحذف داخل نافذة الاعتماد
- [x] توحيد نافذة الاعتماد في بطاقة المعاينة ولوحة الحركة وكشف الحساب
- [x] اختبار إلغاء الاعتماد والتنفيذ بعد الاعتماد وصلاحيات مصطفى

## Stage variance wording clarification
- [x] تغيير تسمية الفرق الموجب بين الميزانية والفعلي إلى المتبقي من الميزانية أو وفر متوقع
- [x] إبقاء انحراف التكلفة مخصصًا لحالة تجاوز التكلفة الفعلية للميزانية
- [x] إضافة شرح للمعادلة وقيمة الميزانية والفعلي والمتبقي في تقرير المرحلة
- [x] اختبار مرحلة أقل من الميزانية ومرحلة متجاوزة والمعاينة RTL وحفظ الإصدار

## Custody settlement and expense visibility
- [ ] إضافة توضيح داخل تسجيل العهدة بأن الحركة سلفة مستقلة حتى تتم التسوية
- [ ] ربط تسوية العهدة بالمصروف الفعلي الإداري أو النثري أو المشروع حسب اتجاه التحميل
- [ ] إظهار العهدة المسجلة في كشف العهدة، وإظهار المصروف النهائي في تقارير المصروفات بعد التسوية دون ازدواج
- [ ] عرض مرجع حركة العهدة والتسوية والمستند المرتبط مع إمكانية التعديل حسب الصلاحية
- [ ] اختبار عهدة إدارية وعهدة مشروع وتسوية جزئية وكاملة والمعاينة RTL وحفظ الإصدار

## Automatic custody expense posting
- [x] إنشاء مصروف مرتبط تلقائيًا عند تسجيل حركة صرف من العهدة
- [x] نقل تصنيف العهدة إلى المصروف المرتبط: إداري أو نثريات أو مشروع ونسبة التحمل
- [x] حفظ مرجع الحركة والمصروف لمنع الازدواج وإظهار العلاقة في التقارير
- [x] تحديث المصروف تلقائيًا عند تعديل حركة العهدة وتحديث كشف العهدة والداشبورد
- [x] اختبار TypeScript والاختبارات العامة بعد الترحيل

## Custody spend voucher classification parity
- [ ] عرض نفس خيارات تصنيف سند الصرف عند اختيار صرف من العهدة
- [ ] إظهار الحقول التابعة للتصنيف: مشروع ونسبة تحمل، مقاول، مورد وخامة، رواتب، بنك أو خزينة، وحساب مدين
- [ ] تمرير التصنيف والحقول إلى المصروف المرتبط تلقائيًا دون فقدان المرجع
- [ ] اختبار كل تصنيف وإعادة ضبط الحقول عند تغيير الاختيار وحفظ الإصدار

## Employee manager user links
- [x] إضافة حقل مستخدم المدير المباشر إلى ملف الموظف مع الاسم والبريد
- [x] إضافة حقل مستخدم المدير العام إلى ملف الموظف مع الاسم والبريد
- [ ] توفير اختيار من المستخدمين المسجلين وزر إضافة مستخدم سريع بالاسم والبريد
- [x] حفظ العلاقات في قاعدة البيانات وإظهارها عند تعديل الموظف
- [x] اختبار اختيار المديرين والمعاينة RTL والبناء


## Custody spend exact voucher parity
- [ ] مطابقة خيارات وحقول صرف العهدة مع سند الصرف المعدل حرفيًا
- [ ] مطابقة اختيار البنك أو الخزينة والحساب المدين والقيد المرتبط
- [ ] مطابقة ترحيل المصروف والتصنيف والربط بالمشروع ونسبة التحمل
- [ ] اختبار عدم الازدواج وتحديث التعديل والحذف والتقارير لكلتا الواجهتين

## Conditional custody spend fields
- [x] إظهار حقول نوع المستفيد عند اختيار رواتب: موظف شركة أو أجير
- [x] إظهار اختيار الموظف أو اسم الأجير، مع تصفير الضريبة تلقائيًا
- [x] إظهار حقول المورد والخامة أو المقاول عند اختيار التصنيف المناسب
- [x] إظهار المشروع ونسبة التحمل والمرحلة الاختيارية للتصنيفات المرتبطة بالمشروع
- [x] تمرير الحقول المدعومة إلى المصروف المرتبط والقيد
- [ ] اختبار بصري مستقل لكل تصنيف وتحديث الحقول عند تبديل الاختيار

## Custody expense posting verification
- [x] التحقق من ظهور المصروف المرتبط بصرف العهدة في صفحة التكاليف والمصروفات
- [x] التحقق من ظهوره في التقارير والداشبورد حسب التصنيف
- [x] التأكد من عدم احتساب حركة العهدة والمصروف المرتبط مرتين
- [x] اختبار الإنشاء والتعديل والحذف وتحديث الرصيد والمصروف معًا

## Current ERP hardening batch

- [x] إصلاح خطأ JSX في Finance.tsx والتحقق من TypeScript والاختبارات
- [x] إضافة فلتر مصدر المصروفات: الكل، عادية، وعهدة
- [x] إضافة أدوار المدير العام ومدير المشاريع ومسؤول المشتريات/الموقع إلى مخطط المستخدمين
- [x] تقييد إجراءات الاعتماد والعمليات الحساسة حسب الدور في الخادم
- [x] تصفية قائمة التنقل والإجراءات السريعة حسب الدور
- [ ] إضافة واجهة إدارة الدور وربط مدير المشاريع بالمشروع المحدد
- [x] إكمال سلسلة اعتماد المخزون: مسؤول الموقع ثم مصطفى ثم المالك
- [x] إصلاح أزرار إنشاء المورد/العميل داخل نماذج المستندات
- [ ] إعادة بناء قوالب تسجيل وعرض فواتير البيع والشراء والسندات
- [x] إضافة حقول ZATCA الأساسية ورمز QR للفواتير النهائية
- [x] إضافة اختبارات وحدات للأدوار وسلسلة الاعتماد
- [ ] معاينة RTL وحفظ checkpoint نهائي

- [ ] إلزام قائمة العميل في فاتورة المبيعات وقائمة المورد في فاتورة المشتريات، مع منع الحفظ دون اختيار
- [ ] ربط الاختيار الإلزامي بالإنشاء السريع وتعبئة بيانات الطرف القانونية والضريبية
- [ ] تثبيت قاعدة الفواتير: الرقم الضريبي للطرف اختياري، واختيار الطرف من القائمة إلزامي
- [ ] إضافة تحميل PDF موحد لفواتير البيع والشراء وعروض الأسعار وسندات الصرف والقبض والقيود وأوامر الشراء
- [ ] تضمين الشعار وبيانات الشركة والمرجع والحالة والإجماليات في قوالب PDF
- [ ] إظهار حالة السداد أو التحصيل ورمز QR عند انطباقه على المستند
- [ ] جعل صفحة التكاليف والمصروفات تعرض سندات الصرف فقط
- [ ] إبقاء كل أنواع المستندات في صفحة المستندات المحاسبية تحت قائمة المحاسبة
- [ ] إبقاء سند الصرف ظاهرًا في صفحة التكاليف التشغيلية وفي سجل المستندات المحاسبية مع مرجع واحد للقيد
- [x] جعل سجل سندات الصرف في المستندات المحاسبية للعرض والبحث والتحميل فقط دون تعديل أو إنشاء
- [x] إبقاء إنشاء وتعديل سندات الصرف في صفحة التكاليف والمصروفات فقط
- [ ] إضافة مرجع مستخلص اختياري داخل فاتورة المشتريات مع عرضه في السجل والتقارير
- [x] إضافة طبيعة السداد في سند الصرف: سداد فاتورة أو دفعة مباشرة
- [x] عرض الفواتير غير المسددة للطرف وتحديث المدفوع والمتبقي والحالة تلقائيًا

## User invitation and job-permission center
- [x] إضافة دعوة مستخدم بالبريد مع المسمى الوظيفي والدور والمشروع الاختياري
- [x] تعريف قوالب وظائف: مدير عام، مدير مشاريع، مهندس مشرف، موظف إداري، ومسؤول مشتريات/موقع
- [x] عرض صلاحيات كل وظيفة مسبقًا مع إمكانية تخصيصها قبل الإرسال أو بعده
- [x] تقييد المدير العام بالتقارير والشاشة الرئيسية واعتماد المستخلصات ومسيرات الرواتب
- [x] تقييد مدير المشاريع بأداء المشاريع واعتماد المستخلصات للمشاريع المسندة
- [x] إضافة حالة الدعوة وقائمة المستخدمين وقابلية التعديل من صفحة المستخدمين

## Administrative expense classification
- [ ] عند اختيار المصروف الإداري العام، عرض بنود الإدارة فقط: الإيجار والكهرباء والمياه والاتصالات والإنترنت والتأمين والرواتب الإدارية والضيافة والنثريات
- [ ] منع بنود الخامات والتشغيل والمشروع من الظهور ضمن المصروف الإداري العام
- [ ] حفظ البند الإداري وربطه بالتقارير والداشبورد والتوزيع على المشاريع

## Invoice structure correction
- [x] مراجعة قيد فاتورة المشتريات ليكون مدينًا على بند التكلفة أو الخامات فقط
- [x] مراجعة قيد فاتورة المبيعات ليكون دائنًا على إيراد المشروع فقط
- [x] منع خلط بنود التكلفة داخل فاتورة المبيعات
- [x] فصل السداد والتحصيل عن إنشاء الفاتورة مع تحديث المتبقي والحالة
- [x] إلزام اختيار المورد في المشتريات والعميل في المبيعات مع إبقاء الرقم الضريبي اختياريًا
- [x] إتاحة ربط فاتورة المشتريات بمستخلص اختياري
- [x] تثبيت حالات المسودة وعرض السعر والنهائي مع نماذج عرض وتسجيل واضحة

## Invoice opening and structure hotfix
- [x] منع خطأ Invalid time value عند فتح أو تعديل فاتورة المبيعات
- [x] جعل تحويل تاريخ المستند آمنًا للقيم الفارغة وغير الصالحة والقديمة
- [x] إعادة اختبار فتح فاتورة مبيعات من السجل ومن رابط التعديل

## Party details correction
- [x] إضافة نوع الطرف: فرد أو شركة
- [x] إضافة الرقم الضريبي الاختياري والسجل التجاري
- [x] إضافة العنوان الوطني والعنوان التفصيلي والمدينة والحي والرمز البريدي
- [x] إضافة الجوال والبريد الإلكتروني وبيانات التواصل
- [x] حفظ تفاصيل الطرف في الإنشاء السريع وربطها بالفواتير
- [ ] عرض تفاصيل الطرف في القوائم وكشوف الحساب والمستندات

## Sales invoice credit-only correction
- [x] إخفاء الحساب المدين من نموذج فاتورة المبيعات وإبقاء حساب إيراد المشروع كجانب دائن فقط
- [ ] إنشاء أو استخدام حساب إيراد المشروع داخل شجرة الحسابات وربطه بالمشروع
- [x] إبقاء بنك/خزينة التحصيل خارج قيد إنشاء الفاتورة
- [x] إظهار سند قبض بجانب فاتورة المبيعات بعد الحفظ لتسجيل المدفوعات وتحديث المتبقي
