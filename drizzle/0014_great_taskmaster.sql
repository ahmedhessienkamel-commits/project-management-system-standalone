CREATE TABLE `dailyTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`assignedEmployeeId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`dueDate` timestamp,
	`priority` varchar(16) NOT NULL DEFAULT 'normal',
	`status` varchar(16) NOT NULL DEFAULT 'open',
	`createdBy` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyTasks_id` PRIMARY KEY(`id`)
);
