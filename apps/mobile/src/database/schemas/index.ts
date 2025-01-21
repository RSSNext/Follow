import type { FeedViewType } from "@follow/constants"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

import type { AttachmentsModel, ExtraModel, MediaModel } from "./types"

export const feedsTable = sqliteTable("feeds", {
  id: text("id").primaryKey(),
  title: text("title"),
  url: text("url").notNull(),
  description: text("description"),
  image: text("image"),
  errorAt: text("error_at"),
  siteUrl: text("site_url"),
  ownerUserId: text("owner_user_id"),
  errorMessage: text("error_message"),
})

export const subscriptionsTable = sqliteTable("subscriptions", {
  feedId: text("feed_id"),
  listId: text("list_id"),
  inboxId: text("inbox_id"),
  userId: text("user_id").notNull(),
  view: integer("view").notNull().$type<FeedViewType>(),
  isPrivate: integer("is_private").notNull(),
  title: text("title"),
  category: text("category"),
  createdAt: text("created_at"),
  type: text("type").notNull().$type<"feed" | "list" | "inbox">(),
  id: text("id").primaryKey(),
})

export const inboxesTable = sqliteTable("inboxes", {
  id: text("id").primaryKey(),
  title: text("title"),
})

export const listsTable = sqliteTable("lists", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  feedIds: text("feed_ids", { mode: "json" }).$type<string>(),
  description: text("description"),
  view: integer("view").notNull().$type<FeedViewType>(),
  image: text("image"),
  fee: integer("fee"),
  ownerUserId: text("owner_user_id"),
  entryIds: text("entry_ids", { mode: "json" }).$type<string[]>(),
})

export const unreadTable = sqliteTable("unread", {
  subscriptionId: text("subscription_id").notNull().primaryKey(),
  count: integer("count").notNull(),
})

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  handle: text("handle"),
  name: text("name"),
  image: text("image"),
  isMe: integer("is_me").notNull(),
})

export const entriesTable = sqliteTable("entries", {
  id: text("id").primaryKey(),
  title: text("title"),
  url: text("url"),
  content: text("content"),
  description: text("description"),
  guid: text("guid").notNull(),
  author: text("author"),
  authorUrl: text("author_url"),
  authorAvatar: text("author_avatar"),
  insertedAt: integer("inserted_at", { mode: "timestamp" }).notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" }).notNull(),
  media: text("media", { mode: "json" }).$type<MediaModel[]>(),
  categories: text("categories", { mode: "json" }).$type<string[]>(),
  attachments: text("attachments", { mode: "json" }).$type<AttachmentsModel[]>(),
  extra: text("extra", { mode: "json" }).$type<ExtraModel>(),
  language: text("language"),

  feedId: text("feed_id"),

  inboxHandle: text("inbox_handle"),
  read: integer("read", { mode: "boolean" }),
})
