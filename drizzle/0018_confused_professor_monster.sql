CREATE TABLE `costItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`parentId` int,
	`code` varchar(32) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(64) NOT NULL DEFAULT 'materials',
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `costItems_id` PRIMARY KEY(`id`),
	CONSTRAINT `costItems_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `accountingDocumentLines` ADD `costItemId` int;--> statement-breakpoint
ALTER TABLE `expenses` ADD `costItemId` int;