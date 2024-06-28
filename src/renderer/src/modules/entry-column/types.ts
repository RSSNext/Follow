import type { CombinedEntryModel, FeedModel } from "@renderer/models"

export type UniversalItemProps = {
  entryId: string
  entryPreview?: CombinedEntryModel & {
    feeds: FeedModel
  }
  translation?: {
    title?: string
    description?: string
  } | null
}
