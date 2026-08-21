ALTER TABLE `accounts` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `cashAccounts` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `companyProfiles` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `companyId` int;