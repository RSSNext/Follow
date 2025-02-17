import { FeedViewType } from "@follow/constants"
import { useTypeScriptHappyCallback } from "@follow/hooks"
import type { MasonryFlashListProps } from "@shopify/flash-list"
import { Image } from "expo-image"
import { Link } from "expo-router"
import { Pressable, View } from "react-native"

import { ThemedText } from "@/src/components/common/ThemedText"
import { ItemPressable } from "@/src/components/ui/pressable/ItemPressable"
import { useFetchEntriesControls, useSelectedView } from "@/src/modules/screen/atoms"
import { useEntry } from "@/src/store/entry/hooks"

import { TimelineSelectorMasonryList } from "../screen/TimelineSelectorList"
import { useOnViewableItemsChanged } from "./hooks"

export function EntryListContentGrid({
  entryIds,
  ...rest
}: {
  entryIds: string[]
} & Omit<MasonryFlashListProps<string>, "data" | "renderItem">) {
  const { fetchNextPage, refetch, isRefetching } = useFetchEntriesControls()
  const onViewableItemsChanged = useOnViewableItemsChanged()

  return (
    <TimelineSelectorMasonryList
      isRefetching={isRefetching}
      onRefresh={
        (() => {
          refetch()
        }) as any
      }
      data={entryIds}
      renderItem={useTypeScriptHappyCallback(({ item }) => {
        return <RenderEntryItem id={item} />
      }, [])}
      keyExtractor={(id) => id}
      onViewableItemsChanged={onViewableItemsChanged}
      onEndReached={() => {
        fetchNextPage()
      }}
      numColumns={2}
      estimatedItemSize={100}
      {...rest}
    />
  )
}

function RenderEntryItem({ id }: { id: string }) {
  const view = useSelectedView()
  const item = useEntry(id)
  if (!item) {
    return null
  }
  const photo = item.media?.find((media) => media.type === "photo")
  const video = item.media?.find((media) => media.type === "video")
  const imageUrl = photo?.url || video?.preview_image_url
  const blurhash = photo?.blurhash || video?.blurhash
  const aspectRatio =
    view === FeedViewType.Pictures && photo?.height && photo.width
      ? photo.width / photo.height
      : 16 / 9

  return (
    <ItemPressable className="m-1 overflow-hidden rounded-md">
      <Link href={`/entries/${item.id}`} asChild>
        <Pressable>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              placeholder={{
                blurhash,
              }}
              style={{
                width: "100%",
                aspectRatio,
              }}
              placeholderContentFit="cover"
              recyclingKey={imageUrl}
            />
          ) : (
            <View className="aspect-video w-full items-center justify-center">
              <ThemedText className="text-center">No media available</ThemedText>
            </View>
          )}
        </Pressable>
      </Link>

      <ThemedText className="p-2">{item.title}</ThemedText>
    </ItemPressable>
  )
}
