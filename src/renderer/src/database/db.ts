import type { Transaction } from "dexie"
import Dexie from "dexie"

import { LOCAL_DB_NAME } from "./constants"
import { dbSchemaV1, dbSchemaV2 } from "./db_schema"
import type { DB_Base } from "./schemas/base"
import type { DB_FeedId } from "./schemas/feed"
import type { DBModel } from "./types"

export interface LocalDBSchemaMap {
  entries: DB_Base
  feeds: DB_Base
  subscriptions: DB_Base
  entryRelated: DB_Base
  feedEntries: DB_FeedId
  feedUnreads: DB_FeedId
}

// Define a local DB
export class BrowserDB extends Dexie {
  public entries: BrowserDBTable<"entries">
  public feeds: BrowserDBTable<"feeds">
  public subscriptions: BrowserDBTable<"subscriptions">
  public entryRelated: BrowserDBTable<"entryRelated">
  public feedEntries: BrowserDBTable<"feedEntries">
  public feedUnreads: BrowserDBTable<"feedUnreads">

  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)
    this.version(2).stores(dbSchemaV2)
      .upgrade(this.upgradeToV2)

    this.entries = this.table("entries")
    this.feeds = this.table("feeds")
    this.subscriptions = this.table("subscriptions")
    this.entryRelated = this.table("entryRelated")
    this.feedEntries = this.table("feedEntries")
    this.feedUnreads = this.table("feedUnreads")
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
    table: Dexie.Table<DBModel<LocalDBSchemaMap[t]>, string>
  };
}
type BrowserDBTable<T extends keyof LocalDBSchemaMap> =
  BrowserDBSchema[T]["table"]
