import { FeedViewType } from "@follow/constants"
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
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ImageContextMenu } from "@/src/components/ui/image/ImageContextMenu"
import { PreviewImage } from "@/src/components/ui/image/PreviewImage"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

import { useSelectedView } from "../../screen/atoms"

export type MasonryItem = {
  id: string
} & (
  | {
      type: "image"
      imageUrl: string
      blurhash?: string
      height?: number
      width?: number
    }
  | {
      type: "video"
      videoUrl: string
      videoPreviewImageUrl?: string
    }
)
export function EntryGridItem(props: MasonryItem) {
  const { type, id } = props
  const view = useSelectedView()
  const item = useEntry(id)

  const pictureViewFilterNoImage = useUISettingKey("pictureViewFilterNoImage")

  const Content = useMemo(() => {
    switch (type) {
      case "image": {
        const { imageUrl, blurhash, height, width } = props
        const aspectRatio = height && width ? width / height : 16 / 9

        return imageUrl ? (
          <ImageContextMenu imageUrl={imageUrl}>
            <PreviewImage
              onPreview={() => {
                if (item) {
                  setWebViewEntry(item)
                }
              }}
              imageUrl={imageUrl}
              blurhash={blurhash}
              aspectRatio={aspectRatio}
              Accessory={EntryGridItemAccessory}
              AccessoryProps={{
                id,
              }}
            />
          </ImageContextMenu>
        ) : (
          <View className="aspect-video w-full items-center justify-center">
            <Text className="text-label text-center">No media available</Text>
          </View>
        )
      }
      case "video": {
        const { videoPreviewImageUrl } = props

        return (
          <>
            {videoPreviewImageUrl ? (
              <ImageContextMenu imageUrl={videoPreviewImageUrl}>
                <PreviewImage imageUrl={videoPreviewImageUrl} aspectRatio={16 / 9} />
              </ImageContextMenu>
            ) : (
              <View className="aspect-video w-full items-center justify-center">
                <Text className="text-label text-center">No media available</Text>
              </View>
            )}
            <Text className="text-label p-2 font-medium" numberOfLines={2}>
              {item?.title}
            </Text>
          </>
        )
      }
    }
  }, [type, JSON.stringify(props), item?.title])
  if (!item) {
    return null
  }

  if (
    pictureViewFilterNoImage &&
    type === "image" &&
    !props.imageUrl &&
    view === FeedViewType.Pictures
  ) {
    return null
  }

  return <ItemPressable className="m-1 overflow-hidden rounded-md">{Content}</ItemPressable>
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
