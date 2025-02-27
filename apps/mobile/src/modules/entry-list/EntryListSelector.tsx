import { FeedViewType } from "@follow/constants"
import type { FlashList } from "@shopify/flash-list"
import type { RefObject } from "react"
import { useContext, useEffect, useRef } from "react"
import type { ScrollView } from "react-native"

import { SetAttachNavigationScrollViewContext } from "@/src/components/layouts/tabbar/contexts/AttachNavigationScrollViewContext"
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
  const setAttachNavigationScrollViewRef = useContext(SetAttachNavigationScrollViewContext)

  const ref = useRef<FlashList<any>>(null)
  useEffect(() => {
    if (!active) return
    if (setAttachNavigationScrollViewRef) {
      setAttachNavigationScrollViewRef(ref as unknown as RefObject<ScrollView>)
    }
  }, [setAttachNavigationScrollViewRef, ref, active])

  let ContentComponent: typeof EntryListContentSocial | typeof EntryListContentPicture =
    EntryListContentArticle
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
      <ContentComponent ref={ref} entryIds={entryIds} />
    </EntryListContextViewContext.Provider>
  )
}
