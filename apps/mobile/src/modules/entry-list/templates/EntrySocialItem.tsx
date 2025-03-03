import { FeedViewType } from "@follow/constants"
import { router } from "expo-router"
import { useCallback, useEffect } from "react"
import { Pressable, Text, View } from "react-native"
import ReAnimated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { RelativeDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ProxiedImage } from "@/src/components/ui/image/ProxiedImage"
import { ItemPressableStyle } from "@/src/components/ui/pressable/enum"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { gentleSpringPreset } from "@/src/constants/spring"
import { quickLookImage } from "@/src/lib/native"
import { useEntry } from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"
import { unreadSyncService } from "@/src/store/unread/store"

import { EntryItemContextMenu } from "../../context-menu/entry"
import { EntryItemSkeleton } from "../EntryListContentSocial"

export function EntrySocialItem({ entryId }: { entryId: string }) {
  const entry = useEntry(entryId)

  const feed = useFeed(entry?.feedId || "")

  const handlePress = useCallback(() => {
    unreadSyncService.markEntryAsRead(entryId)
    router.push(`/entries/${entryId}?view=${FeedViewType.SocialMedia}`)
  }, [entryId])

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

  const autoExpandLongSocialMedia = useGeneralSettingKey("autoExpandLongSocialMedia")
  if (!entry) return <EntryItemSkeleton />

  const { description, publishedAt, media } = entry

  return (
    <EntryItemContextMenu id={entryId}>
      <ItemPressable
        itemStyle={ItemPressableStyle.Plain}
        className="flex flex-col gap-2 p-4 pl-6"
        onPress={handlePress}
      >
        <ReAnimated.View
          className="bg-red absolute left-1.5 top-[25] size-2 rounded-full"
          style={unreadIndicatorStyle}
        />

        <View className="flex flex-1 flex-row items-start gap-4">
          <Pressable
            hitSlop={10}
            onPress={() => {
              router.push(`/feeds/${entry.feedId}`)
            }}
          >
            {entry.authorAvatar ? (
              <UserAvatar size={28} name={entry.author ?? ""} image={entry.authorAvatar} />
            ) : (
              feed && <FeedIcon feed={feed} size={28} />
            )}
          </Pressable>

          <View className="flex-1 flex-row items-center gap-1.5">
            <Text numberOfLines={1} className="text-label shrink text-base font-semibold">
              {entry.author || feed?.title}
            </Text>
            <Text className="text-secondary-label">·</Text>
            <RelativeDateTime date={publishedAt} className="text-secondary-label text-[14px]" />
          </View>
        </View>

        <View className="relative -mt-4">
          <Text
            numberOfLines={autoExpandLongSocialMedia ? undefined : 7}
            className="text-label ml-12 text-base"
          >
            {description}
          </Text>
        </View>

        {media && media.length > 0 && (
          <View className="ml-10 flex flex-row flex-wrap gap-2">
            {media.map((image, idx) => {
              return (
                <Pressable
                  key={image.url}
                  onPress={() => {
                    const previewImages = media.map((i) => i.url)
                    quickLookImage([...previewImages.slice(idx), ...previewImages.slice(0, idx)])
                  }}
                >
                  <ProxiedImage
                    proxy={{
                      width: 80,
                      height: 80,
                    }}
                    source={{ uri: image.url }}
                    transition={500}
                    placeholder={{ blurhash: image.blurhash }}
                    className="bg-system-fill ml-2 size-20 rounded-md"
                    contentFit="cover"
                    recyclingKey={image.url}
                  />
                </Pressable>
              )
            })}
          </View>
        )}
      </ItemPressable>
    </EntryItemContextMenu>
  )
}
