CREATE TABLE `approvalPolicies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`entityType` varchar(32) NOT NULL,
	`thresholdAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`createdBy` int NOT NULL,
	`updatedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `approvalPolicies_id` PRIMARY KEY(`id`)
);
