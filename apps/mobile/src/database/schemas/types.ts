import type { feedsTable, subscriptionsTable } from "."

export type SubscriptionModel = typeof subscriptionsTable.$inferSelect

export type FeedModel = typeof feedsTable.$inferSelect
