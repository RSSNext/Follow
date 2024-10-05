import type { Transaction } from "dexie"
import Dexie from "dexie"

import { LOCAL_DB_NAME } from "./constants"
import {
  dbSchemaV1,
  dbSchemaV2,
  dbSchemaV3,
  dbSchemaV4,
  dbSchemaV5,
  dbSchemaV6,
  dbSchemaV7,
} from "./db_schema"
import type { DB_Cleaner } from "./schemas/cleaner"
import type { DB_Entry, DB_EntryRelated } from "./schemas/entry"
import type { DB_Feed, DB_FeedUnread } from "./schemas/feed"
import type { DB_Inbox } from "./schemas/inbox"
import type { DB_List } from "./schemas/list"
import type { DB_Subscription } from "./schemas/subscription"

export interface LocalDBSchemaMap {
  entries: DB_Entry
  feeds: DB_Feed
  subscriptions: DB_Subscription
  entryRelated: DB_EntryRelated
  feedUnreads: DB_FeedUnread
  cleaner: DB_Cleaner
  lists: DB_List
  inboxes: DB_Inbox
}

// Define a local DB
export class BrowserDB extends Dexie {
  public entries: BrowserDBTable<"entries">
  public feeds: BrowserDBTable<"feeds">
  public subscriptions: BrowserDBTable<"subscriptions">
  public entryRelated: BrowserDBTable<"entryRelated">
  public feedUnreads: BrowserDBTable<"feedUnreads">
  public lists: BrowserDBTable<"lists">
  public inboxes: BrowserDBTable<"inboxes">
  public cleaner: BrowserDBTable<"cleaner">

  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)
    this.version(2).stores(dbSchemaV2).upgrade(this.upgradeToV2)
    this.version(3).stores(dbSchemaV3)
    this.version(4).stores(dbSchemaV4)
    this.version(5).stores(dbSchemaV5)
    this.version(6).stores(dbSchemaV6)
    this.version(7).stores(dbSchemaV7)

    this.entries = this.table("entries")
    this.feeds = this.table("feeds")
    this.subscriptions = this.table("subscriptions")
    this.entryRelated = this.table("entryRelated")
    this.feedUnreads = this.table("feedUnreads")
    this.cleaner = this.table("cleaner")
    this.lists = this.table("lists")
    this.inboxes = this.table("inboxes")
  }

  async upgradeToV2(trans: Transaction) {
    const session = trans.table("feedUnreads")
    session.delete("feedId")
  }
}

export const browserDB = new BrowserDB()

// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //
// ================================================ //

// types helper
export type BrowserDBSchema = {
  [t in keyof LocalDBSchemaMap]: {
    model: LocalDBSchemaMap[t]
    table: Dexie.Table<LocalDBSchemaMap[t], string>
  }
}
type BrowserDBTable<T extends keyof LocalDBSchemaMap> = BrowserDBSchema[T]["table"]
