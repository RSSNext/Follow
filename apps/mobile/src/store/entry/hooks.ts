import type { FeedViewType } from "@follow/constants"
import { useQuery } from "@tanstack/react-query"

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
  return useEntryStore((state) => {
    const entryIds = state.entryIdByView[view]
    return Array.from(entryIds).map((id) => state.data[id])
  })
}

export const useEntriesByFeedId = (feedId: string) => {
  return useEntryStore((state) => {
    const entryIds = state.entryIdByFeed[feedId]
    return Array.from(entryIds).map((id) => state.data[id])
  })
}

export const useEntriesByInboxId = (inboxId: string) => {
  return useEntryStore((state) => {
    const entryIds = state.entryIdByInbox[inboxId]
    return Array.from(entryIds).map((id) => state.data[id])
  })
}

export const useEntriesByCategory = (category: string) => {
  return useEntryStore((state) => {
    const entryIds = state.entryIdByCategory[category]
    return Array.from(entryIds).map((id) => state.data[id])
  })
}
