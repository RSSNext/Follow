import { FeedViewType } from "@follow/constants"
import { cn, formatEstimatedMins } from "@follow/utils"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ReAnimated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { useUISettingKey } from "@/src/atoms/settings/ui"
import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { preloadWebViewEntry } from "@/src/components/native/webview/EntryContentWebView"
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { Image } from "@/src/components/ui/image/Image"
import { ItemPressableStyle } from "@/src/components/ui/pressable/enum"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { gentleSpringPreset } from "@/src/constants/spring"
import { PauseCuteFiIcon } from "@/src/icons/pause_cute_fi"
import { PlayCuteFiIcon } from "@/src/icons/play_cute_fi"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { getAttachmentState, player } from "@/src/lib/player"
import { getHorizontalScrolling } from "@/src/modules/screen/atoms"
import { EntryDetailScreen } from "@/src/screens/(stack)/entries/[entryId]"
import { useEntry } from "@/src/store/entry/hooks"
import { getInboxFrom } from "@/src/store/entry/utils"
import { useFeed } from "@/src/store/feed/hooks"

import { EntryItemContextMenu } from "../../context-menu/entry"
import { EntryItemSkeleton } from "../EntryListContentArticle"
import { useEntryListContextView } from "../EntryListContext"

export function EntryNormalItem({ entryId, extraData }: { entryId: string; extraData: string }) {
  const entry = useEntry(entryId)
  const from = getInboxFrom(entry)
  const feed = useFeed(entry?.feedId as string)
  const view = useEntryListContextView()
  const navigation = useNavigation()
  const handlePress = useCallback(() => {
    const isHorizontalScrolling = getHorizontalScrolling()
    if (entry && !isHorizontalScrolling) {
      preloadWebViewEntry(entry)
      navigation.pushControllerView(EntryDetailScreen, {
        entryId,
        view,
      })
    }
  }, [entryId, entry, navigation, view])

  const unreadZoomSharedValue = useSharedValue(entry?.read ? 0 : 1)

  const unreadIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: unreadZoomSharedValue.value,
        },
      ],
    }
  })

  useEffect(() => {
    if (!entry) return

    if (entry.read) {
      unreadZoomSharedValue.value = withSpring(0, gentleSpringPreset)
    } else {
      unreadZoomSharedValue.value = withSpring(1, gentleSpringPreset)
    }
  }, [entry, entry?.read, unreadZoomSharedValue])

  const thumbnailRatio = useUISettingKey("thumbnailRatio")
  if (!entry) return <EntryItemSkeleton />
  const { title, description, publishedAt, media, attachments } = entry

  const coverImage = media?.[0]

  const image = coverImage?.url
  const blurhash = coverImage?.blurhash

  const audio = attachments?.find((attachment) => attachment.mime_type?.startsWith("audio/"))
  const audioState = getAttachmentState(extraData, audio)
  const isPlaying = audioState === "playing"
  const isLoading = audioState === "loading"

  const durationInSeconds = attachments ? attachments[0]?.duration_in_seconds : 0
  const estimatedMins = durationInSeconds ? Math.floor(durationInSeconds / 60) : undefined

  return (
    <EntryItemContextMenu id={entryId}>
      <ItemPressable
        touchHighlight={false}
        itemStyle={ItemPressableStyle.Plain}
        className="flex flex-row items-center p-4 pl-6"
        onPress={handlePress}
      >
        <ReAnimated.View
          className="bg-red absolute left-2 top-[43] size-2 rounded-full"
          style={unreadIndicatorStyle}
        />

        <View className="flex-1 space-y-2">
          <View className="mb-1 flex-1 flex-row items-center gap-1.5 pr-2">
            <FeedIcon fallback feed={feed} size={16} />
            <Text numberOfLines={1} className="text-secondary-label shrink text-sm font-medium">
              {feed?.title || from || "Unknown feed"}
            </Text>
            <Text className="text-secondary-label text-xs font-medium">·</Text>
            {estimatedMins ? (
              <>
                <Text className="text-secondary-label text-xs font-medium">
                  {formatEstimatedMins(estimatedMins)}
                </Text>
                <Text className="text-secondary-label text-xs font-medium">·</Text>
              </>
            ) : null}
            <RelativeDateTime
              date={publishedAt}
              className="text-secondary-label text-xs font-medium"
              postfixText="ago"
            />
          </View>
          {!!title && (
            <Text numberOfLines={2} className="text-label text-lg font-semibold">
              {title.trim()}
            </Text>
          )}
          {view !== FeedViewType.Notifications && !!description && (
            <Text numberOfLines={2} className="text-secondary-label text-sm">
              {description}
            </Text>
          )}
        </View>
        {view !== FeedViewType.Notifications && (
          <View className="relative ml-2">
            {image &&
              (thumbnailRatio === "square" ? (
                <SquareImage image={image} blurhash={blurhash} />
              ) : (
                <AspectRatioImage
                  blurhash={blurhash}
                  image={image}
                  height={coverImage?.height}
                  width={coverImage?.width}
                />
              ))}

            {audio && (
              <TouchableOpacity
                className="absolute inset-0 flex items-center justify-center"
                onPress={() => {
                  if (isLoading) return
                  if (isPlaying) {
                    player.pause()
                    return
                  }
                  player.play({
                    url: audio.url,
                    title: entry?.title,
                    artist: feed?.title,
                    artwork: image,
                  })
                }}
              >
                <View className="overflow-hidden rounded-full p-2">
                  <ThemedBlurView style={StyleSheet.absoluteFillObject} intensity={30} />
                  {isPlaying ? (
                    <PauseCuteFiIcon color="white" width={24} height={24} />
                  ) : isLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <PlayCuteFiIcon color="white" width={24} height={24} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ItemPressable>
    </EntryItemContextMenu>
  )
}

const AspectRatioImage = ({
  image,
  blurhash,
  height = 96,
  width = 96,
}: {
  image: string
  blurhash?: string
  height?: number
  width?: number
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  if (height === width || !height || !width) {
    return <SquareImage image={image} blurhash={blurhash} />
  }
  // Calculate aspect ratio and determine dimensions
  // Ensure the larger dimension is capped at 96px while maintaining aspect ratio

  const aspect = height / width
  let scaledWidth, scaledHeight

  if (aspect > 1) {
    // Image is taller than wide
    scaledHeight = 96
    scaledWidth = scaledHeight / aspect
  } else {
    // Image is wider than tall or square
    scaledWidth = 96
    scaledHeight = scaledWidth * aspect
  }

  return (
    <View className="size-24 items-center justify-center">
      <View
        style={{
          width: scaledWidth,
          height: scaledHeight,
        }}
        className="overflow-hidden rounded-md"
      >
        <Image
          onLoad={() => {
            setIsLoaded(true)
          }}
          proxy={{
            width: 96,
          }}
          source={{
            uri: image,
          }}
          style={{
            width: scaledWidth,
            height: scaledHeight,
          }}
          transition={100}
          blurhash={blurhash}
          className={cn(
            "rounded-md",
            isLoaded ? "bg-transparent" : "bg-secondary-system-background",
          )}
          contentFit="cover"
        />
      </View>
    </View>
  )
}

const SquareImage = ({ image, blurhash }: { image: string; blurhash?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <Image
      proxy={{
        width: 96,
        height: 96,
      }}
      transition={100}
      source={{
        uri: image,
      }}
      onLoad={() => {
        setIsLoaded(true)
      }}
      blurhash={blurhash}
      className={cn(
        "size-24 overflow-hidden rounded-lg",
        isLoaded ? "bg-transparent" : "bg-secondary-system-background",
      )}
      contentFit="cover"
    />
  )
}
