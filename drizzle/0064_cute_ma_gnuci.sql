CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`legalName` varchar(255) NOT NULL,
	`tradeName` varchar(255),
	`commercialRegistration` varchar(128),
	`taxNumber` varchar(128),
	`nationalAddress` text,
	`phone` varchar(64),
	`email` varchar(255),
	`website` varchar(255),
	`logoUrl` varchar(2000),
	`notes` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companyMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('owner','admin','general_manager','project_manager','procurement_manager','user') NOT NULL DEFAULT 'user',
	`status` enum('active','invited','suspended') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companyMembers_id` PRIMARY KEY(`id`)
);
