import { FeedViewType } from "@follow/constants"
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs"
import type { ListRenderItemInfo } from "@shopify/flash-list"
import { FlashList } from "@shopify/flash-list"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useContext, useMemo } from "react"
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native"
import { StyleSheet, Text, useAnimatedValue, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

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
import { LeftAction, RightAction } from "./action"
import { EntryListContentGrid } from "./entry-list-gird"

const headerHideableBottomHeight = 58

export function EntryListScreen({ entryIds }: { entryIds: string[] }) {
  const scrollY = useAnimatedValue(0)
  const view = useSelectedView()
  const viewTitle = useSelectedFeedTitle()
  const screenType = useEntryListContext().type

  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <NavigationBlurEffectHeader
        headerShown
        headerTitle={viewTitle}
        headerLeft={useCallback(
          () => (screenType === "timeline" ? <LeftAction /> : null),
          [screenType],
        )}
        headerRight={useCallback(
          () => (screenType === "timeline" ? <RightAction /> : null),
          [screenType],
        )}
        headerHideableBottomHeight={
          screenType === "timeline" ? headerHideableBottomHeight : undefined
        }
        headerHideableBottom={screenType === "timeline" ? ViewSelector : undefined}
      />
      {view === FeedViewType.Pictures || view === FeedViewType.Videos ? (
        <EntryListContentGrid entryIds={entryIds} />
      ) : (
        <EntryListContent entryIds={entryIds} />
      )}
    </NavigationContext.Provider>
  )
}

export function EntryListContent({ entryIds }: { entryIds: string[] }) {
  const screenType = useEntryListContext().type

  const insets = useSafeAreaInsets()

  const originalDefaultHeaderHeight = useDefaultHeaderHeight()
  const headerHeight =
    screenType === "timeline"
      ? originalDefaultHeaderHeight + headerHideableBottomHeight
      : originalDefaultHeaderHeight
  const scrollY = useContext(NavigationContext)?.scrollY

  const { fetchNextPage, isFetchingNextPage } = useFetchEntriesControls()

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

  return (
    <BottomTabBarHeightContext.Consumer>
      {(tabBarHeight) => (
        <FlashList
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
          ListFooterComponent={isFetchingNextPage ? <EntryItemSkeleton /> : null}
        />
      )}
    </BottomTabBarHeightContext.Consumer>
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
