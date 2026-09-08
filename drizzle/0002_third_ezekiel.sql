CREATE TABLE `daily_stats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`pv` integer DEFAULT 0 NOT NULL,
	`uv` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `daily_stats_date_unique` ON `daily_stats` (`date`);--> statement-breakpoint
CREATE TABLE `todos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text,
	`priority` text DEFAULT 'medium' NOT NULL,
	`due_date` integer,
	`note` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
