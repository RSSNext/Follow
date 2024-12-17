import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const feedsTable = sqliteTable("feeds", {
  id: text("id").primaryKey(),
  title: text("title"),
  url: text("url"),
  description: text("description"),
  image: text("image"),
  error: text("error"),
  errorAt: text("error_at"),
  siteUrl: text("site_url"),
  type: text("type"),
  ownerUserId: text("owner_user_id"),
  errorMessage: text("error_message"),
})

export const subscriptionsTable = sqliteTable(
  "subscriptions",
  {
    feedId: text("feed_id"),
    userId: text("user_id"),
    view: integer("view"),
    isPrivate: integer("is_private"),
    title: text("title"),
    category: text("category"),
    createdAt: integer("created_at"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.feedId, table.userId] }),
  }),
)
