/**
 * @see https://github.com/lobehub/lobe-chat/blob/adebf0a92167faad48581b0b0780cf8faeba362f/src/database/client/core/model.ts
 */

import type Dexie from "dexie"
import type { ZodObject } from "zod"

import type { BrowserDB, BrowserDBSchema } from "./db"
import { browserDB } from "./db"

export class BaseModel<
  N extends keyof BrowserDBSchema = any,
  // T extends { id: string } = any,
  // T = BrowserDBSchema[N]["table"],
> {
  protected readonly db: BrowserDB
  // used to data validation, but use now

  private readonly schema: ZodObject<any>
  private readonly _tableName: keyof BrowserDBSchema

  constructor(table: N, schema: ZodObject<any>, db = browserDB) {
    this.db = db
    this.schema = schema
    this._tableName = table
  }

  get table() {
    return this.db[this._tableName] as Dexie.Table
  }
}
