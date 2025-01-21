import type { FeedViewType } from "@follow/constants"
import type { ListModel } from "@follow/models/types"
import { useCallback, useMemo } from "react"

import { useWhoami } from "~/atoms/user"

import { useListStore } from "./store"

export const useListById = (listId: Nullable<string>): ListModel | null =>
  useListStore((state) => (listId ? state.lists[listId] || null : null))

export const useListByView = (view: FeedViewType) => {
  return useListStore(
    useCallback((state) => Object.values(state.lists).filter((list) => list.view === view), [view]),
  )
}

export const useOwnedListByView = (view: FeedViewType) => {
  const whoami = useWhoami()
  const viewLists = useListByView(view)
  return useMemo(
    () => viewLists.filter((list) => list.ownerUserId === whoami?.id),
    [viewLists, whoami],
  )
}

export const useOwnedLists = () => {
  const whoami = useWhoami()
  return useListStore(
    useCallback(
      (state) => Object.values(state.lists).filter((list) => list.ownerUserId === whoami?.id),
      [whoami?.id],
    ),
  )
}
