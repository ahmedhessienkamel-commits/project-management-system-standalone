ALTER TABLE `collections` ADD `collectionDestination` enum('cash','bank','escrow') DEFAULT 'cash' NOT NULL;--> statement-breakpoint
ALTER TABLE `collections` ADD `cashAccountId` int;--> statement-breakpoint
ALTER TABLE `collections` ADD `escrowReference` varchar(128);