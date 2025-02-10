import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"

import { EntryListScreen } from "@/src/modules/entry-list/entry-list"
import { EntryListContext } from "@/src/modules/feed-drawer/atoms"
import { useEntryIdsByFeedId } from "@/src/store/entry/hooks"

export default function Feed() {
  const { feedId } = useLocalSearchParams()
  const entryIds = useEntryIdsByFeedId(feedId as string)
  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "feed" }), [])}>
      <EntryListScreen entryIds={entryIds} />
    </EntryListContext.Provider>
  )
}
