import type { EntryModel, FeedModel } from "@renderer/lib/types"

export type UniversalItemProps = {
  entryId: string
  entryPreview?: EntryModel | {
    feeds: FeedModel
  }
}
