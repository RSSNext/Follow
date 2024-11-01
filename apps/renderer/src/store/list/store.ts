import type { FeedModel, ListModel, ListModelPoplutedFeeds } from "@follow/models/types"

import { runTransactionInScope } from "~/database"
import { apiClient } from "~/lib/api-fetch"
import { ListService } from "~/services/list"

import { feedActions } from "../feed"
import { createImmerSetter, createZustandStore } from "../utils/helper"
import type { ListState } from "./types"

export const useListStore = createZustandStore<ListState>("list")(() => ({
  lists: {},
}))

const immerSet = createImmerSetter(useListStore)
const get = useListStore.getState

class ListActionStatic {
  upsertMany(lists: ListModelPoplutedFeeds[]) {
    if (lists.length === 0) return
    const feeds = [] as FeedModel[]
    immerSet((state) => {
      for (const list of lists) {
        state.lists[list.id] = list

        if (!list.feeds) continue
        for (const feed of list.feeds) {
          feeds.push({ ...feed })
        }
      }

      return state
    })

    feedActions.upsertMany(feeds)

    runTransactionInScope(() => ListService.upsertMany(lists))
  }

  async fetchOwnedLists() {
    const res = await apiClient.lists.list.$get()
    this.upsertMany(res.data)

    return res.data
  }

  private patch(listId: string, data: Partial<ListModel>) {
    immerSet((state) => {
      state.lists[listId] = { ...state.lists[listId], ...data }
      return state
    })

    runTransactionInScope(async () => {
      const patchedData = get().lists[listId]
      if (!patchedData) return
      return ListService.upsert(patchedData as ListModel)
    })
  }
  addFeedToFeedList(listId: string, feed: FeedModel) {
    const list = get().lists[listId]
    if (!list) return
    feedActions.upsertMany([feed])

    this.patch(listId, {
      feedIds: [feed.id, ...list.feedIds],
    })
  }

  removeFeedFromFeedList(listId: string, feedId: string) {
    const list = get().lists[listId] as ListModel
    if (!list) return

    this.patch(listId, {
      feedIds: list.feedIds.filter((id) => id !== feedId),
    })
  }

  deleteList(listId: string) {
    immerSet((state) => {
      delete state.lists[listId]
      return state
    })

    runTransactionInScope(() => ListService.bulkDelete([listId]))
  }

  async fetchListById(id: string) {
    const res = await apiClient.lists.$get({ query: { listId: id } })

    this.upsertMany([res.data.list])
    return res.data
  }

  clear() {
    immerSet((state) => {
      state.lists = {}
    })
  }
}

export const listActions = new ListActionStatic()
