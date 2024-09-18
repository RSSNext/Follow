import type { EntryModel } from "@renderer/models"

export type DB_Entry = EntryModel & { feedId: string }

export type DB_EntryRelated = {
  id: string
  data: any
}
