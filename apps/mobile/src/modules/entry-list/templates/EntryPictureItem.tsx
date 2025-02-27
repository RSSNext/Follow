import { uniqBy } from "es-toolkit/compat"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useMemo } from "react"
import { ScrollView, Text, View } from "react-native"
import Animated, { useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { EntryContentWebView } from "@/src/components/native/webview/EntryContentWebView"
import { MediaCarousel } from "@/src/components/ui/carousel/MediaCarousel"
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import type { MediaModel } from "@/src/database/schemas/types"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

export function EntryPictureItem({ id }: { id: string }) {
  const item = useEntry(id)

  if (!item || !item.media) {
    return null
  }

  const hasMedia = item.media.length > 0

  if (!hasMedia) {
    return (
      <View className="aspect-video w-full items-center justify-center">
        <Text className="text-label text-center">No media available</Text>
      </View>
    )
  }

  return (
    <View className="m-1">
      <MediaItems
        media={item.media}
        entryId={id}
        onPreview={() => unreadSyncService.markEntryAsRead(id)}
      />
    </View>
  )
}

const MediaItems = ({
  media,
  entryId,
  onPreview,
  noPreview,
  aspectRatio,
}: {
  media: MediaModel[]
  entryId: string
  onPreview?: () => void
  noPreview?: boolean
  aspectRatio?: number
}) => {
  const firstMedia = media[0]

  const uniqMedia = useMemo(() => {
    return uniqBy(media, "url")
  }, [media])

  if (!firstMedia) {
    return null
  }

  const { height } = firstMedia
  const { width } = firstMedia
  const realAspectRatio = aspectRatio || (width && height ? width / height : 1)

  return (
    <MediaCarousel
      entryId={entryId}
      media={uniqMedia}
      onPreview={onPreview}
      aspectRatio={realAspectRatio}
      Accessory={EntryGridItemAccessory}
      AccessoryProps={{ id: entryId }}
      noPreview={noPreview}
    />
  )
}

const EntryGridItemAccessory = ({ id }: { id: string }) => {
  const entry = useEntry(id)
  const feed = useFeed(entry?.feedId || "")
  const insets = useSafeAreaInsets()

  const opacityValue = useSharedValue(0)
  useEffect(() => {
    opacityValue.value = withTiming(1, { duration: 1000 })
  }, [opacityValue])
  if (!entry) {
    return null
  }

  return (
    <Animated.View style={{ opacity: opacityValue }} className="absolute inset-x-0 bottom-0">
      <LinearGradient colors={["transparent", "#000"]} locations={[0.1, 1]} className="flex-1">
        <View className="flex-row items-center gap-2">
          <View className="border-non-opaque-separator overflow-hidden rounded-full border">
            <FeedIcon fallback feed={feed} size={40} />
          </View>
          <View>
            <Text className="text-label text-lg font-medium">{entry.author}</Text>
            <RelativeDateTime className="text-secondary-label" date={entry.publishedAt} />
          </View>
        </View>

        <ScrollView
          className="mt-2 max-h-48"
          contentContainerStyle={{ paddingBottom: insets.bottom }}
        >
          <EntryContentWebView entry={entry} noMedia />
        </ScrollView>
      </LinearGradient>
    </Animated.View>
  )
}
