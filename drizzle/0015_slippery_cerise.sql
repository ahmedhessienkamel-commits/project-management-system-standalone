CREATE TABLE `materialRequisitionItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`requisitionId` int NOT NULL,
	`description` varchar(255) NOT NULL,
	`unit` varchar(64),
	`quantity` decimal(14,3) NOT NULL DEFAULT '1',
	`estimatedUnitCost` decimal(14,2) NOT NULL DEFAULT '0',
	`notes` text,
	CONSTRAINT `materialRequisitionItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `materialRequisitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int,
	`requestedBy` int NOT NULL,
	`requestNumber` varchar(128) NOT NULL,
	`description` text,
	`status` enum('draft','pending_approval','approved','rejected','converted','cancelled') NOT NULL DEFAULT 'draft',
	`requiredBy` date,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `materialRequisitions_id` PRIMARY KEY(`id`),
	CONSTRAINT `materialRequisitions_requestNumber_unique` UNIQUE(`requestNumber`)
);
--> statement-breakpoint
CREATE TABLE `purchaseOrderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseOrderId` int NOT NULL,
	`description` varchar(255) NOT NULL,
	`unit` varchar(64),
	`quantity` decimal(14,3) NOT NULL DEFAULT '1',
	`unitCost` decimal(14,2) NOT NULL DEFAULT '0',
	`receivedQuantity` decimal(14,3) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	CONSTRAINT `purchaseOrderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchaseOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int,
	`vendorId` int NOT NULL,
	`requisitionId` int,
	`orderNumber` varchar(128) NOT NULL,
	`status` enum('draft','pending_approval','approved','partially_received','received','cancelled') NOT NULL DEFAULT 'draft',
	`subtotal` decimal(14,2) NOT NULL DEFAULT '0',
	`taxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`orderDate` date,
	`expectedDate` date,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `purchaseOrders_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchaseOrders_orderNumber_unique` UNIQUE(`orderNumber`)
);
--> statement-breakpoint
CREATE TABLE `purchaseReceiptItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`receiptId` int NOT NULL,
	`purchaseOrderItemId` int NOT NULL,
	`quantity` decimal(14,3) NOT NULL DEFAULT '0',
	CONSTRAINT `purchaseReceiptItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `purchaseReceipts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`purchaseOrderId` int NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int,
	`receiptNumber` varchar(128) NOT NULL,
	`receivedDate` date,
	`notes` text,
	`status` enum('draft','posted','cancelled') NOT NULL DEFAULT 'draft',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `purchaseReceipts_id` PRIMARY KEY(`id`),
	CONSTRAINT `purchaseReceipts_receiptNumber_unique` UNIQUE(`receiptNumber`)
);
--> statement-breakpoint
ALTER TABLE `approvalRequests` ADD `approvalStage` varchar(32);--> statement-breakpoint
ALTER TABLE `approvalRequests` ADD `stageOrder` int;