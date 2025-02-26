import { cn } from "@follow/utils"
import { Text, View } from "react-native"
import ReAnimated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated"

import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

export const EntryGridFooter = ({
  entryId,
  descriptionClassName,
}: {
  entryId: string
  descriptionClassName?: string
}) => {
  const entry = useEntry(entryId)
  const feed = useFeed(entry?.feedId || "")

  const unreadZoomSharedValue = useSharedValue(entry?.read ? 0 : 1)

  const unreadIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: unreadZoomSharedValue.value * 8,
      height: unreadZoomSharedValue.value * 8,
    }
  })

  if (!entry) return null

  return (
    <View className="my-2 px-2">
      <View className="flex-row gap-2">
        <ReAnimated.View
          className="bg-red mt-2 inline-block rounded-full"
          style={unreadIndicatorStyle}
        />
        {entry.description && (
          <Text
            numberOfLines={2}
            className={cn("text-label text-base font-medium", descriptionClassName)}
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
