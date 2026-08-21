ALTER TABLE `dailyTasks` ADD `assignedEmployeeIds` text;--> statement-breakpoint
ALTER TABLE `dailyTasks` ADD `startDate` timestamp;--> statement-breakpoint
ALTER TABLE `dailyTasks` ADD `endDate` timestamp;--> statement-breakpoint
ALTER TABLE `dailyTasks` ADD `progress` int DEFAULT 0 NOT NULL;