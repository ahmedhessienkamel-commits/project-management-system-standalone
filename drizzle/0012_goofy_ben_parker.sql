CREATE TABLE `administrativePayroll` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeName` varchar(255) NOT NULL,
	`employeeCode` varchar(64),
	`month` int NOT NULL,
	`year` int NOT NULL,
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`paidAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('draft','pending','approved','paid') NOT NULL DEFAULT 'pending',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `administrativePayroll_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payrollAllocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`administrativePayrollId` int NOT NULL,
	`projectId` int NOT NULL,
	`ratio` decimal(8,6) NOT NULL,
	`allocatedAmount` decimal(14,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payrollAllocations_id` PRIMARY KEY(`id`)
);
