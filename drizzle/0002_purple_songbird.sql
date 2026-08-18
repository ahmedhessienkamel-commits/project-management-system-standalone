CREATE TABLE `attachments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`entityType` varchar(64) NOT NULL,
	`entityId` int NOT NULL,
	`documentType` varchar(128) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileUrl` text NOT NULL,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`employeeName` varchar(255) NOT NULL,
	`attendanceDate` date NOT NULL,
	`checkIn` varchar(16),
	`checkOut` varchar(16),
	`status` enum('present','absent','late','leave') NOT NULL DEFAULT 'present',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`stageId` int,
	`vendorId` int,
	`certificateNumber` varchar(128) NOT NULL,
	`description` text,
	`preTaxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`taxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`paidAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('draft','pending','approved','rejected','paid') NOT NULL DEFAULT 'draft',
	`certificateDate` date,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`saleId` int NOT NULL,
	`receiptReference` varchar(128),
	`collectionDate` date,
	`amount` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('draft','received','reversed') NOT NULL DEFAULT 'draft',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `custody` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`holderName` varchar(255) NOT NULL,
	`issueDate` date,
	`issuedAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`settledAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('open','partially_settled','settled') NOT NULL DEFAULT 'open',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `custody_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`employeeName` varchar(255) NOT NULL,
	`employeeCode` varchar(64),
	`month` int NOT NULL,
	`year` int NOT NULL,
	`classification` enum('project','administrative') NOT NULL DEFAULT 'project',
	`preTaxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`taxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('draft','pending','approved','paid') NOT NULL DEFAULT 'draft',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payroll_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `periodLocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`periodYear` int NOT NULL,
	`periodMonth` int NOT NULL,
	`lockedBy` int NOT NULL,
	`lockedAt` timestamp NOT NULL DEFAULT (now()),
	`reason` text,
	CONSTRAINT `periodLocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`unitId` int NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerPhone` varchar(64),
	`saleDate` date,
	`preTaxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`taxAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`totalAmount` decimal(14,2) NOT NULL DEFAULT '0',
	`recognizedRevenue` decimal(14,2) NOT NULL DEFAULT '0',
	`status` enum('draft','reserved','confirmed','cancelled') NOT NULL DEFAULT 'draft',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `units` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`code` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(128),
	`status` enum('available','reserved','sold','cancelled') NOT NULL DEFAULT 'available',
	`listPrice` decimal(14,2) NOT NULL DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `units_id` PRIMARY KEY(`id`)
);
