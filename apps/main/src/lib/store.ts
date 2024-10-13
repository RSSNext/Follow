import { resolve } from "node:path"

import { app } from "electron"
import { JSONFileSyncPreset } from "lowdb/node"

let db: {
  data: Record<string, unknown>
  write: () => void
  read: () => void
}

const createOrGetDb = () => {
  if (!db) {
    db = JSONFileSyncPreset(resolve(app.getPath("userData"), "db.json"), {}) as typeof db
  }
  return db
}
export const store = {
  get: (key: string) => {
    const db = createOrGetDb()

    return db.data[key] as any
  },
  set: (key: string, value: any) => {
    const db = createOrGetDb()
    db.data[key] = value
    db.write()
  },
}
