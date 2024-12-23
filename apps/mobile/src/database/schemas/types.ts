import type { feedsTable, inboxesTable, listsTable, subscriptionsTable, unreadTable } from "."

export type SubscriptionSchema = typeof subscriptionsTable.$inferSelect

export type FeedSchema = typeof feedsTable.$inferSelect

export type InboxSchema = typeof inboxesTable.$inferSelect

export type ListSchema = typeof listsTable.$inferSelect

export type UnreadSchema = typeof unreadTable.$inferSelect
