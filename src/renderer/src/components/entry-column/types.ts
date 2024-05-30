import type { EntryModel } from "@renderer/lib/types"

export type UniversalItemProps = {
  entryId: string
  entryPreview?: EntryModel
}

export type FilterTab = "all" | "unread"
