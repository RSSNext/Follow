import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"

import { EntryListScreen } from "@/src/modules/entry-list/entry-list"
import { EntryListContext } from "@/src/modules/feed-drawer/atoms"
import { useEntryIdsByCategory, useEntryIdsByFeedId } from "@/src/store/entry/hooks"

export default function Feed() {
  const { feedId: feedIdOrCategory } = useLocalSearchParams()
  const entryIdsByFeedId = useEntryIdsByFeedId(feedIdOrCategory as string)
  const entryIdsByCategory = useEntryIdsByCategory(feedIdOrCategory as string)
  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "feed" }), [])}>
      <EntryListScreen
        entryIds={entryIdsByFeedId.length > 0 ? entryIdsByFeedId : entryIdsByCategory}
      />
    </EntryListContext.Provider>
  )
}
