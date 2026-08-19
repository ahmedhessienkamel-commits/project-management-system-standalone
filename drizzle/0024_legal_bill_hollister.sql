ALTER TABLE `employees` ADD `department` varchar(255);--> statement-breakpoint
ALTER TABLE `employees` ADD `managerName` varchar(255);--> statement-breakpoint
ALTER TABLE `employees` ADD `email` varchar(255);--> statement-breakpoint
ALTER TABLE `employees` ADD `nationality` varchar(128);--> statement-breakpoint
ALTER TABLE `employees` ADD `birthDate` date;--> statement-breakpoint
ALTER TABLE `employees` ADD `hireDate` date;--> statement-breakpoint
ALTER TABLE `employees` ADD `workLocation` varchar(255);--> statement-breakpoint
ALTER TABLE `employees` ADD `bankName` varchar(255);--> statement-breakpoint
ALTER TABLE `employees` ADD `iban` varchar(128);--> statement-breakpoint
ALTER TABLE `employees` ADD `insuranceNumber` varchar(128);--> statement-breakpoint
ALTER TABLE `employees` ADD `basicSalary` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `housingAllowance` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `transportAllowance` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `otherAllowances` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `standardDeduction` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `employees` ADD `notes` text;