import { Stack, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { View } from "react-native"

import { BlurEffect } from "@/src/components/common/BlurEffect"
import { EntryColumnGrid } from "@/src/modules/entry/gird"
import { getEntry } from "@/src/store/entry/getter"
import { useEntryIdsByFeedId, usePrefetchEntries } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

function FeedEntryList({ feedId }: { feedId: string }) {
  const [pageParam, setPageParam] = useState<string | undefined>()
  usePrefetchEntries({ feedId, pageParam })
  const feed = useFeed(feedId)
  const entryIds = useEntryIdsByFeedId(feedId)

  return (
    <View className="flex-1 flex-row bg-gray-50">
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle: "Subscriptions",
          headerBackground: BlurEffect,
          headerTransparent: true,
          headerTitle: feed?.title ?? "Feed",
        }}
      />
      <EntryColumnGrid
        entryIds={entryIds}
        onEndReached={() => {
          const lastEntryId = entryIds.at(-1)
          if (!lastEntryId) return
          const lastEntry = getEntry(lastEntryId)
          if (!lastEntry) return
          setPageParam(lastEntry.publishedAt.toISOString())
        }}
      />
    </View>
  )
}

export default function Feed() {
  const { feedId } = useLocalSearchParams()
  if (!feedId || Array.isArray(feedId)) {
    return null
  }

  return <FeedEntryList feedId={feedId} />
}
