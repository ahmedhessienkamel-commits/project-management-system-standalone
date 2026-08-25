CREATE TABLE `projectWorkLocations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`latitude` decimal(10,7) NOT NULL,
	`longitude` decimal(10,7) NOT NULL,
	`allowedRadiusMeters` decimal(10,2) NOT NULL DEFAULT '150',
	`isActive` boolean NOT NULL DEFAULT true,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projectWorkLocations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `projectWorkLocations_projectId_idx` ON `projectWorkLocations` (`projectId`);