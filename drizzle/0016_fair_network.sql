ALTER TABLE `purchaseOrders` ADD `invoiceNumber` varchar(128);--> statement-breakpoint
ALTER TABLE `purchaseOrders` ADD `invoiceStatus` enum('not_received','received','partially_paid','paid') DEFAULT 'not_received' NOT NULL;--> statement-breakpoint
ALTER TABLE `purchaseOrders` ADD `invoicedAmount` decimal(14,2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE `purchaseOrders` ADD `paidAmount` decimal(14,2) DEFAULT '0' NOT NULL;