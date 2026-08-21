ALTER TABLE `certificates` ADD `certificateItems` json;--> statement-breakpoint
ALTER TABLE `contractorContracts` ADD `contractType` enum('building_stage','supply','supply_installation') DEFAULT 'building_stage' NOT NULL;--> statement-breakpoint
ALTER TABLE `contractorContracts` ADD `contractItems` json;--> statement-breakpoint
