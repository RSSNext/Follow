import type { apiClient } from "@renderer/lib/api-fetch"
import type { CombinedEntryModel } from "@renderer/models"

type FeedId = string
type EntryId = string
type EntriesIdTable = Record<FeedId, EntryId[]>

export interface EntryState {
  /**
   * A map of feedId to entryIds
   */
  entries: EntriesIdTable
  /**
   * A map of entryId to entry
   */
  flatMapEntries: Record<FeedId, CombinedEntryModel>
  /**
   * A map of feedId to entryId set, to quickly check if an entryId is in the feed
   * The array is used to keep the order of the entries, and this set is used to quickly check if an entryId is in the feed
   */

  internal_feedId2entryIdSet: Record<FeedId, Set<EntryId>>
  // viewToStarIds: Record<FeedViewType, Set<EntryId>>
  starIds: Set<EntryId>
  // internal_updateSortIds: Record<FeedId, EntryId[]>
}

export interface EntryActions {
  fetchEntries: (params: {
    level?: string
    id?: number | string
    view?: number
    read?: boolean

    pageParam?: string
  }) => Promise<Awaited<ReturnType<typeof apiClient.entries.$post>>>
  fetchEntryById: (entryId: string) => Promise<CombinedEntryModel | undefined>
  upsertMany: (entries: CombinedEntryModel[]) => void

  patch: (entryId: string, changed: Partial<CombinedEntryModel>) => void
  patchManyByFeedId: (
    feedId: string,
    changed: Partial<CombinedEntryModel>
  ) => void
  patchAll: (changed: Partial<CombinedEntryModel>) => void
  getFlattenMapEntries: () => Record<string, CombinedEntryModel>
  markRead: (feedId: string, entryId: string, read: boolean) => void
  markReadByFeedId: (feedId: string) => void
  markStar: (entryId: string, starred: boolean) => void

  clear: () => void
}
