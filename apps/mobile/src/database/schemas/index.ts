import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const feedsTable = sqliteTable("feeds", {
  id: text("id").primaryKey(),
  title: text("title"),
  url: text("url").notNull(),
  description: text("description"),
  image: text("image"),
  errorAt: text("error_at"),
  siteUrl: text("site_url"),
  type: text("type").notNull(),
  ownerUserId: text("owner_user_id"),
  errorMessage: text("error_message"),
})

export const subscriptionsTable = sqliteTable(
  "subscriptions",
  {
    feedId: text("feed_id").notNull(),
    userId: text("user_id").notNull(),
    view: integer("view").notNull(),
    isPrivate: integer("is_private").notNull(),
    title: text("title"),
    category: text("category"),
    createdAt: text("created_at"),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.feedId, table.userId] }),
  }),
)
