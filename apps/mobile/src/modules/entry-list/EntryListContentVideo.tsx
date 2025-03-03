import { useTypeScriptHappyCallback } from "@follow/hooks"
import type { MasonryFlashListProps } from "@shopify/flash-list"
import type { ElementRef } from "react"
import { forwardRef, useMemo } from "react"
import { View } from "react-native"

import { useFetchEntriesControls } from "@/src/modules/screen/atoms"

import { TimelineSelectorMasonryList } from "../screen/TimelineSelectorList"
import { useOnViewableItemsChanged } from "./hooks"
import { EntryVideoItem } from "./templates/EntryVideoItem"

export const EntryListContentVideo = forwardRef<
  ElementRef<typeof TimelineSelectorMasonryList>,
  { entryIds: string[]; active?: boolean } & Omit<
    MasonryFlashListProps<string>,
    "data" | "renderItem"
  >
>(({ entryIds, active, ...rest }, ref) => {
  const { fetchNextPage, refetch, isRefetching, isFetching } = useFetchEntriesControls()
  const { onViewableItemsChanged, onScroll } = useOnViewableItemsChanged({
    disabled: active === false || isFetching,
  })

  const ListFooterComponent = useMemo(
    () =>
      isFetching ? (
        <View className="flex flex-row justify-between">
          <EntryItemSkeleton />
          <EntryItemSkeleton />
        </View>
      ) : null,
    [isFetching],
  )

  return (
    <TimelineSelectorMasonryList
      ref={ref}
      isRefetching={isRefetching}
      data={entryIds}
      renderItem={useTypeScriptHappyCallback(({ item }: { item: string }) => {
        return <EntryVideoItem id={item} />
      }, [])}
      keyExtractor={defaultKeyExtractor}
      onViewableItemsChanged={onViewableItemsChanged}
      onScroll={onScroll}
      onEndReached={fetchNextPage}
      numColumns={2}
      estimatedItemSize={100}
      ListFooterComponent={ListFooterComponent}
      {...rest}
      onRefresh={refetch}
    />
  )
})

const defaultKeyExtractor = (item: string) => {
  return item
}

export function EntryItemSkeleton() {
  return (
    <View className="m-1 overflow-hidden rounded-md">
      {/* Video thumbnail */}
      <View className="bg-system-fill aspect-video h-32 w-full animate-pulse rounded-md" />

      {/* Description and footer */}
      <View className="my-2 px-2">
        {/* Description */}
        <View className="bg-system-fill mb-1 h-4 w-full animate-pulse rounded-md" />
        <View className="bg-system-fill mb-3 h-4 w-3/4 animate-pulse rounded-md" />

        {/* Footer with feed icon and metadata */}
        <View className="flex-row items-center gap-1">
          <View className="bg-system-fill size-4 animate-pulse rounded-full" />
          <View className="bg-system-fill h-3 w-24 animate-pulse rounded-md" />
          <View className="bg-system-fill h-3 w-20 animate-pulse rounded-md" />
        </View>
      </View>
    </View>
  )
}
