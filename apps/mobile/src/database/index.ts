import { drizzle } from "drizzle-orm/expo-sqlite"
import * as SQLite from "expo-sqlite"

import * as schema from "./schemas"

export const sqlite = SQLite.openDatabaseSync("follow.db")

export const db = drizzle(sqlite, {
  schema,
})
