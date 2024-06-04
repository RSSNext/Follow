import type { EntryModel, FeedModel } from "@renderer/models"

export type UniversalItemProps = {
  entryId: string
  entryPreview?: EntryModel | {
    feeds: FeedModel
  }
}
