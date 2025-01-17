import type { EntrySchema } from "@/src/database/schemas/types"

export type EntryModel = EntrySchema
export type FetchEntriesProps = {
  feedId?: number | string
  inboxId?: number | string
  listId?: number | string
  view?: number
  read?: boolean
  limit?: number
  pageParam?: string
  isArchived?: boolean
}
