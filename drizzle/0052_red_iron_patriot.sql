ALTER TABLE `accountingDocuments` MODIFY COLUMN `documentType` enum('sales_invoice','purchase_invoice','credit_note','journal_entry','payment_voucher','receipt_voucher','quotation','purchase_order') NOT NULL;--> statement-breakpoint
ALTER TABLE `accountingDocuments` ADD `relatedDocumentType` varchar(64);--> statement-breakpoint
ALTER TABLE `accountingDocuments` ADD `relatedDocumentId` int;--> statement-breakpoint
ALTER TABLE `accountingDocuments` ADD `originalDocumentId` int;--> statement-breakpoint
ALTER TABLE `accountingDocuments` ADD `returnType` enum('full','partial');