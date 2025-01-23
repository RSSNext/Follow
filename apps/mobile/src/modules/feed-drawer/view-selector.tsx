import { Image } from "expo-image"
import { ScrollView, TouchableOpacity } from "react-native"
import { Grayscale } from "react-native-color-matrix-image-filters"

import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useList } from "@/src/store/list/hooks"
import { useAllListSubscription } from "@/src/store/subscription/hooks"
import { useColor } from "@/src/theme/colors"

import { selectFeed, useSelectedFeed } from "../feed-drawer/atoms"

export function ViewSelector() {
  const lists = useAllListSubscription()

  return (
    <ScrollView horizontal contentContainerClassName="flex-row gap-3 items-center">
      {views.map((view) => (
        <ViewItem key={view.name} view={view} />
      ))}
      {lists.map((listId) => (
        <ListItem key={listId} listId={listId} />
      ))}
    </ScrollView>
  )
}

function ViewItem({ view }: { view: ViewDefinition }) {
  const selectedFeed = useSelectedFeed()
  const isActive = selectedFeed.type === "view" && selectedFeed.viewId === view.view

  const bgColor = useColor("gray2")

  return (
    <TouchableOpacity
      className="relative flex size-8 items-center justify-center overflow-hidden rounded-full"
      onPress={() => selectFeed({ type: "view", viewId: view.view })}
      style={{
        backgroundColor: isActive ? view.activeColor : bgColor,
      }}
    >
      <view.icon color={"#fff"} height={15} width={15} />
    </TouchableOpacity>
  )
}

function ListItem({ listId }: { listId: string }) {
  const list = useList(listId)
  const selectedFeed = useSelectedFeed()
  const isActive = selectedFeed.type === "list" && selectedFeed.listId === listId

  if (!list) return null

  return (
    <TouchableOpacity
      className="relative flex size-8 items-center justify-center overflow-hidden rounded-full"
      onPress={() => selectFeed({ type: "list", listId })}
    >
      {list.image ? (
        isActive ? (
          <Image source={list.image} contentFit="cover" style={{ width: 32, height: 32 }} />
        ) : (
          <Grayscale>
            <Image source={list.image} contentFit="cover" style={{ width: 32, height: 32 }} />
          </Grayscale>
        )
      ) : (
        <FallbackIcon title={list.title} size="100%" gray={!isActive} />
      )}
    </TouchableOpacity>
  )
}
