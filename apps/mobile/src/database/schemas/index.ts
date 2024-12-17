import { sqliteTable, text } from "drizzle-orm/sqlite-core"

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
