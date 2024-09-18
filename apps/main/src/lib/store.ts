import { resolve } from "node:path"

import { app } from "electron"
import { JSONFileSyncPreset } from "lowdb/node"

const db = JSONFileSyncPreset(resolve(app.getPath("userData"), "db.json"), {}) as {
  data: Record<string, unknown>
  write: () => void
  read: () => void
}

export const store = {
  get: (key: string) => db.data[key] as any,
  set: (key: string, value: any) => {
    db.data[key] = value
    db.write()
  },
}
