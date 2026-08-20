CREATE TABLE `userInvitations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`jobTitle` varchar(255) NOT NULL,
	`role` enum('user','general_manager','project_manager','procurement_manager') NOT NULL DEFAULT 'user',
	`projectId` int,
	`status` enum('pending','accepted','cancelled','expired') NOT NULL DEFAULT 'pending',
	`token` varchar(128) NOT NULL,
	`invitedBy` int NOT NULL,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userInvitations_id` PRIMARY KEY(`id`),
	CONSTRAINT `userInvitations_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `jobTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `defaultProjectId` int;