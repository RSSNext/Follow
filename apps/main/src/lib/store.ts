import { resolve } from "node:path"

import { app } from "electron"
import type { LowSync } from "lowdb/lib/core/Low"
import { JSONFileSyncPreset } from "lowdb/node"

export const db = JSONFileSyncPreset(
  resolve(app.getPath("userData"), "db.json"),
  {},
) as LowSync<any>

export const store = {
  get: (key: string) => db.data[key],
  set: (key: string, value: any) => {
    db.data[key] = value
    db.write()
  },
}
