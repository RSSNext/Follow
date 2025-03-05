import { FeedViewType } from "@follow/constants"
import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BottomTabBarHeightContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarHeightContext"
import { EntryListSelector } from "@/src/modules/entry-list/EntryListSelector"
import { EntryListContext, useSelectedView } from "@/src/modules/screen/atoms"
import { TimelineSelectorProvider } from "@/src/modules/screen/TimelineSelectorProvider"
import { useCollectionEntryList } from "@/src/store/collection/hooks"
import { useEntryIdsByCategory, useEntryIdsByFeedId } from "@/src/store/entry/hooks"
import { FEED_COLLECTION_LIST } from "@/src/store/entry/utils"
import { useListEntryIds } from "@/src/store/list/hooks"

export default function Feed() {
  const insets = useSafeAreaInsets()
  const { feedId: feedIdOrListIdOrCategory } = useLocalSearchParams()

  const isCollection = feedIdOrListIdOrCategory === FEED_COLLECTION_LIST
  const view = useSelectedView() ?? FeedViewType.Articles
  const collectionEntryIds = useCollectionEntryList(view)

  const entryIdsByFeedId = useEntryIdsByFeedId(feedIdOrListIdOrCategory as string)
  const entryIdsByCategory = useEntryIdsByCategory(feedIdOrListIdOrCategory as string)
  const entryIdsByListId = useListEntryIds(feedIdOrListIdOrCategory as string)

  const entryIds = isCollection
    ? collectionEntryIds
    : entryIdsByFeedId.length > 0
      ? entryIdsByFeedId
      : entryIdsByCategory.length > 0
        ? entryIdsByCategory
        : entryIdsByListId.length > 0
          ? entryIdsByListId
          : []

  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "feed" }), [])}>
      <BottomTabBarHeightContext.Provider value={insets.bottom}>
        <TimelineSelectorProvider>
          <EntryListSelector entryIds={entryIds} viewId={view} />
        </TimelineSelectorProvider>
      </BottomTabBarHeightContext.Provider>
    </EntryListContext.Provider>
  )
}
