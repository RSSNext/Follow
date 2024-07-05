import {
  FEED_COLLECTION_LIST,
  ROUTE_FEED_IN_FOLDER,
} from "@renderer/lib/constants"
import type { FeedViewType } from "@renderer/lib/enum"
import type { CombinedEntryModel } from "@renderer/models"
import { useShallow } from "zustand/react/shallow"

import { useFeedIdByView, useFolderFeedsByFeedId } from "../subscription"
import { getEntryIsInView } from "../utils/biz"
import { getFilteredFeedIds } from "./helper"
import { useEntryStore } from "./store"
import type { EntryFilter } from "./types"

export const useEntry = (
  entryId: Nullable<string>,
): CombinedEntryModel | null =>
  useEntryStore(
    useShallow((state) => (entryId ? state.flatMapEntries[entryId] : null)),
  )
// feedId: single feedId, multiple feedId joint by `,`, and `collections`
export const useEntryIdsByFeedId = (feedId: string, filter?: EntryFilter) =>
  useEntryStore(
    useShallow((state) => {
      if (typeof feedId !== "string") return []
      const isMultiple = feedId.includes(",")

      const isInFolder =
        feedId.startsWith(ROUTE_FEED_IN_FOLDER) ||
        feedId === FEED_COLLECTION_LIST
      if (isInFolder) {
        return []
      }
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
          if (
            getEntryIsInView(entryId)?.toString() === filter?.view?.toString()
          ) {
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
    useShallow(() => getFilteredFeedIds(feedIds, filter)),
  )
}

export const useEntryIdsByFolderName = (
  folderName: string,
  filter: EntryFilter = {},
) => {
  const feedIds = useFolderFeedsByFeedId(folderName)
  return useEntryStore(
    useShallow(() => {
      if (!feedIds) return []

      return getFilteredFeedIds(feedIds, filter)
    }),
  )
}
export const useEntryIdsByFeedIdOrView = (
  feedIdOrView: string | FeedViewType,
  filter: EntryFilter = {},
) => {
  const byView = useEntryIdsByView(feedIdOrView as FeedViewType, filter)
  const byId = useEntryIdsByFeedId(feedIdOrView as string, filter)
  const byFolder = useEntryIdsByFolderName(feedIdOrView as string, filter)
  if (typeof feedIdOrView === "string") {
    return feedIdOrView.startsWith(ROUTE_FEED_IN_FOLDER) ? byFolder : byId
  }
  return byView
}
