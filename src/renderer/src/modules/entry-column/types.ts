import type { CombinedEntryModel, FeedModel } from "@renderer/models"
import type { FC } from "react"

export type UniversalItemProps = {
  entryId: string
  entryPreview?: CombinedEntryModel & {
    feeds: FeedModel
    feedId: string
  }
  translation?: {
    title?: string
    description?: string
  } | null
}

export type EntryListItemFC<P extends object = object> = FC<P & UniversalItemProps> & {
  wrapperClassName?: string
}
