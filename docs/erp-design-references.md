# ERP design references

## Odoo official credit notes documentation

Source: https://www.odoo.com/documentation/19.0/applications/finance/accounting/customer_invoices/credit_notes.html

Key patterns adopted for this project:

- Credit notes are normally created directly from the corresponding customer invoice.
- The credit note may be opened as a draft populated from the original invoice, allowing product and quantity changes for a partial refund.
- A second flow can create and validate the credit note against the related invoice.
- Credit-note numbering should visibly reference the original invoice.
- The original invoice should remain intact; the credit note is a separate accounting document linked to it.

These patterns support the project's planned full/partial sales return flow and the document action bar with contextual actions.

## Odoo official quotation documentation

Source: https://www.odoo.com/documentation/19.0/applications/sales/sales/sales_quotations/create_quotations.html

Key pattern adopted: a quotation is a separate commercial document which can be confirmed into the next sales stage, so the ERP should preserve document lineage from quotation to invoice rather than copy data without a reference.
