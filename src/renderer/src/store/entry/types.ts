import type { FeedViewType } from "@renderer/lib/enum"
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

export interface EntryFilter {
  unread?: boolean
  view?: FeedViewType
}
