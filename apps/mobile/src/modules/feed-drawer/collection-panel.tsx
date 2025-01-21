import { cn } from "@follow/utils"
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import { Logo } from "@/src/components/ui/logo"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useList } from "@/src/store/list/hooks"
import { useAllListSubscription } from "@/src/store/subscription/hooks"

import { selectCollection, useSelectedCollection } from "./atoms"

export const CollectionPanel = () => {
  const lists = useAllListSubscription()

  const insets = useSafeAreaInsets()
  return (
    <View
      className="bg-quaternary-system-fill dark:bg-tertiary-system-background"
      style={{ width: 65 }}
    >
      <ScrollView
        contentContainerClassName="flex gap-4 px-3.5"
        contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom }}
      >
        <View className="flex-1 items-center">
          <Logo width={37} height={37} color="#222" />
        </View>
        <View style={styles.hairline} className="bg-opaque-separator mx-1" />
        {views.map((viewDef) => (
          <ViewButton key={viewDef.name} viewDef={viewDef} />
        ))}
        <View style={styles.hairline} className="bg-opaque-separator mx-1" />
        {lists.map((listId) => (
          <ListButton key={listId} listId={listId} />
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  hairline: {
    height: StyleSheet.hairlineWidth,
  },
})

const ViewButton = ({ viewDef }: { viewDef: ViewDefinition }) => {
  const selectedCollection = useSelectedCollection()
  const isActive = selectedCollection.type === "view" && selectedCollection.viewId === viewDef.view

  return (
    <TouchableOpacity
      className={cn(
        "flex aspect-square items-center justify-center rounded-full p-3",
        isActive ? "bg-secondary-system-fill" : "bg-system-background",
      )}
      onPress={() =>
        selectCollection({
          type: "view",
          viewId: viewDef.view,
        })
      }
      style={{ backgroundColor: viewDef.activeColor }}
    >
      <viewDef.icon key={viewDef.name} color={"#fff"} />
    </TouchableOpacity>
  )
}

const ListButton = ({ listId }: { listId: string }) => {
  const list = useList(listId)
  const selectedCollection = useSelectedCollection()
  const isActive = selectedCollection.type === "list" && selectedCollection.listId === listId
  if (!list) return null

  return (
    <TouchableOpacity
      className={cn(
        "flex aspect-square items-center justify-center overflow-hidden rounded-full p-3",
        isActive ? "bg-system-fill" : "bg-system-background",
      )}
      onPress={() =>
        selectCollection({
          type: "list",
          listId,
        })
      }
    >
      {list.image ? (
        <Image source={{ uri: list.image, width: 41, height: 41 }} resizeMode="cover" />
      ) : (
        <FallbackIcon title={list.title} size={41} />
      )}
    </TouchableOpacity>
  )
}
