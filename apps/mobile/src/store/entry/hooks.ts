import type { FeedViewType } from "@follow/constants"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

import { entrySyncServices, useEntryStore } from "./store"
import type { FetchEntriesProps } from "./types"

export const usePrefetchEntries = (props: FetchEntriesProps) => {
  return useQuery({
    queryKey: ["entries", props],
    queryFn: () => entrySyncServices.fetchEntries(props),
  })
}

export const useEntry = (id: string) => {
  return useEntryStore((state) => state.data[id])
}

export const useEntriesByView = (view: FeedViewType) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const entryIds = state.entryIdByView[view]
        return Array.from(entryIds).map((id) => state.data[id])
      },
      [view],
    ),
  )
}

export const useEntriesByFeedId = (feedId: string) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const entryIds = state.entryIdByFeed[feedId]
        return Array.from(entryIds).map((id) => state.data[id])
      },
      [feedId],
    ),
  )
}

export const useEntriesByInboxId = (inboxId: string) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const entryIds = state.entryIdByInbox[inboxId]
        return Array.from(entryIds).map((id) => state.data[id])
      },
      [inboxId],
    ),
  )
}

export const useEntriesByCategory = (category: string) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const entryIds = state.entryIdByCategory[category]
        return Array.from(entryIds).map((id) => state.data[id])
      },
      [category],
    ),
  )
}
