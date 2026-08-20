CREATE TABLE `inventoryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`code` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(128) NOT NULL DEFAULT 'materials',
	`unit` varchar(64) NOT NULL,
	`minimumStock` decimal(14,3) NOT NULL DEFAULT '0',
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventoryItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `inventoryItems_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `inventoryMovements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int,
	`itemId` int NOT NULL,
	`vendorId` int,
	`movementType` enum('receipt','issue','adjustment_in','adjustment_out') NOT NULL,
	`quantity` decimal(14,3) NOT NULL,
	`unitCost` decimal(14,4) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`movementDate` date,
	`reference` varchar(128),
	`description` text,
	`sourceDocumentId` int,
	`status` enum('draft','posted','cancelled') NOT NULL DEFAULT 'posted',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventoryMovements_id` PRIMARY KEY(`id`)
);
