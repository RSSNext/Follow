CREATE TABLE `subscriptions` (
	`feed_id` text NOT NULL,
	`user_id` text NOT NULL,
	`view` integer NOT NULL,
	`is_private` integer NOT NULL,
	`title` text,
	`category` text,
	`created_at` text,
	PRIMARY KEY(`feed_id`, `user_id`)
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`url` text NOT NULL,
	`description` text,
	`image` text,
	`error_at` text,
	`site_url` text,
	`type` text NOT NULL,
	`owner_user_id` text,
	`error_message` text
);
--> statement-breakpoint
INSERT INTO `__new_feeds`("id", "title", "url", "description", "image", "error_at", "site_url", "type", "owner_user_id", "error_message") SELECT "id", "title", "url", "description", "image", "error_at", "site_url", "type", "owner_user_id", "error_message" FROM `feeds`;--> statement-breakpoint
DROP TABLE `feeds`;--> statement-breakpoint
ALTER TABLE `__new_feeds` RENAME TO `feeds`;--> statement-breakpoint
PRAGMA foreign_keys=ON;