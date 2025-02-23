import { FeedViewType } from "@follow/constants"
import { uniqBy } from "es-toolkit/compat"
import { LinearGradient } from "expo-linear-gradient"
import { useEffect, useMemo } from "react"
import { ScrollView, Text, View } from "react-native"
import Animated, { useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import {
  EntryContentWebView,
  setWebViewEntry,
} from "@/src/components/native/webview/EntryContentWebView"
import { MediaCarousel } from "@/src/components/ui/carousel/MediaCarousel"
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { PreviewImage } from "@/src/components/ui/image/PreviewImage"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import type { MediaModel } from "@/src/database/schemas/types"
import { openLink } from "@/src/lib/native"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

import { useEntryListContextView } from "../EntryListContext"

export function EntryGridItem({ id }: { id: string }) {
  const item = useEntry(id)
  const view = useEntryListContextView()

  const pictureViewFilterNoImage = useUISettingKey("pictureViewFilterNoImage")
  if (!item || !item.media) {
    return null
  }

  const hasMedia = item.media.length > 0

  if (pictureViewFilterNoImage && !hasMedia && view === FeedViewType.Pictures) {
    return null
  }
  if (!hasMedia) {
    return (
      <View className="aspect-video w-full items-center justify-center">
        <Text className="text-label text-center">No media available</Text>
      </View>
    )
  }

  const WrapperComponent = view === FeedViewType.Videos ? ItemPressable : View

  return (
    <WrapperComponent
      className="m-1 overflow-hidden rounded-md"
      onPress={() => {
        if (!item.url) {
          return
        }
        if (view === FeedViewType.Videos) {
          openLink(item.url)
        }
      }}
    >
      <MediaItems
        media={item.media}
        title={item.title || ""}
        view={view!}
        entryId={id}
        onPreview={() => {
          if (item) {
            setWebViewEntry(item)
          }
        }}
      />
    </WrapperComponent>
  )
}

const MediaItems = ({
  media,
  view,
  entryId,
  onPreview,
  title,
}: {
  media: MediaModel[]
  view: FeedViewType
  entryId: string
  onPreview: () => void
  title: string
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
  const aspectRatio = width && height ? width / height : 1

  if (view === FeedViewType.Videos) {
    const mediaUrl = firstMedia.preview_image_url || firstMedia.url
    const aspectRatio = 16 / 9
    return (
      <View>
        <View className="flex-1" style={{ aspectRatio }}>
          {mediaUrl && (
            <PreviewImage imageUrl={mediaUrl} aspectRatio={aspectRatio} onPreview={onPreview} />
          )}
        </View>
        <Text className="text-label p-2 font-medium" numberOfLines={2}>
          {title}
        </Text>
      </View>
    )
  }

  return (
    <MediaCarousel
      media={uniqMedia}
      onPreview={onPreview}
      aspectRatio={aspectRatio}
      Accessory={EntryGridItemAccessory}
      AccessoryProps={{ id: entryId }}
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
