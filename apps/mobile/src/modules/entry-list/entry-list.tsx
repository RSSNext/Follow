import type { FeedViewType } from "@follow/constants"
import { useIsFocused } from "@react-navigation/native"
import { router, Stack } from "expo-router"
import { useCallback, useEffect } from "react"
import { Image, Text, View } from "react-native"

import { BlurEffect } from "@/src/components/common/BlurEffect"
import { SafeNavigationScrollView } from "@/src/components/common/SafeNavigationScrollView"
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
  useEntryIdsByView,
} from "@/src/store/entry/hooks"
import { useFeed } from "@/src/store/feed/hooks"
import { useList } from "@/src/store/list/hooks"

import { LeftAction, RightAction } from "./action"

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
    // case "inbox": {
    //   return <InboxEntryList inboxId={selectedFeed.inboxId} />
    // }
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
  return <EntryListScreen title={feed?.title ?? ""} entryIds={entryIds} />
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

function EntryListScreen({ title, entryIds }: { title: string; entryIds: string[] }) {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: title,
          headerLeft: LeftAction,
          headerRight: RightAction,
          headerTransparent: true,
          headerBackground: BlurEffect,
        }}
      />

      <SafeNavigationScrollView contentInsetAdjustmentBehavior="automatic" withTopInset>
        <View className="flex">
          {entryIds.map((id) => (
            <EntryItem key={id} entryId={id} />
          ))}
        </View>
      </SafeNavigationScrollView>
    </>
  )
}

function EntryItem({ entryId }: { entryId: string }) {
  const entry = useEntry(entryId)

  const handlePress = useCallback(() => {
    router.push({
      pathname: `/feeds/[feedId]`,
      params: {
        feedId: entryId,
      },
    })
  }, [entryId])

  if (!entry) return <EntryItemSkeleton />
  const { title, description, publishedAt, media } = entry
  const image = media?.[0]?.url

  return (
    <ItemPressable
      className="bg-system-background flex flex-row items-center p-4"
      onPress={handlePress}
    >
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
          className="ml-2 size-20 rounded-md bg-zinc-200 dark:bg-zinc-800"
          resizeMode="cover"
        />
      )}
    </ItemPressable>
  )
}

function EntryItemSkeleton() {
  return (
    <View className="bg-system-background flex flex-row items-center p-4">
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
