CREATE TABLE `serviceContractEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int,
	`contractId` int NOT NULL,
	`vendorId` int NOT NULL,
	`entryType` enum('equipment_rental','labor_supply') NOT NULL,
	`serviceDate` date NOT NULL,
	`periodStart` date,
	`periodEnd` date,
	`description` text NOT NULL,
	`equipmentClass` varchar(128),
	`quantity` decimal(14,3) NOT NULL DEFAULT '1',
	`rentalDays` decimal(14,3) NOT NULL DEFAULT '0',
	`dailyRate` decimal(14,2) NOT NULL DEFAULT '0',
	`workerCategory` varchar(128),
	`headcount` decimal(14,3) NOT NULL DEFAULT '0',
	`workDays` decimal(14,3) NOT NULL DEFAULT '0',
	`dailyWage` decimal(14,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`expenseId` int,
	`status` enum('pending_approval','posted','cancelled') NOT NULL DEFAULT 'pending_approval',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `serviceContractEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contractorContracts` MODIFY COLUMN `contractType` enum('building_stage','supply','supply_installation','equipment_rental','labor_supply') NOT NULL DEFAULT 'building_stage';