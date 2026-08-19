ALTER TABLE `collections` MODIFY COLUMN `saleId` int;--> statement-breakpoint
ALTER TABLE `collections` ADD `collectionType` enum('unit_sale','owner_payment','contract_payment','other') DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE `collections` ADD `partyName` varchar(255);