CREATE TABLE `custodyMovements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`stageId` int,
	`employeeCode` varchar(64) NOT NULL,
	`employeeName` varchar(255) NOT NULL,
	`movementType` enum('issue','spend','return','settlement') NOT NULL,
	`allocationType` enum('project','general_cash','general_admin') NOT NULL,
	`description` text NOT NULL,
	`amount` decimal(14,2) NOT NULL DEFAULT '0',
	`signedAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`movementDate` date,
	`expenseType` varchar(64),
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `custodyMovements_id` PRIMARY KEY(`id`)
);
