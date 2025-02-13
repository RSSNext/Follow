import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs"
import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { EntryListScreen } from "@/src/modules/entry-list/entry-list"
import { EntryListContext } from "@/src/modules/screen/atoms"
import { useEntryIdsByCategory, useEntryIdsByFeedId } from "@/src/store/entry/hooks"

export default function Feed() {
  const { feedId: feedIdOrCategory } = useLocalSearchParams()
  const entryIdsByFeedId = useEntryIdsByFeedId(feedIdOrCategory as string)
  const entryIdsByCategory = useEntryIdsByCategory(feedIdOrCategory as string)
  const insets = useSafeAreaInsets()
  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "feed" }), [])}>
      <BottomTabBarHeightContext.Provider value={insets.bottom}>
        <EntryListScreen
          entryIds={entryIdsByFeedId.length > 0 ? entryIdsByFeedId : entryIdsByCategory}
        />
      </BottomTabBarHeightContext.Provider>
    </EntryListContext.Provider>
  )
}
