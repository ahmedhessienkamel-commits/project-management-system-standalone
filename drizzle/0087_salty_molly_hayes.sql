ALTER TABLE `purchaseOrderItems` ADD `inventoryItemId` int;--> statement-breakpoint
ALTER TABLE `purchaseOrderItems` ADD `costItemId` int;--> statement-breakpoint
ALTER TABLE `sales` ADD `costItemId` int;--> statement-breakpoint
CREATE INDEX `projectBudgets_projectId_idx` ON `projectBudgets` (`projectId`);--> statement-breakpoint
CREATE INDEX `projectBudgets_companyId_idx` ON `projectBudgets` (`companyId`);