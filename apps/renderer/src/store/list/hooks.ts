import type { FeedViewType } from "@follow/constants"
import type { ListModel } from "@follow/models/types"
import { useMemo } from "react"

import { useWhoami } from "~/atoms/user"

import { useListStore } from "./store"

export const useListById = (listId: Nullable<string>): ListModel | null =>
  useListStore((state) => (listId ? state.lists[listId] : null))

export const useListByView = (view: FeedViewType) => {
  return useListStore((state) => Object.values(state.lists).filter((list) => list.view === view))
}

export const useOwnedList = (view: FeedViewType) => {
  const whoami = useWhoami()
  const viewLists = useListByView(view)
  return useMemo(
    () => viewLists.filter((list) => list.ownerUserId === whoami?.id),
    [viewLists, whoami],
  )
}
