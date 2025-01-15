import { cn } from "@follow/utils"
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useList } from "@/src/store/list/hooks"
import { useAllListSubscription } from "@/src/store/subscription/hooks"

import { selectCollection, useSelectedCollection } from "./atoms"

export const CollectionPanel = () => {
  const winDim = useWindowDimensions()
  const lists = useAllListSubscription()

  const insets = useSafeAreaInsets()
  return (
    <View
      className="bg-tertiary-system-background"
      style={{ width: Math.max(50, winDim.width * 0.15) }}
    >
      <ScrollView
        contentContainerClassName="flex py-3 gap-3"
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {views.map((viewDef) => (
          <ViewButton key={viewDef.name} viewDef={viewDef} />
        ))}
        <View style={styles.hairline} className="bg-opaque-separator mx-4" />
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
        "mx-3 flex aspect-square items-center justify-center rounded-lg p-3",
        isActive ? "bg-secondary-system-fill" : "bg-system-background",
      )}
      onPress={() =>
        selectCollection({
          type: "view",
          viewId: viewDef.view,
        })
      }
    >
      <viewDef.icon key={viewDef.name} color={viewDef.activeColor} />
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
        "mx-3 flex aspect-square items-center justify-center rounded-lg p-3",
        isActive ? "bg-system-fill" : "bg-system-background",
      )}
      onPress={() =>
        selectCollection({
          type: "list",
          listId,
        })
      }
    >
      <View className="overflow-hidden rounded">
        {list.image ? (
          <Image source={{ uri: list.image, width: 24, height: 24 }} resizeMode="cover" />
        ) : (
          <FallbackIcon title={list.title} size={24} />
        )}
      </View>
    </TouchableOpacity>
  )
}
