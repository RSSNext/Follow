CREATE TABLE `feeds` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`url` text,
	`description` text,
	`image` text,
	`error` text,
	`error_at` text,
	`site_url` text,
	`type` text,
	`owner_user_id` text,
	`error_message` text
);
