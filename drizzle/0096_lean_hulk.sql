CREATE TABLE `marketingAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`siteId` int,
	`projectId` int,
	`name` varchar(255) NOT NULL,
	`assetType` enum('project_mockup','design','brochure','video','other') NOT NULL DEFAULT 'other',
	`fileUrl` varchar(2000) NOT NULL,
	`notes` text,
	`isArchived` int NOT NULL DEFAULT 0,
	`uploadedBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketingAssets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `marketingSites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`status` enum('draft','published','archived') NOT NULL DEFAULT 'draft',
	`publicUrl` varchar(2000),
	`customDomain` varchar(255),
	`googleMapsUrl` varchar(2000),
	`heroImageUrl` varchar(2000),
	`createdBy` int NOT NULL,
	`archivedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `marketingSites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetingParticipants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`meetingId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `meetingParticipants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`scheduledStart` timestamp NOT NULL,
	`scheduledEnd` timestamp NOT NULL,
	`meetingLink` varchar(2000),
	`status` enum('scheduled','active','completed','archived','cancelled') NOT NULL DEFAULT 'scheduled',
	`createdBy` int NOT NULL,
	`archivedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `meetings_id` PRIMARY KEY(`id`)
);
