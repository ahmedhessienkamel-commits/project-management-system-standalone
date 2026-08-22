CREATE TABLE `payrollRuns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`runNumber` varchar(128) NOT NULL,
	`month` int NOT NULL,
	`year` int NOT NULL,
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`paidAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('draft','pending','approved','rejected','partially_paid','paid') NOT NULL DEFAULT 'draft',
	`submittedAt` timestamp,
	`approvedAt` timestamp,
	`approvedBy` int,
	`accrualDocumentId` int,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payrollRuns_id` PRIMARY KEY(`id`),
	CONSTRAINT `payrollRuns_runNumber_unique` UNIQUE(`runNumber`)
);
--> statement-breakpoint
CREATE TABLE `payrollSettlements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`payrollRunId` int NOT NULL,
	`payrollId` int NOT NULL,
	`accountingDocumentId` int NOT NULL,
	`amount` decimal(14,2) NOT NULL DEFAULT '0',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payrollSettlements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `payroll` ADD `payrollRunId` int;