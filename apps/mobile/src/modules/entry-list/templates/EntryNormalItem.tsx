import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useEffect } from "react"
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"
import ReAnimated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { setWebViewEntry } from "@/src/components/native/webview/EntryContentWebView"
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { gentleSpringPreset } from "@/src/constants/spring"
import { PauseCuteFiIcon } from "@/src/icons/pause_cute_fi"
import { PlayCuteFiIcon } from "@/src/icons/play_cute_fi"
import { getImageHeaders } from "@/src/lib/image"
import { getAttachmentState, player } from "@/src/lib/player"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"

import { EntryItemContextMenu } from "../../context-menu/entry"
import { EntryItemSkeleton } from "../EntryListContentArticle"

export function EntryNormalItem({ entryId, extraData }: { entryId: string; extraData: string }) {
  const entry = useEntry(entryId)
  const feed = useFeed(entry?.feedId as string)

  const handlePress = useCallback(() => {
    if (!entry) return
    setWebViewEntry(entry)
    router.push(`/entries/${entryId}`)
  }, [entryId, entry])

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

  if (!entry) return <EntryItemSkeleton />
  const { title, description, publishedAt, media, attachments } = entry

  const image = media?.[0]?.url
  const blurhash = media?.[0]?.blurhash

  const audio = attachments?.find((attachment) => attachment.mime_type?.startsWith("audio/"))
  const audioState = getAttachmentState(extraData, audio)
  const isPlaying = audioState === "playing"
  const isLoading = audioState === "loading"

  return (
    <EntryItemContextMenu id={entryId}>
      <ItemPressable className="flex flex-row items-center p-4 pl-6" onPress={handlePress}>
        <ReAnimated.View
          className="bg-red absolute left-2 top-[40] size-2 rounded-full"
          style={unreadIndicatorStyle}
        />

        <View className="flex-1 space-y-2">
          <View className="mb-1 flex-1 flex-row gap-2">
            <FeedIcon fallback feed={feed} size={14} />
            <Text className="text-secondary-label text-xs">{feed?.title ?? "Unknown feed"}</Text>
          </View>
          <Text numberOfLines={2} className="text-label text-lg font-semibold leading-tight">
            {title}
          </Text>
          <Text className="text-secondary-label mt-1 line-clamp-2 text-sm">{description}</Text>

          <RelativeDateTime
            date={publishedAt}
            className="text-tertiary-label text-xs"
            postfixText="ago"
          />
        </View>
        <View className="relative">
          {image && (
            <Image
              source={{
                uri: image,
                headers: getImageHeaders(image),
              }}
              placeholder={{ blurhash }}
              className="bg-system-fill ml-2 size-20 rounded-md"
              contentFit="cover"
              recyclingKey={image}
              transition={500}
            />
          )}

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
              <View className="bg-gray-6/50 rounded-full p-2">
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
      </ItemPressable>
    </EntryItemContextMenu>
  )
}
