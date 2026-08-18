ALTER TABLE `expenses` ADD `unit` varchar(64);--> statement-breakpoint
ALTER TABLE `expenses` ADD `quantity` decimal(14,3) DEFAULT '1' NOT NULL;