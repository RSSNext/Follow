import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import type { ListRenderItemInfo } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useContext, useMemo } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { RefreshControl, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import { NavigationContext } from "@/src/components/common/SafeNavigationScrollView"
import { setWebViewEntry } from "@/src/components/native/webview/EntryContentWebView"
import { ItemPressable } from "@/src/components/ui/pressable/item-pressable"
import { useDefaultHeaderHeight } from "@/src/hooks/useDefaultHeaderHeight"
import { useEntryListContext, useFetchEntriesControls } from "@/src/modules/feed-drawer/atoms"
import { useEntry } from "@/src/store/entry/hooks"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"

import { EntryItemContextMenu } from "../context-menu/entry"
import { LoadArchiveButton } from "./action"

const headerHideableBottomHeight = 58

export function EntryListContentSocial({ entryIds }: { entryIds: string[] }) {
  const screenType = useEntryListContext().type
  const insets = useSafeAreaInsets()

  const originalDefaultHeaderHeight = useDefaultHeaderHeight()
  const headerHeight =
    screenType === "timeline"
      ? originalDefaultHeaderHeight + headerHideableBottomHeight
      : originalDefaultHeaderHeight
  const scrollY = useContext(NavigationContext)?.scrollY

  const { fetchNextPage, isFetching, refetch, isRefetching } = useFetchEntriesControls()

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY?.setValue(e.nativeEvent.contentOffset.y)
    },
    [scrollY],
  )

  const renderItem = useCallback(
    ({ item: id }: ListRenderItemInfo<string>) => <EntryItem key={id} entryId={id} />,
    [],
  )

  const tabBarHeight = useBottomTabBarHeight()

  const ListFooterComponent = useMemo(
    () =>
      isFetching ? <EntryItemSkeleton /> : screenType === "feed" ? <LoadArchiveButton /> : null,
    [isFetching, screenType],
  )

  const systemFill = useColor("secondaryLabel")

  return (
    <FlashList
      refreshControl={
        <RefreshControl
          progressViewOffset={headerHeight}
          // // FIXME: not sure why we need set tintColor manually here, otherwise we can not see the refresh indicator
          tintColor={systemFill}
          onRefresh={() => {
            refetch()
          }}
          refreshing={isRefetching}
        />
      }
      onScroll={onScroll}
      data={entryIds}
      renderItem={renderItem}
      keyExtractor={(id) => id}
      onEndReached={() => {
        fetchNextPage()
      }}
      onViewableItemsChanged={({ viewableItems }) => {
        debouncedFetchEntryContentByStream(viewableItems.map((item) => item.key))
      }}
      scrollIndicatorInsets={{
        top: headerHeight - insets.top,
        bottom: tabBarHeight ? tabBarHeight - insets.bottom : undefined,
      }}
      estimatedItemSize={100}
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: tabBarHeight,
      }}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooterComponent}
    />
  )
}

const ItemSeparator = () => {
  return (
    <View
      className="bg-opaque-separator mx-4"
      style={{
        height: StyleSheet.hairlineWidth,
      }}
    />
  )
}

function EntryItem({ entryId }: { entryId: string }) {
  const entry = useEntry(entryId)

  const handlePress = useCallback(() => {
    if (!entry) return
    setWebViewEntry(entry)
    router.push(`/entries/${entryId}`)
  }, [entryId, entry])

  if (!entry) return <EntryItemSkeleton />
  const { description, publishedAt, media } = entry

  return (
    <EntryItemContextMenu id={entryId}>
      <ItemPressable className="flex flex-col gap-2 p-4" onPress={handlePress}>
        <View className="flex flex-1 flex-row items-center gap-2">
          <Image
            source={{ uri: entry.authorAvatar }}
            className="bg-system-fill size-8 rounded-full"
            contentFit="cover"
          />
          <Text className="text-label">{entry.author}</Text>
          {/* TODO relative time */}
          <Text className="text-tertiary-label text-xs">{publishedAt.toLocaleString()}</Text>
        </View>

        <Text numberOfLines={4} className="text-label ml-10 text-sm">
          {description}
        </Text>

        {media?.length && (
          <View className="ml-10 flex flex-row flex-wrap gap-2">
            {media.map((image) => {
              return (
                <Image
                  key={image.url}
                  source={{ uri: image.url }}
                  placeholder={{ blurhash: image.blurhash }}
                  className="bg-system-fill ml-2 size-20 rounded-md"
                  contentFit="cover"
                />
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
