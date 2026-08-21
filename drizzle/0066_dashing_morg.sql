ALTER TABLE `accountingDocuments` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `certificates` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `collections` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `contractorContracts` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `expenses` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `inventoryMovements` ADD `companyId` int;--> statement-breakpoint
ALTER TABLE `sales` ADD `companyId` int;