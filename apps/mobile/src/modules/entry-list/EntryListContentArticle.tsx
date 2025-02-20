import type { ListRenderItemInfo } from "@shopify/flash-list"
import type { ElementRef } from "react"
import { forwardRef, useCallback, useMemo } from "react"
import { View } from "react-native"

import { usePlayingUrl } from "@/src/lib/player"

import { useFetchEntriesControls } from "../screen/atoms"
import { TimelineSelectorList } from "../screen/TimelineSelectorList"
import { useOnViewableItemsChanged } from "./hooks"
import { ItemSeparator } from "./ItemSeparator"
import { EntryNormalItem } from "./templates/EntryNormalItem"

export const EntryListContentArticle = forwardRef<
  ElementRef<typeof TimelineSelectorList>,
  { entryIds: string[] }
>(({ entryIds }, ref) => {
  const playingAudioUrl = usePlayingUrl()

  const { fetchNextPage, isFetching, refetch, isRefetching } = useFetchEntriesControls()

  const renderItem = useCallback(
    ({ item: id, extraData }: ListRenderItemInfo<string>) => (
      <EntryNormalItem key={id} entryId={id} extraData={extraData} />
    ),
    [],
  )

  const ListFooterComponent = useMemo(
    () => (isFetching ? <EntryItemSkeleton /> : null),
    [isFetching],
  )

  const onViewableItemsChanged = useOnViewableItemsChanged()

  return (
    <TimelineSelectorList
      ref={ref}
      onRefresh={refetch}
      isRefetching={isRefetching}
      data={entryIds}
      extraData={playingAudioUrl}
      keyExtractor={(id) => id}
      estimatedItemSize={100}
      renderItem={renderItem}
      onEndReached={fetchNextPage}
      onViewableItemsChanged={onViewableItemsChanged}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooterComponent}
    />
  )
})

export function EntryItemSkeleton() {
  return (
    <View className="bg-secondary-system-grouped-background flex flex-row items-center p-4">
      <View className="flex flex-1 flex-col gap-2">
        <View className="flex flex-row gap-2">
          {/* Icon skeleton */}
          <View className="bg-system-fill size-4 animate-pulse rounded-full" />
          <View className="bg-system-fill h-4 w-1/4 animate-pulse rounded-md" />
        </View>

        {/* Title skeleton */}
        <View className="bg-system-fill h-4 w-3/4 animate-pulse rounded-md" />
        {/* Description skeleton */}
        <View className="bg-system-fill w-full flex-1 animate-pulse rounded-md" />
      </View>

      {/* Image skeleton */}
      <View className="bg-system-fill ml-2 size-20 animate-pulse rounded-md" />
    </View>
  )
}
