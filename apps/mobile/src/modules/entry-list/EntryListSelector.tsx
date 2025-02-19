import { FeedViewType } from "@follow/constants"

import { EntryListContentGrid } from "@/src/modules/entry-list/EntryListContentGrid"

import { EntryListContentArticle } from "./EntryListContentArticle"
import { EntryListContentSocial } from "./EntryListContentSocial"

export function EntryListSelector({
  entryIds,
  viewId,
}: {
  entryIds: string[]
  viewId: FeedViewType
}) {
  let ContentComponent = EntryListContentArticle
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

  return <ContentComponent entryIds={entryIds} />
}
