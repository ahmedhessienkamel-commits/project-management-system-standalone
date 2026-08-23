CREATE TABLE `advanceRepayments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`advanceRequestId` int NOT NULL,
	`employeeId` int NOT NULL,
	`scheduledMonth` int NOT NULL,
	`scheduledYear` int NOT NULL,
	`scheduledAmount` decimal(14,2) NOT NULL,
	`appliedAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`payrollRunId` int,
	`payrollId` int,
	`status` enum('scheduled','reserved','applied','deferred','cancelled') NOT NULL DEFAULT 'scheduled',
	`deferredAt` timestamp,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advanceRepayments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `advanceRequests` ADD `repaymentMode` enum('single','installments') DEFAULT 'single' NOT NULL;--> statement-breakpoint
ALTER TABLE `advanceRequests` ADD `repaymentStartMonth` int;--> statement-breakpoint
ALTER TABLE `advanceRequests` ADD `repaymentStartYear` int;--> statement-breakpoint
ALTER TABLE `advanceRequests` ADD `installmentCount` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `payroll` ADD `advanceDeductionAmount` decimal(14,2) DEFAULT '0' NOT NULL;