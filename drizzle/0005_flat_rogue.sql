ALTER TABLE `attendance` ADD `stageId` int;--> statement-breakpoint
ALTER TABLE `attendance` ADD `employeeCode` varchar(64);--> statement-breakpoint
ALTER TABLE `custody` ADD `stageId` int;--> statement-breakpoint
ALTER TABLE `expenses` ADD `expenseType` varchar(64) DEFAULT 'operating' NOT NULL;--> statement-breakpoint
ALTER TABLE `payroll` ADD `stageId` int;--> statement-breakpoint
ALTER TABLE `payroll` ADD `paidAmount` decimal(14,2) DEFAULT '0' NOT NULL;