ALTER TABLE `vendors` ADD `partyType` enum('supplier','customer') DEFAULT 'supplier' NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` ADD `entityType` enum('individual','company') DEFAULT 'company' NOT NULL;--> statement-breakpoint
ALTER TABLE `vendors` ADD `nationalAddress` text;--> statement-breakpoint
ALTER TABLE `vendors` ADD `address` text;--> statement-breakpoint
ALTER TABLE `vendors` ADD `phone` varchar(64);--> statement-breakpoint
ALTER TABLE `vendors` ADD `email` varchar(255);