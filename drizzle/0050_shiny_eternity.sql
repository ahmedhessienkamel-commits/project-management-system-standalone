ALTER TABLE `accountingDocuments` ADD `settlementType` enum('invoice','direct');--> statement-breakpoint
ALTER TABLE `accountingDocuments` ADD `certificateId` int;