CREATE TABLE `cashAccounts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`name` varchar(255) NOT NULL,
	`accountType` enum('bank','cash') NOT NULL,
	`bankName` varchar(255),
	`accountNumber` varchar(128),
	`iban` varchar(64),
	`currency` varchar(8) NOT NULL DEFAULT 'SAR',
	`accountId` int,
	`openingBalance` decimal(14,2) NOT NULL DEFAULT '0',
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cashAccounts_id` PRIMARY KEY(`id`),
	CONSTRAINT `cashAccounts_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `companyProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legalName` varchar(255) NOT NULL,
	`tradeName` varchar(255),
	`commercialRegistration` varchar(128),
	`taxNumber` varchar(128),
	`nationalAddress` text,
	`phone` varchar(64),
	`email` varchar(255),
	`website` varchar(255),
	`logoUrl` text,
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companyProfiles_id` PRIMARY KEY(`id`)
);
