import { useEntryStore } from "./store"
import type { EntryFilter } from "./types"

export const getFilteredFeedIds = (
  feedIds: string[],
  filter?: EntryFilter,
) => {
  const state = useEntryStore.getState()
  const ids = [] as string[]
  for (const feedId of feedIds) {
    const entries = state.entries[feedId] || []

    ids.push(...entries)
  }

  if (filter?.unread) {
    const result = [] as string[]
    for (const entryId of ids) {
      const entry = state.flatMapEntries[entryId]
      if (!entry?.read) {
        result.push(entryId)
      }
    }
    return result
  }
  return ids
}
