ALTER TABLE `projects` ADD `boqItems` json;--> statement-breakpoint
ALTER TABLE `projects` ADD `plannedSalaryBudget` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `plannedAdminExpenseBudget` decimal(14,2) DEFAULT '0' NOT NULL;