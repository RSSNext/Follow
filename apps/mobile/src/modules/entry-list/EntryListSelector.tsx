import { FeedViewType } from "@follow/constants"
import type { FlashList } from "@shopify/flash-list"
import type { RefObject } from "react"
import { useContext, useEffect, useRef } from "react"
import type { ScrollView } from "react-native"

import { SetAttachNavigationScrollViewContext } from "@/src/components/ui/tabbar/contexts/AttachNavigationScrollViewContext"
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
  const setAttachNavigationScrollViewRef = useContext(SetAttachNavigationScrollViewContext)

  const ref = useRef<FlashList<any>>(null)
  useEffect(() => {
    if (!active) return
    if (setAttachNavigationScrollViewRef) {
      setAttachNavigationScrollViewRef(ref as unknown as RefObject<ScrollView>)
    }
  }, [setAttachNavigationScrollViewRef, ref, active])

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
