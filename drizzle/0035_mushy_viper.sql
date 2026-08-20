ALTER TABLE `accountingDocuments` ADD `voucherCategory` enum('contractor','administrative','petty_cash');--> statement-breakpoint
ALTER TABLE `accountingDocuments` ADD `contractorId` int;