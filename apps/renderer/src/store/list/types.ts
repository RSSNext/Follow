import type { ListModel } from "~/models"

type FeedId = string

export interface ListState {
  lists: Record<FeedId, ListModel>
}
