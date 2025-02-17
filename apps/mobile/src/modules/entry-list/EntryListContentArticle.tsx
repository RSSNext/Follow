import type { ListRenderItemInfo } from "@shopify/flash-list"
import { useCallback, useMemo } from "react"
import { View } from "react-native"

import { useFetchEntriesControls } from "../screen/atoms"
import { TimelineSelectorList } from "../screen/TimelineSelectorList"
import { useOnViewableItemsChanged } from "./hooks"
import { ItemSeparator } from "./ItemSeparator"
import { EntryNormalItem } from "./templates/EntryNormalItem"

export function EntryListContentArticle({ entryIds }: { entryIds: string[] }) {
  const { fetchNextPage, isFetching, refetch, isRefetching } = useFetchEntriesControls()

  const renderItem = useCallback(
    ({ item: id }: ListRenderItemInfo<string>) => <EntryNormalItem key={id} entryId={id} />,
    [],
  )

  const ListFooterComponent = useMemo(
    () => (isFetching ? <EntryItemSkeleton /> : null),
    [isFetching],
  )

  const onViewableItemsChanged = useOnViewableItemsChanged()

  return (
    <TimelineSelectorList
      onRefresh={() => {
        refetch()
      }}
      isRefetching={isRefetching}
      data={entryIds}
      keyExtractor={(id) => id}
      estimatedItemSize={100}
      renderItem={renderItem}
      onEndReached={() => {
        fetchNextPage()
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      ItemSeparatorComponent={ItemSeparator}
      ListFooterComponent={ListFooterComponent}
    />
  )
}

export function EntryItemSkeleton() {
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
