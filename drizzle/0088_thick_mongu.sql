ALTER TABLE `contractorContracts` ADD `plannedBudgetItems` json;--> statement-breakpoint
ALTER TABLE `contractorContracts` ADD `plannedSalaryBudget` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `contractorContracts` ADD `plannedAdminExpenseBudget` decimal(14,2) DEFAULT '0' NOT NULL;