import { FEED_COLLECTION_LIST } from "@renderer/lib/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import type { CombinedEntryModel } from "@renderer/models"
import { useShallow } from "zustand/react/shallow"

import { useFeedIdByView } from "../subscription"
import { getEntryIsInView } from "../utils/biz"
import { useEntryStore } from "./store"

interface EntryFilter {
  unread?: boolean
  view?: FeedViewType
}

export const useEntry = (entryId: Nullable<string >): CombinedEntryModel | null =>
  useEntryStore(useShallow((state) => entryId ? state.flatMapEntries[entryId] : null))
// feedId: single feedId, multiple feedId joint by `,`, and `collections`
export const useEntryIdsByFeedId = (feedId: string, filter?: EntryFilter) =>
  useEntryStore(
    useShallow((state) => {
      const isMultiple = typeof feedId === "string" && feedId.includes(",")

      if (isMultiple) {
        const feedIds = feedId.split(",")
        const result = [] as string[]
        for (const id of feedIds) {
          result.push(...getSingle(id))
        }
        return result
      } else if (feedId === FEED_COLLECTION_LIST) {
        const result = [] as string[]
        state.starIds.forEach((entryId) => {
          if (getEntryIsInView(entryId)?.toString() === filter?.view?.toString()) {
            result.push(entryId)
          }
        })

        return result
      } else {
        return getSingle(feedId)
      }

      function getSingle(feedId: string) {
        const data = state.entries[feedId] || []
        if (filter?.unread) {
          const result = [] as string[]
          for (const entryId of data) {
            const entry = state.flatMapEntries[entryId]
            if (!entry?.read) {
              result.push(entryId)
            }
          }
          return result
        }
        return data
      }
    }),
  )

export const useEntryIdsByView = (view: FeedViewType, filter?: EntryFilter) => {
  const feedIds = useFeedIdByView(view)

  return useEntryStore(
    useShallow((state) => {
      const data = [] as string[]
      for (const feedId of feedIds) {
        const entries = state.entries[feedId] || []

        data.push(...entries)
      }

      if (filter?.unread) {
        const result = [] as string[]
        for (const entryId of data) {
          const entry = state.flatMapEntries[entryId]
          if (!entry?.read) {
            result.push(entryId)
          }
        }
        return result
      }
      return data
    }),
  )
}

export const useEntryIdsByFeedIdOrView = (
  feedIdOrView: string | FeedViewType,
  filter: EntryFilter = {},
) => {
  const byView = useEntryIdsByView(feedIdOrView as FeedViewType, filter)
  const byId = useEntryIdsByFeedId(feedIdOrView as string, filter)

  if (typeof feedIdOrView === "string") {
    return byId
  }
  return byView
}
