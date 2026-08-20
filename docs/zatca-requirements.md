# ZATCA references used for invoice implementation

ZATCA Phase 1 requires an electronic invoicing solution that can generate invoices with required elements including QR codes and prevents uncontrolled access, tampering of invoices/logs, and multiple invoice sequences. For B2B tax invoices, the buyer VAT registration number is required when the buyer is VAT registered, along with the invoice type/title; QR is optional in Phase 1. For B2C simplified tax invoices, a taxpayer-generated QR code based on ZATCA specifications is mandatory, along with the invoice type/title.

ZATCA describes Phase 1 as the generation phase and Phase 2 as the integration phase. This implementation therefore treats the current feature as a Phase 1 document/print capability, not as a Phase 2 integration or clearance claim.

References:

1. [ZATCA — How to Prepare, Phase 1](https://zatca.gov.sa/en/E-Invoicing/PreparingYourBusiness/Phase1/Pages/How-to-prepare.aspx)
2. [ZATCA — What is E-Invoicing?](https://zatca.gov.sa/en/E-Invoicing/Introduction/Pages/What-is-e-invoicing.aspx)
3. [ZATCA — Security Requirements](https://zatca.gov.sa/en/E-Invoicing/SystemsDevelopers/Pages/Security-Requirements.aspx)
