import { resolve } from "node:path"

import { app } from "electron"
import { JSONFileSyncPreset } from "lowdb/node"

export const db = JSONFileSyncPreset(
  resolve(app.getPath("userData"), "db.json"),
  {},
)

export const store = {
  get: (key: string) => db.data[key],
  set: (key: string, value: any) => {
    db.data[key] = value
    db.write()
  },
}
