import type { ListModel } from "~/models"

import { useListStore } from "./store"

export const useListById = (listId: Nullable<string>): ListModel | null =>
  useListStore((state) => (listId ? state.lists[listId] : null))
