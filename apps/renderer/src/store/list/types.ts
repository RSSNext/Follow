import type { ListModel } from "~/models"

type ListId = string

export interface ListState {
  lists: Record<ListId, ListModel>
}

export interface ListActions {
  upsertMany: (lists: ListModel[]) => void
  clear: () => void
  patch: (listId: ListId, patch: Partial<ListModel>) => void
}
