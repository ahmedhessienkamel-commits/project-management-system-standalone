ALTER TABLE `materialRequisitionItems` ADD `inventoryItemId` int;--> statement-breakpoint
ALTER TABLE `materialRequisitionItems` ADD `costItemId` int;--> statement-breakpoint
ALTER TABLE `materialRequisitionItems` ADD `contractId` int;--> statement-breakpoint
ALTER TABLE `materialRequisitionItems` ADD `contractItemIndex` int;--> statement-breakpoint
ALTER TABLE `materialRequisitionItems` ADD `planningStatus` enum('within_plan','over_plan','unplanned') DEFAULT 'unplanned' NOT NULL;--> statement-breakpoint
ALTER TABLE `materialRequisitionItems` ADD `plannedQuantity` decimal(14,3) DEFAULT '0' NOT NULL;