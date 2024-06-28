import Dexie from "dexie"

import { LOCAL_DB_NAME } from "./constants"
import {
  dbSchemaV1,
} from "./db_schema"
import type { DB_Entry } from "./schemas/entry"
import type { DBModel } from "./types"

export interface LobeDBSchemaMap {

  entries: DB_Entry
  // TODO - Add more schemas here
  feeds: DB_Entry
  subscriptions: DB_Entry
  entryReads: DB_Entry
  feedEntries: DB_Entry
}

// Define a local DB
export class BrowserDB extends Dexie {
  public entries: BrowserDBTable<"entries">
  public feeds: BrowserDBTable<"feeds">
  public subscriptions: BrowserDBTable<"subscriptions">
  public entryReads: BrowserDBTable<"entryReads">
  public feedEntries: BrowserDBTable<"feedEntries">

  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)

    this.entries = this.table("entries")
    this.feeds = this.table("feeds")
    this.subscriptions = this.table("subscriptions")
    this.entryReads = this.table("entryReads")
    this.feedEntries = this.table("feedEntries")
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
  [t in keyof LobeDBSchemaMap]: {
    model: LobeDBSchemaMap[t]
    table: Dexie.Table<DBModel<LobeDBSchemaMap[t]>, string>
  };
}
type BrowserDBTable<T extends keyof LobeDBSchemaMap> = BrowserDBSchema[T]["table"]
