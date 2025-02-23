import { FeedViewType } from "@follow/constants"

import { EntryListContentGrid } from "@/src/modules/entry-list/EntryListContentGrid"

import { EntryListContentArticle } from "./EntryListContentArticle"
import { EntryListContentSocial } from "./EntryListContentSocial"
import { EntryListContextViewContext } from "./EntryListContext"

export function EntryListSelector({
  entryIds,
  viewId,
}: {
  entryIds: string[]
  viewId: FeedViewType
  active?: boolean
}) {
  let ContentComponent: typeof EntryListContentSocial | typeof EntryListContentGrid =
    EntryListContentArticle
  switch (viewId) {
    case FeedViewType.SocialMedia: {
      ContentComponent = EntryListContentSocial
      break
    }
    case FeedViewType.Pictures:
    case FeedViewType.Videos: {
      ContentComponent = EntryListContentGrid
      break
    }
    case FeedViewType.Articles: {
      ContentComponent = EntryListContentArticle
      break
    }
  }

  return (
    <EntryListContextViewContext.Provider value={viewId}>
      <ContentComponent entryIds={entryIds} />
    </EntryListContextViewContext.Provider>
  )
}
