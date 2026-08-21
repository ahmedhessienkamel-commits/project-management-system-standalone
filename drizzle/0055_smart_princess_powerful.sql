ALTER TABLE `certificates` ADD `contractItemIndex` int;--> statement-breakpoint
ALTER TABLE `certificates` ADD `inventoryItemId` int;--> statement-breakpoint
ALTER TABLE `certificates` ADD `costItemId` int;--> statement-breakpoint
ALTER TABLE `certificates` ADD `accountId` int;--> statement-breakpoint
ALTER TABLE `inventoryMovements` ADD `contractId` int;--> statement-breakpoint
ALTER TABLE `inventoryMovements` ADD `contractItemIndex` int;