import type { FeedOrListModel, FeedOrListRespModel } from "~/models"

type FeedId = string

export interface FeedState {
  feeds: Record<FeedId, FeedOrListModel>
}

export interface FeedActions {
  upsertMany: (feeds: FeedOrListRespModel[]) => void
  clear: () => void
  patch: (feedId: FeedId, patch: Partial<FeedOrListModel>) => void
}

export type FeedQueryParams = { id?: string; url?: string; isList?: boolean }
