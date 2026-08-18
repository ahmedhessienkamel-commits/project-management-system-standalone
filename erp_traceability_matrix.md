# ERP Traceability Matrix

## Purpose

This matrix preserves the agreed Excel behavior while translating it into a multi-user, multi-project ERP. A requirement is considered complete only when its data model, user workflow, report effect, and acceptance test are all defined.

| Excel requirement | ERP module | Core rule | Acceptance test |
|---|---|---|---|
| Unit sales, collections, and recognized revenue | Sales & Collections | One unit sale can have multiple collections; recognized revenue is calculated from sales, not contractor certificates | Create a sale, add two collections, verify recognized revenue, collected amount, and balance |
| Pre-tax, tax, and post-tax values | Financial transactions | Non-payroll transactions store pre-tax, tax rate, tax amount, and post-tax; payroll is tax-exempt | Create an expense and payroll record and verify tax behavior |
| Payroll project split | Payroll | Every project payroll record is assigned to a project; Wadi Namar feeds main project reports; Qiddiya is separated | Record payroll for both projects and verify dashboard separation |
| Stages and budgets | Projects & Stages | Each stage has planned budget, dates, status, actual cost, variance, and progress | Add expense to a stage and verify actual, variance, and alert status |
| Schedule monitoring | Schedule | Stage start/end dates drive progress, overdue, and delayed indicators | Test planned, active, completed, and overdue stages |
| Project versus administrative cost | Expenses | Classification is explicit and cannot silently move between project and administrative totals | Post both classifications and verify no double counting |
| Supplier/contractor statement | Vendors & Statements | Expenses, payments, and certificates are linked to the selected vendor | Select a vendor and verify all related movements and balance |
| Contractor master data | Contractors | Tax number, commercial registration, IBAN, contact, and status are reusable fields | Select contractor in a certificate and verify details |
| Certificates | Contractor Certificates | Certificate has contractor, stage, pre-tax/tax/post-tax amounts, paid, due, approval state, and attachments | Submit certificate, approve, and verify cost and due balance |
| Custody | Custody | Custody holder, project, cost center, classification, issue, settlement, and balance are tracked | Issue and settle custody and verify expense treatment |
| Attendance | Attendance | Employee, project, stage, date, check-in/out, hours, and status are stored | Record attendance and verify monthly summary |
| Attachments | Documents | Files are stored externally; database stores metadata, links, document type, and relation | Attach a contractor document and retrieve it from the related record |
| Approval workflows | Approvals | Draft → pending → approved/rejected; thresholds can route to management | Submit a transaction and verify role-based approval path |
| Audit trail | Audit | Create, edit, approve, reject, reverse, and delete actions are logged | Verify actor, timestamp, action, and before/after values |
| Budget warnings | Alerts | 80% warning and 100%+ critical status are calculated per project and stage | Cross both thresholds and verify alert colors/status |
| Cash gap | Cash Flow | Cash in minus cash out is calculated by project and stage; funding gap is visible | Record collection and expense and verify gap |
| Multi-project access | Security | User-project memberships constrain accessible records | Verify a manager cannot see an unassigned project |
| Period lock | Controls | Closed periods prevent edits except for authorized users with an audit reason | Close period and attempt a normal edit |
| Reports and exports | Reporting | Reports filter by project, stage, vendor, date, status, and classification | Apply filters and verify totals match source transactions |
