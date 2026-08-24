ALTER TABLE `projectWorkLocations` MODIFY COLUMN `projectId` int;--> statement-breakpoint
ALTER TABLE `projectWorkLocations` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `projectWorkLocations` ADD `locationType` enum('project','administrative_office') DEFAULT 'project' NOT NULL;