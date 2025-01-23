import { FeedViewType } from "@follow/constants"
import { useTypeScriptHappyCallback } from "@follow/hooks"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useHeaderHeight } from "@react-navigation/elements"
import { useIsFocused } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { Image } from "expo-image"
import { router } from "expo-router"
import { useCallback, useContext, useEffect, useMemo } from "react"
import { StyleSheet, Text, useAnimatedValue, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  NavigationBlurEffectHeader,
  NavigationContext,
} from "@/src/components/common/SafeNavigationScrollView"
import { ItemPressable } from "@/src/components/ui/pressable/item-pressable"
import {
  useSelectedFeed,
  useSetDrawerSwipeDisabled,
  useViewDefinition,
} from "@/src/modules/feed-drawer/atoms"
import {
  useEntry,
  useEntryIdsByCategory,
  useEntryIdsByFeedId,
  useEntryIdsByInboxId,
  useEntryIdsByView,
} from "@/src/store/entry/hooks"
import { FEED_COLLECTION_LIST } from "@/src/store/entry/utils"
import { useFeed } from "@/src/store/feed/hooks"
import { useInbox } from "@/src/store/inbox/hooks"
import { useList } from "@/src/store/list/hooks"

import { LeftAction, RightAction } from "./action"
import { EntryListContentGrid } from "./entry-list-gird"

export function EntryList() {
  const setDrawerSwipeDisabled = useSetDrawerSwipeDisabled()
  const isFocused = useIsFocused()
  useEffect(() => {
    if (isFocused) {
      setDrawerSwipeDisabled(false)
    } else {
      setDrawerSwipeDisabled(true)
    }
  }, [setDrawerSwipeDisabled, isFocused])

  const selectedFeed = useSelectedFeed()

  switch (selectedFeed.type) {
    case "view": {
      return <ViewEntryList viewId={selectedFeed.viewId} />
    }
    case "feed": {
      return <FeedEntryList feedId={selectedFeed.feedId} />
    }
    case "category": {
      return <CategoryEntryList categoryName={selectedFeed.categoryName} />
    }
    case "list": {
      return <ListEntryList listId={selectedFeed.listId} />
    }
    case "inbox": {
      return <InboxEntryList inboxId={selectedFeed.inboxId} />
    }
    // No default
  }
}

function ViewEntryList({ viewId }: { viewId: FeedViewType }) {
  const entryIds = useEntryIdsByView(viewId)
  const viewDef = useViewDefinition(viewId)

  return <EntryListScreen title={viewDef.name} entryIds={entryIds} />
}

function FeedEntryList({ feedId }: { feedId: string }) {
  const feed = useFeed(feedId)
  const entryIds = useEntryIdsByFeedId(feedId)
  const title = feedId === FEED_COLLECTION_LIST ? "Collections" : (feed?.title ?? "")
  return <EntryListScreen title={title} entryIds={entryIds} />
}

function CategoryEntryList({ categoryName }: { categoryName: string }) {
  const entryIds = useEntryIdsByCategory(categoryName)
  return <EntryListScreen title={categoryName} entryIds={entryIds} />
}

function ListEntryList({ listId }: { listId: string }) {
  const list = useList(listId)
  if (!list) return null

  return <EntryListScreen title={list.title} entryIds={list.entryIds ?? []} />
}

function InboxEntryList({ inboxId }: { inboxId: string }) {
  const inbox = useInbox(inboxId)
  const entryIds = useEntryIdsByInboxId(inboxId)
  return <EntryListScreen title={inbox?.title ?? "Inbox"} entryIds={entryIds} />
}

function EntryListScreen({ title, entryIds }: { title: string; entryIds: string[] }) {
  const scrollY = useAnimatedValue(0)
  const selectedFeed = useSelectedFeed()
  const view = selectedFeed.type === "view" ? selectedFeed.viewId : null

  return (
    <NavigationContext.Provider value={useMemo(() => ({ scrollY }), [scrollY])}>
      <NavigationBlurEffectHeader
        headerShown
        title={title}
        headerLeft={useCallback(
          () => (
            <LeftAction />
          ),
          [],
        )}
        headerRight={useCallback(
          () => (
            <RightAction />
          ),
          [],
        )}
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
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  const headerHeight = useHeaderHeight()
  const { scrollY } = useContext(NavigationContext)!
  return (
    <FlashList
      onScroll={useTypeScriptHappyCallback(
        (e) => {
          scrollY.setValue(e.nativeEvent.contentOffset.y)
        },
        [scrollY],
      )}
      data={entryIds}
      renderItem={useTypeScriptHappyCallback(
        ({ item: id }) => (
          <EntryItem key={id} entryId={id} />
        ),
        [],
      )}
      scrollIndicatorInsets={{
        top: headerHeight - insets.top,
        bottom: tabBarHeight - insets.bottom,
      }}
      estimatedItemSize={100}
      contentContainerStyle={{
        paddingTop: headerHeight,
        paddingBottom: tabBarHeight,
      }}
      ItemSeparatorComponent={ItemSeparator}
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
    router.push(`/entries/${entryId}`)
  }, [entryId])

  if (!entry) return <EntryItemSkeleton />
  const { title, description, publishedAt, media } = entry
  const image = media?.[0]?.url
  const blurhash = media?.[0]?.blurhash

  return (
    <ItemPressable className="flex flex-row items-center p-4" onPress={handlePress}>
      <View className="flex-1 space-y-2">
        <Text numberOfLines={2} className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </Text>
        <Text className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{description}</Text>
        <Text className="text-xs text-zinc-500 dark:text-zinc-500">
          {publishedAt.toLocaleString()}
        </Text>
      </View>
      {image && (
        <Image
          source={{ uri: image }}
          placeholder={{ blurhash }}
          className="ml-2 size-20 rounded-md bg-zinc-200 dark:bg-zinc-800"
          contentFit="cover"
        />
      )}
    </ItemPressable>
  )
}

function EntryItemSkeleton() {
  return (
    <View className="bg-secondary-system-grouped-background flex flex-row items-center p-4">
      <View className="flex flex-1 flex-col justify-between">
        {/* Title skeleton */}
        <View className="h-6 w-3/4 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        {/* Description skeleton */}
        <View className="mt-2 w-full flex-1 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </View>

      {/* Image skeleton */}
      <View className="ml-2 size-20 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
    </View>
  )
}
