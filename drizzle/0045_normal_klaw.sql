ALTER TABLE `custodyMovements` ADD `vendorId` int;--> statement-breakpoint
ALTER TABLE `custodyMovements` ADD `payrollBeneficiaryType` enum('company_employee','worker');--> statement-breakpoint
ALTER TABLE `custodyMovements` ADD `payrollEmployeeId` int;--> statement-breakpoint
ALTER TABLE `custodyMovements` ADD `payrollBeneficiaryName` varchar(255);