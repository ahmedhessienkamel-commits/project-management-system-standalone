CREATE TABLE `employeeWorkStarts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`projectId` int,
	`workStartDate` date NOT NULL,
	`jobTitle` varchar(255),
	`workLocation` varchar(255),
	`notes` text,
	`employeeSignatureName` varchar(255) NOT NULL,
	`employeeSignedAt` timestamp NOT NULL,
	`generalManagerUserId` int,
	`generalManagerSignedAt` timestamp,
	`status` enum('pending_general_manager','signed','rejected') NOT NULL DEFAULT 'pending_general_manager',
	`rejectionReason` text,
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employeeWorkStarts_id` PRIMARY KEY(`id`)
);
