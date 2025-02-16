import type { ListRenderItemInfo } from "@shopify/flash-list"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useEffect, useMemo } from "react"
import { Text, View } from "react-native"
import ReAnimated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

import { setWebViewEntry } from "@/src/components/native/webview/EntryContentWebView"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { gentleSpringPreset } from "@/src/constants/spring"
import { useEntryListContext, useFetchEntriesControls } from "@/src/modules/feed-drawer/atoms"
import { useEntry } from "@/src/store/entry/hooks"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"
import { useFeed } from "@/src/store/feed/hooks"

import { EntryItemContextMenu } from "../context-menu/entry"
import { TimelineSelectorList } from "../screen/TimelineSelectorList"
import { LoadArchiveButton } from "./action"
import { ItemSeparator } from "./ItemSeparator"

export function EntryListContentArticle({ entryIds }: { entryIds: string[] }) {
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
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooterComponent}
    />
  )
}

function EntryItem({ entryId }: { entryId: string }) {
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
  const { title, description, publishedAt, media } = entry
  const image = media?.[0]?.url
  const blurhash = media?.[0]?.blurhash

  return (
    <EntryItemContextMenu id={entryId}>
      <ItemPressable className="flex flex-row items-center p-4 pl-6" onPress={handlePress}>
        <ReAnimated.View
          className="bg-red absolute left-2 top-[18] size-2 rounded-full"
          style={unreadIndicatorStyle}
        />

        <View className="flex-1 space-y-2">
          <View className="flex-1 flex-row gap-2">
            <FeedIcon fallback feed={feed} size={14} />
            <Text className="text-secondary-label text-xs">{feed?.title ?? "Unknown feed"}</Text>
          </View>

          <Text numberOfLines={2} className="text-label text-lg font-semibold">
            {title}
          </Text>
          <Text className="text-secondary-label line-clamp-2 text-sm">{description}</Text>
          <Text className="text-tertiary-label text-xs">{publishedAt.toLocaleString()}</Text>
        </View>
        {image && (
          <Image
            source={{ uri: image }}
            placeholder={{ blurhash }}
            className="bg-system-fill ml-2 size-20 rounded-md"
            contentFit="cover"
          />
        )}
      </ItemPressable>
    </EntryItemContextMenu>
  )
}

function EntryItemSkeleton() {
  return (
    <View className="bg-secondary-system-grouped-background flex flex-row items-center p-4">
      <View className="flex flex-1 flex-col justify-between">
        {/* Title skeleton */}
        <View className="bg-system-fill h-6 w-3/4 animate-pulse rounded-md" />
        {/* Description skeleton */}
        <View className="bg-system-fill mt-2 w-full flex-1 animate-pulse rounded-md" />
      </View>

      {/* Image skeleton */}
      <View className="bg-system-fill ml-2 size-20 animate-pulse rounded-md" />
    </View>
  )
}
