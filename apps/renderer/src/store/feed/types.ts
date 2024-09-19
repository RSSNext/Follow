import type { FeedModel } from "~/models"

type FeedId = string

export interface FeedState {
  feeds: Record<FeedId, FeedModel>
}

export interface FeedActions {
  upsertMany: (feeds: FeedModel[]) => void
  clear: () => void
  patch: (feedId: FeedId, patch: Partial<FeedModel>) => void
}

export type FeedQueryParams = { id?: string; url?: string }
