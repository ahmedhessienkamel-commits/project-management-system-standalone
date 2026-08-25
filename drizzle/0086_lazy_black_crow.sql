CREATE TABLE `cashTransfers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`transferNumber` varchar(128) NOT NULL,
	`transferDate` date NOT NULL,
	`fromCashAccountId` int NOT NULL,
	`toCashAccountId` int NOT NULL,
	`amount` decimal(14,2) NOT NULL,
	`accountingDocumentId` int,
	`status` enum('posted','cancelled') NOT NULL DEFAULT 'posted',
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cashTransfers_id` PRIMARY KEY(`id`),
	CONSTRAINT `cashTransfers_transferNumber_unique` UNIQUE(`transferNumber`)
);
