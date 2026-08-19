CREATE TABLE `accountingDocumentLines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`accountId` int NOT NULL,
	`projectId` int,
	`stageId` int,
	`description` text,
	`debit` decimal(14,2) NOT NULL DEFAULT '0',
	`credit` decimal(14,2) NOT NULL DEFAULT '0',
	CONSTRAINT `accountingDocumentLines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accountingDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`documentType` enum('sales_invoice','purchase_invoice','journal_entry','payment_voucher','receipt_voucher','quotation','purchase_order') NOT NULL,
	`documentNumber` varchar(128) NOT NULL,
	`partyName` varchar(255),
	`documentDate` date,
	`dueDate` date,
	`sourceAccountId` int,
	`amount` decimal(14,2) NOT NULL DEFAULT '0',
	`taxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`paymentMethod` enum('cash','bank'),
	`status` enum('draft','posted','cancelled') NOT NULL DEFAULT 'draft',
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accountingDocuments_id` PRIMARY KEY(`id`),
	CONSTRAINT `accountingDocuments_documentNumber_unique` UNIQUE(`documentNumber`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`name` varchar(255) NOT NULL,
	`accountType` enum('asset','liability','equity','revenue','expense') NOT NULL,
	`parentId` int,
	`isPostable` int NOT NULL DEFAULT 1,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `accounts_code_unique` UNIQUE(`code`)
);
