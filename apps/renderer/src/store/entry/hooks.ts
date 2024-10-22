import type { FeedViewType } from "@follow/constants"
import type { EntryReadHistoriesModel } from "@follow/shared/hono"
import { useShallow } from "zustand/react/shallow"

import { FEED_COLLECTION_LIST, ROUTE_FEED_IN_FOLDER } from "~/constants"

import { useFeedIdByView } from "../subscription"
import { getEntryIsInView, getFilteredFeedIds } from "./helper"
import { useEntryStore } from "./store"
import type { EntryFilter, FlatEntryModel } from "./types"

export const useEntry = <T = FlatEntryModel>(
  entryId: Nullable<string>,
  selector?: (state: FlatEntryModel) => T,
): T | null =>
  useEntryStore(
    useShallow((state) => {
      if (!entryId) return null
      const data = state.flatMapEntries[entryId]

      if (!data) return null

      return selector ? selector(data) : (data as T)
    }),
  )

// feedId: single feedId, multiple feedId joint by `,`, and `collections`
export const useEntryIdsByFeedId = (feedId: string, filter?: EntryFilter) =>
  useEntryStore(
    useShallow((state) => {
      if (typeof feedId !== "string") return []
      const isMultiple = feedId.includes(",")

      const isInFolder = feedId.startsWith(ROUTE_FEED_IN_FOLDER)

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
      } else if (isInFolder) {
        // please use `useEntryIdsByFolderName` instead
        return []
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

  return useEntryStore(useShallow(() => getFilteredFeedIds(feedIds, filter)))
}

export const useEntryIdsByFeedIds = (feedIds: string[], filter: EntryFilter = {}) =>
  useEntryStore(
    useShallow(() => {
      if (!feedIds) return null
      if (!Array.isArray(feedIds)) return null

      return getFilteredFeedIds(feedIds, filter)
    }),
  )
export const useEntryIdsByFeedIdOrView = (
  feedIdOrView: string | string[] | FeedViewType,
  filter: EntryFilter = {},
) => {
  const byView = useEntryIdsByView(feedIdOrView as FeedViewType, filter)
  const byId = useEntryIdsByFeedId(feedIdOrView as string, filter)
  const byFolder = useEntryIdsByFeedIds(feedIdOrView as string[], filter)
  if (Array.isArray(feedIdOrView)) {
    return byFolder
  } else if (typeof feedIdOrView === "string") {
    return byId
  } else {
    return byView
  }
}

export const useEntryReadHistory = (
  entryId: string,
): Omit<EntryReadHistoriesModel, "entryId"> | null =>
  useEntryStore(useShallow((state) => state.readHistory[entryId]))
