import { levels } from "@renderer/lib/constants"
import type { EntryModel } from "@renderer/lib/types"
import { apiClient } from "@renderer/queries/api-fetch"
import type { InferResponseType } from "hono/client"
import { produce } from "immer"
import { create } from "zustand"

type EntriesIdTable = Record<string, Record<string, EntryModel>>

interface EntryState {
  entries: EntriesIdTable

  flatMapEntries: Record<string, EntryModel>
}

interface EntryActions {
  fetchEntries: (params: {
    level?: string
    id?: number | string
    view?: number
    read?: boolean

    pageParam?: string
  }) => Promise<InferResponseType<typeof apiClient.entries.$post>>
  upsert: (feedId: string, entry: EntryModel) => void
  optimisticUpdate: (entryId: string, changed: Partial<EntryModel>) => void
  getFlattenMapEntries: () => Record<string, EntryModel>
}

export const useEntryStore = create<EntryState & { actions: EntryActions }>(
  (set, get) => ({
    entries: {},
    flatMapEntries: {},

    actions: {
      fetchEntries: async ({
        level,
        id,
        view,
        read,

        pageParam,
      }: {
        level?: string
        id?: number | string
        view?: number
        read?: boolean

        pageParam?: string
      }) => {
        const params: {
          feedId?: string
          feedIdList?: string[]
        } = {}
        if (level === levels.folder) {
          params.feedIdList = `${id}`.split(",")
        } else if (level === levels.feed) {
          params.feedId = `${id}`
        }
        const res = await apiClient.entries.$post({
          json: {
            publishedAfter: pageParam as string,
            view,
            read,
            ...params,
          },
        })

        const data = await res.json()

        if (data.data) {
          data.data.forEach((entry: EntryModel) => {
            get().actions.upsert(entry.feeds.id, entry)
          })
        }
        return data
      },

      getFlattenMapEntries() {
        return get().flatMapEntries
      },
      optimisticUpdate(entryId: string, changed: Partial<EntryModel>) {
        set((state) =>
          produce(state, (draft) => {
            const entry = draft.flatMapEntries[entryId]
            if (!entry) return
            Object.assign(entry, changed)
            return draft
          }),
        )
      },

      upsert(feedId: string, entry: EntryModel) {
        set((state) =>
          produce(state, (draft) => {
            if (!draft.entries[feedId]) {
              draft.entries[feedId] = {}
            }
            draft.entries[feedId][entry.entries.id] = entry
            draft.flatMapEntries[entry.entries.id] = entry
            return draft
          }),
        )
      },
    },
  }),
)

export const entryActions = useEntryStore.getState().actions

export const useEntriesByFeedId = (feedId: string) =>
  useEntryStore((state) => state.entries[feedId])
export const useEntry = (entryId: string) =>
  useEntryStore((state) => state.flatMapEntries[entryId])

Object.assign(window, {
  get __entry() {
    return useEntryStore.getState()
  },
})
