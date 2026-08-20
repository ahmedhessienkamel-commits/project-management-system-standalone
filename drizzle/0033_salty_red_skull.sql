CREATE TABLE `userOperationPermissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`operationKey` varchar(64) NOT NULL,
	`mode` enum('allow','approval','deny') NOT NULL DEFAULT 'approval',
	`updatedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userOperationPermissions_id` PRIMARY KEY(`id`)
);
