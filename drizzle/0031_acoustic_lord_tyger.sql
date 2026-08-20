CREATE TABLE `contractorContracts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int,
	`vendorId` int NOT NULL,
	`contractNumber` varchar(128) NOT NULL,
	`description` text,
	`preTaxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`taxRate` decimal(5,2) NOT NULL DEFAULT '15',
	`taxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('draft','active','closed','cancelled') NOT NULL DEFAULT 'active',
	`contractDate` date,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contractorContracts_id` PRIMARY KEY(`id`)
);
