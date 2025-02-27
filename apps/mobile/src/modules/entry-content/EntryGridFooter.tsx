import { FeedViewType } from "@follow/constants"
import { cn } from "@follow/utils"
import { useEffect } from "react"
import { Text, View } from "react-native"
import ReAnimated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { gentleSpringPreset } from "@/src/constants/spring"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

import { useEntryListContextView } from "../entry-list/EntryListContext"

export const EntryGridFooter = ({
  entryId,
  descriptionClassName,
}: {
  entryId: string
  descriptionClassName?: string
}) => {
  const entry = useEntry(entryId)
  const feed = useFeed(entry?.feedId || "")
  const view = useEntryListContextView()

  const unreadZoomSharedValue = useSharedValue(entry?.read ? 0 : 1)

  useEffect(() => {
    if (!entry) return

    if (entry.read) {
      unreadZoomSharedValue.value = withSpring(0, gentleSpringPreset)
    } else {
      unreadZoomSharedValue.value = withSpring(1, gentleSpringPreset)
    }
  }, [entry, entry?.read, unreadZoomSharedValue])

  const unreadIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: unreadZoomSharedValue.value * 8,
      height: unreadZoomSharedValue.value * 8,
    }
  })

  if (!entry) return null

  return (
    <View className={cn("my-2 px-2", view === FeedViewType.Videos && "h-[64]")}>
      <View className="flex-row gap-2">
        <ReAnimated.View
          className="bg-red mt-2 inline-block rounded-full"
          style={unreadIndicatorStyle}
        />
        {entry.description && (
          <Text
            numberOfLines={2}
            className={cn(
              "text-label shrink text-base font-medium",
              view === FeedViewType.Videos && "min-h-12",
              descriptionClassName,
            )}
          >
            {entry.description}
          </Text>
        )}
      </View>
      <View className="mt-1 flex-row items-center gap-1">
        <FeedIcon fallback feed={feed} size={16} />
        <Text numberOfLines={1} className="text-label shrink text-sm font-medium">
          {feed?.title}
        </Text>
        <RelativeDateTime className="text-secondary-label" date={entry.publishedAt} />
      </View>
    </View>
  )
}
