CREATE TABLE `advanceRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestedBy` int NOT NULL,
	`employeeId` int,
	`amount` decimal(14,2) NOT NULL,
	`reason` text NOT NULL,
	`repaymentDate` date,
	`status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advanceRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaveRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requestedBy` int NOT NULL,
	`employeeId` int,
	`leaveType` enum('annual','sick','emergency','unpaid','official','other') NOT NULL DEFAULT 'annual',
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`days` decimal(8,2) NOT NULL DEFAULT '0',
	`reason` text,
	`status` enum('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
	`reviewedBy` int,
	`reviewedAt` timestamp,
	`rejectionReason` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaveRequests_id` PRIMARY KEY(`id`)
);
