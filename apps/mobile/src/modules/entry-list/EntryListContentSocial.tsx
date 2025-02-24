import type { ListRenderItemInfo } from "@shopify/flash-list"
import type { ElementRef } from "react"
import { forwardRef, useCallback, useMemo } from "react"
import { View } from "react-native"

import { useFetchEntriesControls } from "../screen/atoms"
import { TimelineSelectorList } from "../screen/TimelineSelectorList"
import { useOnViewableItemsChanged } from "./hooks"
import { ItemSeparatorFullWidth } from "./ItemSeparator"
import { EntrySocialItem } from "./templates/EntrySocialItem"

export const EntryListContentSocial = forwardRef<
  ElementRef<typeof TimelineSelectorList>,
  { entryIds: string[] }
>(({ entryIds }, ref) => {
  const { fetchNextPage, isFetching, refetch, isRefetching } = useFetchEntriesControls()

  const renderItem = useCallback(
    ({ item: id }: ListRenderItemInfo<string>) => <EntrySocialItem key={id} entryId={id} />,
    [],
  )

  const ListFooterComponent = useMemo(
    () => (isFetching ? <EntryItemSkeleton /> : null),
    [isFetching],
  )

  const onViewableItemsChanged = useOnViewableItemsChanged({ isLoading: isRefetching })

  return (
    <TimelineSelectorList
      ref={ref}
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
      ItemSeparatorComponent={ItemSeparatorFullWidth}
      ListFooterComponent={ListFooterComponent}
    />
  )
})

export function EntryItemSkeleton() {
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
