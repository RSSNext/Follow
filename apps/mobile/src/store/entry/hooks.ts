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

export const useEntryIdsByView = (view: FeedViewType) => {
  return useEntryStore((state) => state.entryIdByView[view])
}

export const useEntryIdsByFeedId = (feedId: string) => {
  return useEntryStore((state) => state.entryIdByFeed[feedId])
}

export const useEntryIdsByInboxId = (inboxId: string) => {
  return useEntryStore((state) => state.entryIdByInbox[inboxId])
}

export const useEntryIdsByCategory = (category: string) => {
  return useEntryStore((state) => state.entryIdByCategory[category])
}
