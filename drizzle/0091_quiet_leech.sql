ALTER TABLE `attendance` ADD `source` enum('manual','biometric','mobile_location','import') DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE `attendance` ADD `latitude` decimal(10,7);--> statement-breakpoint
ALTER TABLE `attendance` ADD `longitude` decimal(10,7);--> statement-breakpoint
ALTER TABLE `attendance` ADD `locationAccuracyMeters` decimal(10,2);--> statement-breakpoint
ALTER TABLE `attendance` ADD `locationCapturedAt` timestamp;