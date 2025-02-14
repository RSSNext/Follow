import type { ListRenderItemInfo } from "@shopify/flash-list"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useEffect, useMemo } from "react"
import { Animated, Pressable, Text, View } from "react-native"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { ReleatDateTime } from "@/src/components/ui/datetime/RelativeDateTime"
import { ItemPressableStyle } from "@/src/components/ui/pressable/enum"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { gentleSpringPreset } from "@/src/constants/spring"
import { quickLookImage } from "@/src/lib/native"
import { useEntryListContext, useFetchEntriesControls } from "@/src/modules/feed-drawer/atoms"
import { useEntry } from "@/src/store/entry/hooks"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"

import { EntryItemContextMenu } from "../context-menu/entry"
import { TimelineSelectorList } from "../screen/TimelineSelectorList"
import { LoadArchiveButton } from "./action"
import { ItemSeparatorFullWidth } from "./ItemSeparator"

export function EntryListContentSocial({ entryIds }: { entryIds: string[] }) {
  const screenType = useEntryListContext().type

  const { fetchNextPage, isFetching, refetch, isRefetching } = useFetchEntriesControls()

  const renderItem = useCallback(
    ({ item: id }: ListRenderItemInfo<string>) => <EntryItem key={id} entryId={id} />,
    [],
  )

  const ListFooterComponent = useMemo(
    () =>
      isFetching ? <EntryItemSkeleton /> : screenType === "feed" ? <LoadArchiveButton /> : null,
    [isFetching, screenType],
  )

  return (
    <TimelineSelectorList
      onRefresh={() => {
        refetch()
      }}
      isRefetching={isRefetching}
      data={entryIds}
      renderItem={renderItem}
      onEndReached={() => {
        fetchNextPage()
      }}
      onViewableItemsChanged={({ viewableItems }) => {
        debouncedFetchEntryContentByStream(viewableItems.map((item) => item.key))
      }}
      estimatedItemSize={100}
      ItemSeparatorComponent={ItemSeparatorFullWidth}
      ListFooterComponent={ListFooterComponent}
    />
  )
}

function EntryItem({ entryId }: { entryId: string }) {
  const entry = useEntry(entryId)

  // const handlePress = useCallback(() => {
  //   if (!entry) return
  //   setWebViewEntry(entry)
  //   router.push(`/entries/${entryId}`)
  // }, [entryId, entry])

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
  const { description, publishedAt, media } = entry

  return (
    <EntryItemContextMenu id={entryId}>
      <ItemPressable itemStyle={ItemPressableStyle.Plain} className="flex flex-col gap-2 p-4 pl-6">
        <Animated.View
          className="bg-red absolute left-1.5 top-[25] size-2 rounded-full"
          style={unreadIndicatorStyle}
        />

        <View className="flex flex-1 flex-row items-center gap-4">
          <Pressable
            hitSlop={10}
            onPress={() => {
              router.push(`/feeds/${entry.feedId}`)
            }}
          >
            <UserAvatar size={28} name={entry.author ?? ""} image={entry.authorAvatar} />
          </Pressable>

          <View className="flex flex-row items-end gap-1">
            <Text className="text-label text-[16px] font-semibold">{entry.author}</Text>

            <ReleatDateTime
              date={publishedAt}
              className="text-secondary-label -mb-0.5 text-[14px] leading-none"
            />
          </View>
        </View>

        <Text numberOfLines={4} className="text-label ml-12 text-[16px] leading-relaxed">
          {description}
        </Text>

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
                  <Image
                    source={{ uri: image.url }}
                    placeholder={{ blurhash: image.blurhash }}
                    className="bg-system-fill ml-2 size-20 rounded-md"
                    contentFit="cover"
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

function EntryItemSkeleton() {
  return (
    <View className="flex flex-col gap-2 p-4">
      {/* Header row with avatar, author, and date */}
      <View className="flex flex-1 flex-row items-center gap-2">
        <View className="bg-system-fill size-8 animate-pulse rounded-full" />
        <View className="bg-system-fill h-4 w-24 animate-pulse rounded-md" />
        <View className="bg-system-fill h-3 w-20 animate-pulse rounded-md" />
      </View>

      {/* Description area */}
      <View className="ml-10 space-y-2">
        <View className="bg-system-fill h-4 w-full animate-pulse rounded-md rounded-bl-none" />
        <View className="bg-system-fill h-4 w-3/4 animate-pulse rounded-md rounded-tl-none" />
      </View>

      {/* Media preview area */}
      <View className="ml-10 flex flex-row gap-2">
        <View className="bg-system-fill size-20 animate-pulse rounded-md" />
        <View className="bg-system-fill size-20 animate-pulse rounded-md" />
      </View>
    </View>
  )
}
