import type { FeedOrListModel } from "@follow/models/types"

type FeedId = string

export interface FeedState {
  feeds: Record<FeedId, FeedOrListModel>
}
export type FeedQueryParams = { id?: string; url?: string }
