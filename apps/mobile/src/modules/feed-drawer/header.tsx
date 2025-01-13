import type { FeedViewType } from "@follow/constants"
import { Text, View } from "react-native"

import { useList } from "@/src/store/list/hooks"

import { SortActionButton } from "../subscription/header-actions"
import { useViewDefinition } from "./atoms"

export const ViewHeaderComponent = ({ view }: { view: FeedViewType }) => {
  const viewDef = useViewDefinition(view)
  return (
    <View className="border-b-separator border-b-hairline flex flex-row items-center gap-2">
      <Text className="text-text my-4 ml-4 text-2xl font-bold">{viewDef.name}</Text>
      <SortActionButton />
    </View>
  )
}

export const ListHeaderComponent = ({ listId }: { listId: string }) => {
  const list = useList(listId)
  if (!list) {
    console.warn("list not found:", listId)
    return null
  }
  return (
    <View className="border-b-separator border-b-hairline flex flex-col gap-2 py-4">
      <View className="flex flex-row items-center gap-2">
        <Text className="text-text ml-4 text-2xl font-bold">{list.title}</Text>
      </View>
      {list.description && (
        <Text className="text-tertiary-label ml-4 text-sm font-medium">{list.description}</Text>
      )}
    </View>
  )
}
