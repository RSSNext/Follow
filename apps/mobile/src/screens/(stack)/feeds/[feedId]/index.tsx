import { FeedViewType } from "@follow/constants"
import { useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BottomTabBarHeightContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarHeightContext"
import type { NavigationControllerView } from "@/src/lib/navigation/types"
import { EntryListSelector } from "@/src/modules/entry-list/EntryListSelector"
import { EntryListContext, useSelectedView } from "@/src/modules/screen/atoms"
import { TimelineSelectorProvider } from "@/src/modules/screen/TimelineSelectorProvider"
import { useCollectionEntryList } from "@/src/store/collection/hooks"
import {
  useEntryIdsByCategory,
  useEntryIdsByFeedId,
  useEntryIdsByInboxId,
  useEntryIdsByListId,
} from "@/src/store/entry/hooks"
import { FEED_COLLECTION_LIST } from "@/src/store/entry/utils"

export const FeedScreen: NavigationControllerView<{
  feedId: string
}> = ({ feedId }) => {
  const insets = useSafeAreaInsets()
  const feedIdentifier = feedId as string

  const isCollection = feedIdentifier === FEED_COLLECTION_LIST
  const view = useSelectedView() ?? FeedViewType.Articles
  const collectionEntryIds = useCollectionEntryList(view)

  const entryIdsByFeedId = useEntryIdsByFeedId(feedIdentifier)
  const entryIdsByCategory = useEntryIdsByCategory(feedIdentifier)
  const entryIdsByListId = useEntryIdsByListId(feedIdentifier)
  const entryIdsByInboxId = useEntryIdsByInboxId(feedIdentifier)

  const entryIds = isCollection
    ? collectionEntryIds
    : getEntryIdsFromMultiplePlace(
        entryIdsByFeedId,
        entryIdsByCategory,
        entryIdsByListId,
        entryIdsByInboxId,
      )

  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "feed" }), [])}>
      <BottomTabBarHeightContext.Provider value={insets.bottom}>
        <TimelineSelectorProvider feedId={feedId}>
          <EntryListSelector entryIds={entryIds} viewId={view} />
        </TimelineSelectorProvider>
      </BottomTabBarHeightContext.Provider>
    </EntryListContext.Provider>
  )
}

function getEntryIdsFromMultiplePlace(...entryIds: Array<string[] | undefined>) {
  return entryIds.find((ids) => ids?.length) ?? []
}
