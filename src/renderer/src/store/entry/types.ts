import type { apiClient } from "@renderer/lib/api-fetch"
import type { EntryModel } from "@renderer/models"

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
  flatMapEntries: Record<FeedId, EntryModel>
  /**
   * A map of feedId to entryId set, to quickly check if an entryId is in the feed
   * The array is used to keep the order of the entries, and this set is used to quickly check if an entryId is in the feed
   */

  internal_feedId2entryIdSet: Record<FeedId, Set<EntryId>>
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
  fetchEntryById: (entryId: string) => Promise<EntryModel | undefined>
  upsertMany: (entries: EntryModel[]) => void

  optimisticUpdate: (entryId: string, changed: Partial<EntryModel>) => void
  optimisticUpdateManyByFeedId: (
    feedId: string,
    changed: Partial<EntryModel>
  ) => void
  optimisticUpdateAll: (changed: Partial<EntryModel>) => void
  getFlattenMapEntries: () => Record<string, EntryModel>
  markRead: (feedId: string, entryId: string, read: boolean) => void
  markReadByFeedId: (feedId: string) => void

  clear: () => void
}
