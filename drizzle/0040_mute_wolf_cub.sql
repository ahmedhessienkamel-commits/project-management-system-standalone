ALTER TABLE `expenses` ADD `payrollBeneficiaryType` enum('company_employee','worker');--> statement-breakpoint
ALTER TABLE `expenses` ADD `payrollEmployeeId` int;--> statement-breakpoint
ALTER TABLE `expenses` ADD `payrollBeneficiaryName` varchar(255);