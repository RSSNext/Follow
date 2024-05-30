import { levels } from "@renderer/lib/constants"
import type { EntryModel } from "@renderer/lib/types"
import { apiClient } from "@renderer/queries/api-fetch"
import type { InferResponseType } from "hono/client"
import { produce } from "immer"
import { create } from "zustand"

type EntriesIdTable = Record<string, Record<string, EntryModel>>

interface EntryState {
  entries: EntriesIdTable
}

interface EntryActions {
  fetchEntries: (params: {
    level?: string
    id?: number | string
    view?: number
    read?: boolean

    pageParam?: string
  }) => Promise<InferResponseType<typeof apiClient.entries.$post>>
  addOrPatch: (feedId: string, entry: EntryModel) => void
}

export const useEntryStore = create<EntryState & { actions: EntryActions }>(
  (set, get) => ({
    entries: {} as EntriesIdTable,

    get flatMapEntries() {
      const { entries } = get()
      return Object.keys(get().entries).reduce((acc, feedId) => {
        const feedEntries = entries[feedId]
        if (!feedEntries) return acc
        for (const entry of Object.values(feedEntries)) {
          acc[entry.entries.id] = entry
        }
        return acc
      }, {} as Record<string, EntryModel>)
    },
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
            get().actions.addOrPatch(entry.feeds.id, entry)
          })
        }
        return data
      },

      addOrPatch(feedId: string, entry: EntryModel) {
        set((state) =>
          produce(state, (draft) => {
            if (!draft.entries[feedId]) {
              draft.entries[feedId] = {}
            }
            draft.entries[feedId][entry.entries.id] = entry
            return draft
          }),
        )
      },
    },
  }),
)

export const entryActions = useEntryStore.getState().actions

// window.a = () => useEntryStore.getState()
