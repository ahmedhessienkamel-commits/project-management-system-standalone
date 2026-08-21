ALTER TABLE `projects` ADD `escrowCashAccountId` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `escrowTrusteeName` varchar(255);--> statement-breakpoint
ALTER TABLE `projects` ADD `escrowStatementReference` varchar(128);