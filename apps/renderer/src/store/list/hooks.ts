import type { FeedViewType } from "~/lib/enum"
import type { ListModel } from "~/models"

import { useListStore } from "./store"

export const useListById = (listId: Nullable<string>): ListModel | null =>
  useListStore((state) => (listId ? state.lists[listId] : null))

export const useListByView = (view: FeedViewType) => {
  return useListStore((state) => Object.values(state.lists).filter((list) => list.view === view))
}
