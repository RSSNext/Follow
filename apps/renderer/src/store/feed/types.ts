import type { TargetModel } from "~/models"

type FeedId = string

export interface FeedState {
  feeds: Record<FeedId, TargetModel>
}

export interface FeedActions {
  upsertMany: (feeds: TargetModel[]) => void
  clear: () => void
  patch: (feedId: FeedId, patch: Partial<TargetModel>) => void
}

export type FeedQueryParams = { id?: string; url?: string; isList?: boolean }
