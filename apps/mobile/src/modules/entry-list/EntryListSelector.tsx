import { FeedViewType } from "@follow/constants"
import type { FlashList } from "@shopify/flash-list"

import { useRegisterNavigationScrollView } from "@/src/components/layouts/tabbar/hooks"
import { EntryListContentPicture } from "@/src/modules/entry-list/EntryListContentPicture"

import { EntryListContentArticle } from "./EntryListContentArticle"
import { EntryListContentSocial } from "./EntryListContentSocial"
import { EntryListContentVideo } from "./EntryListContentVideo"
import { EntryListContextViewContext } from "./EntryListContext"

export function EntryListSelector({
  entryIds,
  viewId,
  active = true,
}: {
  entryIds: string[]
  viewId: FeedViewType
  active?: boolean
}) {
  const ref = useRegisterNavigationScrollView<FlashList<any>>(active)

  let ContentComponent:
    | typeof EntryListContentSocial
    | typeof EntryListContentPicture
    | typeof EntryListContentVideo
    | typeof EntryListContentArticle = EntryListContentArticle
  switch (viewId) {
    case FeedViewType.SocialMedia: {
      ContentComponent = EntryListContentSocial
      break
    }
    case FeedViewType.Pictures: {
      ContentComponent = EntryListContentPicture
      break
    }
    case FeedViewType.Videos: {
      ContentComponent = EntryListContentVideo
      break
    }
    case FeedViewType.Articles: {
      ContentComponent = EntryListContentArticle
      break
    }
  }

  return (
    <EntryListContextViewContext.Provider value={viewId}>
      <ContentComponent ref={ref} entryIds={entryIds} active={active} />
    </EntryListContextViewContext.Provider>
  )
}
