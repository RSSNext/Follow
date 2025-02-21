import { FeedViewType } from "@follow/constants"

import { useScrollToTopRef } from "@/src/atoms/scroll-to-top"
import { EntryListContentGrid } from "@/src/modules/entry-list/EntryListContentGrid"

import { EntryListContentArticle } from "./EntryListContentArticle"
import { EntryListContentSocial } from "./EntryListContentSocial"

export function EntryListSelector({
  entryIds,
  viewId,
  active = true,
}: {
  entryIds: string[]
  viewId: FeedViewType
  active?: boolean
}) {
  const ref = useScrollToTopRef(active)

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

  return <ContentComponent ref={ref} entryIds={entryIds} />
}
