import { useTypeScriptHappyCallback } from "@follow/hooks"
import type { MasonryFlashListProps } from "@shopify/flash-list"
import { ActivityIndicator, View } from "react-native"

import { useFetchEntriesControls } from "@/src/modules/screen/atoms"

import { TimelineSelectorMasonryList } from "../screen/TimelineSelectorList"
import { useOnViewableItemsChanged } from "./hooks"
import { EntryGridItem } from "./templates/EntryGridItem"

export function EntryListContentGrid({
  entryIds,
  ...rest
}: {
  entryIds: string[]
} & Omit<MasonryFlashListProps<string>, "data" | "renderItem">) {
  const { fetchNextPage, refetch, isRefetching, hasNextPage } = useFetchEntriesControls()
  const onViewableItemsChanged = useOnViewableItemsChanged()

  return (
    <TimelineSelectorMasonryList
      isRefetching={isRefetching}
      data={entryIds}
      renderItem={useTypeScriptHappyCallback(({ item }) => {
        return <EntryGridItem id={item} />
      }, [])}
      keyExtractor={(id) => id}
      onViewableItemsChanged={onViewableItemsChanged}
      onEndReached={() => {
        fetchNextPage()
      }}
      numColumns={2}
      estimatedItemSize={100}
      ListFooterComponent={
        hasNextPage ? (
          <View className="h-20 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : null
      }
      {...rest}
      onRefresh={refetch}
    />
  )
}
