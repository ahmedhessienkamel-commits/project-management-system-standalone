CREATE TABLE `estimateLines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`estimateId` int NOT NULL,
	`parentId` int,
	`costItemId` int,
	`itemCode` varchar(64),
	`category` varchar(128) NOT NULL DEFAULT 'أعمال عامة',
	`description` text NOT NULL,
	`unit` varchar(64) NOT NULL DEFAULT 'مقطوعية',
	`quantity` decimal(14,3) NOT NULL DEFAULT '1',
	`materialCost` decimal(14,2) NOT NULL DEFAULT '0',
	`laborCost` decimal(14,2) NOT NULL DEFAULT '0',
	`equipmentCost` decimal(14,2) NOT NULL DEFAULT '0',
	`otherCost` decimal(14,2) NOT NULL DEFAULT '0',
	`unitRate` decimal(14,2) NOT NULL DEFAULT '0',
	`totalCost` decimal(14,2) NOT NULL DEFAULT '0',
	`alternativeGroup` varchar(128),
	`isAlternative` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `estimateLines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `estimates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`projectId` int,
	`code` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`estimateType` enum('contracting','development','general') NOT NULL DEFAULT 'contracting',
	`status` enum('draft','submitted','approved','archived') NOT NULL DEFAULT 'draft',
	`version` int NOT NULL DEFAULT 1,
	`clientName` varchar(255),
	`siteLocation` varchar(255),
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `estimates_id` PRIMARY KEY(`id`),
	CONSTRAINT `estimates_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `companies` ADD `businessType` enum('real_estate_developer','contractor') DEFAULT 'real_estate_developer' NOT NULL;