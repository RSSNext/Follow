import type { FC } from "react"

import type { CombinedEntryModel, FeedOrListRespModel } from "~/models"

export type UniversalItemProps = {
  entryId: string
  entryPreview?: CombinedEntryModel & {
    feeds: FeedOrListRespModel
    feedId: string
  }
  translation?: {
    title?: string
    description?: string
    content?: string
  } | null
}

export type EntryListItemFC<P extends object = object> = FC<P & UniversalItemProps> & {
  wrapperClassName?: string
}
