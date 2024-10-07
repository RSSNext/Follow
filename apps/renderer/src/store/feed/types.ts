import type { FeedOrListModel } from "~/models"

type FeedId = string

export interface FeedState {
  feeds: Record<FeedId, FeedOrListModel>
}
export type FeedQueryParams = { id?: string; url?: string }
