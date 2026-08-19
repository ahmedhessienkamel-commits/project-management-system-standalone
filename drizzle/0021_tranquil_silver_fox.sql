CREATE TABLE `fixedAssetDepreciation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assetId` int NOT NULL,
	`periodStart` date NOT NULL,
	`periodEnd` date NOT NULL,
	`depreciationAmount` decimal(14,2) NOT NULL,
	`accumulatedAmount` decimal(14,2) NOT NULL,
	`netBookValue` decimal(14,2) NOT NULL,
	`journalDocumentId` int,
	`status` enum('planned','posted') NOT NULL DEFAULT 'planned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `fixedAssetDepreciation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `fixedAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int,
	`assetCode` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(128) NOT NULL DEFAULT 'معدات وأصول تشغيلية',
	`acquisitionDate` date NOT NULL,
	`inServiceDate` date NOT NULL,
	`acquisitionCost` decimal(14,2) NOT NULL,
	`residualValue` decimal(14,2) NOT NULL DEFAULT '0',
	`usefulLifeMonths` int NOT NULL,
	`depreciationMethod` enum('straight_line') NOT NULL DEFAULT 'straight_line',
	`assetAccountId` int NOT NULL,
	`depreciationExpenseAccountId` int NOT NULL,
	`accumulatedDepreciationAccountId` int NOT NULL,
	`sourceDocumentId` int,
	`status` enum('active','disposed') NOT NULL DEFAULT 'active',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fixedAssets_id` PRIMARY KEY(`id`),
	CONSTRAINT `fixedAssets_assetCode_unique` UNIQUE(`assetCode`)
);
