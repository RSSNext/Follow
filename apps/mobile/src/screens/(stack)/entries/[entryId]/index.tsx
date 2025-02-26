import { FeedViewType } from "@follow/constants"
import { useLocalSearchParams } from "expo-router"
import { atom } from "jotai"
import { useMemo } from "react"
import { Pressable, Text, View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BottomTabBarHeightContext } from "@/src/components/layouts/tabbar/contexts/BottomTabBarHeightContext"
import { SafeNavigationScrollView } from "@/src/components/layouts/views/SafeNavigationScrollView"
import { EntryContentWebView } from "@/src/components/native/webview/EntryContentWebView"
import { PortalHost } from "@/src/components/ui/portal"
import { openLink } from "@/src/lib/native"
import { EntryContentContext } from "@/src/modules/entry-content/ctx"
import { EntryAISummary } from "@/src/modules/entry-content/EntryAISummary"
import { useEntry, usePrefetchEntryContent } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"
import { useAutoMarkAsRead } from "@/src/store/unread/hooks"

import { EntrySocialTitle, EntryTitle } from "../../../../modules/entry-content/EntryTitle"

export default function EntryDetailPage() {
  const { entryId, view } = useLocalSearchParams<{
    entryId: string
    view: string
  }>()

  const viewType = Number.parseInt(view) as FeedViewType
  usePrefetchEntryContent(entryId as string)
  useAutoMarkAsRead(entryId as string)
  const entry = useEntry(entryId as string)

  const insets = useSafeAreaInsets()
  const ctxValue = useMemo(
    () => ({
      showAISummaryAtom: atom(false),
    }),
    [],
  )

  return (
    <EntryContentContext.Provider value={ctxValue}>
      <PortalHost>
        <BottomTabBarHeightContext.Provider value={insets.bottom}>
          <SafeNavigationScrollView
            automaticallyAdjustContentInsets={false}
            className="bg-system-background"
          >
            <Pressable onPress={() => entry?.url && openLink(entry.url)} className="relative py-3">
              {({ pressed }) => (
                <>
                  {pressed && (
                    <Animated.View
                      entering={FadeIn}
                      exiting={FadeOut}
                      className={"bg-system-fill absolute inset-x-1 inset-y-0 rounded-xl"}
                    />
                  )}
                  {viewType === FeedViewType.SocialMedia ? (
                    <EntrySocialTitle entryId={entryId as string} />
                  ) : (
                    <>
                      <EntryTitle title={entry?.title || ""} entryId={entryId as string} />
                      <EntryInfo entryId={entryId as string} />
                    </>
                  )}
                </>
              )}
            </Pressable>
            <EntryAISummary entryId={entryId as string} />
            {entry && (
              <View className="mt-3">
                <EntryContentWebView entry={entry} />
              </View>
            )}
            {viewType === FeedViewType.SocialMedia && (
              <View className="mt-2">
                <EntryInfoSocial entryId={entryId as string} />
              </View>
            )}
          </SafeNavigationScrollView>
        </BottomTabBarHeightContext.Provider>
      </PortalHost>
    </EntryContentContext.Provider>
  )
}

const EntryInfo = ({ entryId }: { entryId: string }) => {
  const entry = useEntry(entryId)

  if (!entry) return null

  const { publishedAt } = entry

  return (
    <View className="mt-3 px-4">
      <FeedInfo feedId={entry.feedId as string} />
      <Text className="text-secondary-label">
        {publishedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
      </Text>
    </View>
  )
}

const EntryInfoSocial = ({ entryId }: { entryId: string }) => {
  const entry = useEntry(entryId)

  if (!entry) return null
  const { publishedAt } = entry
  return (
    <View className="mt-3 px-4">
      <Text className="text-secondary-label">
        {publishedAt.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
      </Text>
    </View>
  )
}

const FeedInfo = ({ feedId }: { feedId: string }) => {
  const feed = useFeed(feedId)
  if (!feed) return null
  return (
    <View className="mb-2">
      <Text className="text-secondary-label">{feed.title?.trim()}</Text>
    </View>
  )
}
