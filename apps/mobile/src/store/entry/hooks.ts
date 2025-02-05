import type { FeedViewType } from "@follow/constants"
import { useMutation, useQuery } from "@tanstack/react-query"
import { fetch } from "expo/fetch"
import { useCallback, useEffect } from "react"

import { apiClient } from "@/src/lib/api-fetch"
import { getCookie } from "@/src/lib/auth"

import { getEntry } from "./getter"
import { entryActions, entrySyncServices, useEntryStore } from "./store"
import type { EntryModel, FetchEntriesProps } from "./types"

export const usePrefetchEntries = (props: FetchEntriesProps) => {
  const { feedId, inboxId, listId, view, read, limit, pageParam, isArchived } = props
  return useQuery({
    queryKey: ["entries", feedId, inboxId, listId, view, read, limit, pageParam, isArchived],
    queryFn: () => entrySyncServices.fetchEntries(props),
  })
}
export const usePrefetchEntryContent = (entryId: string) => {
  return useQuery({
    queryKey: ["entry", entryId],
    queryFn: () => entrySyncServices.fetchEntryContent(entryId),
  })
}

export const useEntry = (id: string): EntryModel | undefined => {
  return useEntryStore((state) => state.data[id])
}

function sortEntryIdsByPublishDate(a: string, b: string) {
  const entryA = getEntry(a)
  const entryB = getEntry(b)
  if (!entryA || !entryB) return 0
  return entryB.publishedAt.getTime() - entryA.publishedAt.getTime()
}

export const useEntryIdsByView = (view: FeedViewType) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const ids = state.entryIdByView[view]
        if (!ids) return []
        return Array.from(ids).sort((a, b) => sortEntryIdsByPublishDate(a, b))
      },
      [view],
    ),
  )
}

export const useEntryIdsByFeedId = (feedId: string) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const ids = state.entryIdByFeed[feedId]
        if (!ids) return []
        return Array.from(ids).sort((a, b) => sortEntryIdsByPublishDate(a, b))
      },
      [feedId],
    ),
  )
}

export const useEntryIdsByInboxId = (inboxId: string) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const ids = state.entryIdByInbox[inboxId]
        if (!ids) return []
        return Array.from(ids).sort((a, b) => sortEntryIdsByPublishDate(a, b))
      },
      [inboxId],
    ),
  )
}

export const useEntryIdsByCategory = (category: string) => {
  return useEntryStore(
    useCallback(
      (state) => {
        const ids = state.entryIdByCategory[category]
        if (!ids) return []
        return Array.from(ids).sort((a, b) => sortEntryIdsByPublishDate(a, b))
      },
      [category],
    ),
  )
}

export const useFetchEntryContentByStream = (remoteEntryIds?: string[]) => {
  const { mutate: updateEntryContent } = useMutation({
    mutationKey: ["stream-entry-content", remoteEntryIds],
    mutationFn: async (remoteEntryIds: string[]) => {
      const onlyNoStored = true

      const nextIds = [] as string[]
      if (onlyNoStored) {
        for (const id of remoteEntryIds) {
          const entry = getEntry(id)!
          if (entry.content) {
            continue
          }

          nextIds.push(id)
        }
      }

      if (nextIds.length === 0) return

      const readStream = async () => {
        // https://github.com/facebook/react-native/issues/37505
        // TODO: And it seems we can not just use fetch from expo for ofetch, need further investigation
        const response = await fetch(apiClient.entries.stream.$url().toString(), {
          method: "post",
          headers: {
            cookie: getCookie(),
          },
          body: JSON.stringify({
            ids: nextIds,
          }),
        })

        const reader = response.body?.getReader()
        if (!reader) return

        const decoder = new TextDecoder()
        let buffer = ""

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")

            // Process all complete lines
            for (let i = 0; i < lines.length - 1; i++) {
              if (lines[i]!.trim()) {
                const json = JSON.parse(lines[i]!)
                // Handle each JSON line here
                entryActions.updateEntryContent(json.id, json.content)
              }
            }

            // Keep the last incomplete line in the buffer
            buffer = lines.at(-1) || ""
          }

          // Process any remaining data
          if (buffer.trim()) {
            const json = JSON.parse(buffer)

            entryActions.updateEntryContent(json.id, json.content)
          }
        } catch (error) {
          console.error("Error reading stream:", error)
        } finally {
          reader.releaseLock()
        }
      }

      readStream()
    },
  })

  useEffect(() => {
    if (!remoteEntryIds) return
    updateEntryContent(remoteEntryIds)
  }, [remoteEntryIds, updateEntryContent])
}
