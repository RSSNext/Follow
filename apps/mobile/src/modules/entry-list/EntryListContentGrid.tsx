import { useTypeScriptHappyCallback } from "@follow/hooks"
import type { MasonryFlashListProps } from "@shopify/flash-list"
import { useCallback } from "react"
import { ActivityIndicator, View } from "react-native"

import { useFetchEntriesControls } from "@/src/modules/screen/atoms"
import { useEntryStore } from "@/src/store/entry/store"

import { TimelineSelectorMasonryList } from "../screen/TimelineSelectorList"
import { useOnViewableItemsChanged } from "./hooks"
import type { MasonryItem } from "./templates/EntryGridItem"
import { EntryGridItem } from "./templates/EntryGridItem"

export function EntryListContentGrid({
  entryIds,
  ...rest
}: {
  entryIds: string[]
} & Omit<MasonryFlashListProps<string>, "data" | "renderItem">) {
  const { fetchNextPage, refetch, isRefetching, hasNextPage } = useFetchEntriesControls()
  const onViewableItemsChanged = useOnViewableItemsChanged(
    (item) => (item.key as any).split("-")[0],
  )

  const data = useEntryStore(
    useCallback(
      (state) => {
        const data: (MasonryItem & { index: number })[] = []

        let index = 0
        for (const id of entryIds) {
          const entry = state.data[id]
          if (!entry) {
            continue
          }
          if (!entry.media) {
            continue
          }

          for (const media of entry.media) {
            if (media.type === "photo") {
              data.push({
                id,
                index: index++,
                type: "image",
                imageUrl: media.url,
                blurhash: media.blurhash,
                width: media.width,
                height: media.height,
              })
            } else if (media.type === "video") {
              data.push({
                id,
                index: index++,
                type: "video",
                videoUrl: media.url,
                videoPreviewImageUrl: media.preview_image_url,
              })
            }
          }
        }
        return data
      },
      [entryIds],
    ),
  )

  return (
    <TimelineSelectorMasonryList
      isRefetching={isRefetching}
      data={data}
      renderItem={useTypeScriptHappyCallback(({ item }: { item: MasonryItem }) => {
        return <EntryGridItem {...item} />
      }, [])}
      keyExtractor={defaultKeyExtractor}
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

const defaultKeyExtractor = (item: MasonryItem & { index: number }) => {
  const key = `${item.id}-${item.index}`
  return key
}
