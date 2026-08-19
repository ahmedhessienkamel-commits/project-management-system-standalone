CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeCode` varchar(64) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`jobTitle` varchar(255),
	`phone` varchar(64),
	`nationalId` varchar(64),
	`status` enum('active','inactive') NOT NULL DEFAULT 'active',
	`defaultProjectId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`),
	CONSTRAINT `employees_employeeCode_unique` UNIQUE(`employeeCode`)
);
--> statement-breakpoint
ALTER TABLE `attendance` ADD `employeeId` int;--> statement-breakpoint
ALTER TABLE `custodyMovements` ADD `employeeId` int;--> statement-breakpoint
ALTER TABLE `payroll` ADD `employeeId` int;