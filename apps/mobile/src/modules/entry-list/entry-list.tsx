import { FeedViewType } from "@follow/constants"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import type { ListRenderItemInfo } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useContext, useMemo } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { RefreshControl, StyleSheet, Text, useAnimatedValue, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useColor } from "react-native-uikit-colors"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
} from "@/src/components/common/SafeNavigationScrollView"
import { setWebViewEntry } from "@/src/components/native/webview/EntryContentWebView"
import { ItemPressable } from "@/src/components/ui/pressable/item-pressable"
import { useDefaultHeaderHeight } from "@/src/hooks/useDefaultHeaderHeight"
import {
  useEntryListContext,
  useFetchEntriesControls,
  useSelectedFeedTitle,
  useSelectedView,
} from "@/src/modules/feed-drawer/atoms"
import { useEntry } from "@/src/store/entry/hooks"
import { debouncedFetchEntryContentByStream } from "@/src/store/entry/store"

import { EntryItemContextMenu } from "../context-menu/entry"
import { ViewSelector } from "../feed-drawer/view-selector"
import { HomeLeftAction, HomeRightAction, LoadArchiveButton } from "./action"
import { EntryListContentGrid } from "./entry-list-gird"

const headerHideableBottomHeight = 58

export function EntryListScreen({ entryIds }: { entryIds: string[] }) {
  const scrollY = useAnimatedValue(0)
  const view = useSelectedView()
  const viewTitle = useSelectedFeedTitle()
  const screenType = useEntryListContext().type

  const isFeed = screenType === "feed"
  const isTimeline = screenType === "timeline"
  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <NavigationBlurEffectHeader
        headerBackTitle={isFeed ? "Subscriptions" : undefined}
        headerShown
        title={viewTitle}
        headerLeft={useMemo(
          () => (isTimeline ? () => <HomeLeftAction /> : undefined),
          [isTimeline],
        )}
        headerRight={useMemo(
          () => (isTimeline ? () => <HomeRightAction /> : undefined),
          [isTimeline],
        )}
        headerHideableBottomHeight={isTimeline ? headerHideableBottomHeight : undefined}
        headerHideableBottom={isTimeline ? ViewSelector : undefined}
      />
      {view === FeedViewType.Pictures || view === FeedViewType.Videos ? (
        <EntryListContentGrid entryIds={entryIds} />
      ) : (
        <EntryListContent entryIds={entryIds} />
      )}
    </NavigationContext.Provider>
  )
}

function EntryListContent({ entryIds }: { entryIds: string[] }) {
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
  const { title, description, publishedAt, media } = entry
  const image = media?.[0]?.url
  const blurhash = media?.[0]?.blurhash

  return (
    <EntryItemContextMenu id={entryId}>
      <ItemPressable className="flex flex-row items-center p-4" onPress={handlePress}>
        {!entry.read && <View className="bg-red absolute left-1 top-6 size-2 rounded-full" />}
        <View className="flex-1 space-y-2">
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
