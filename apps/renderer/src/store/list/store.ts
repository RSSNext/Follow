import { produce } from "immer"

import { runTransactionInScope } from "~/database"
import { apiClient } from "~/lib/api-fetch"
import type { ListModel } from "~/models"
import { ListService } from "~/services"

import { feedActions } from "../feed"
import { userActions } from "../user"
import { createZustandStore } from "../utils/helper"
import type { ListState } from "./types"

export const useListStore = createZustandStore<ListState>("list")(() => ({
  lists: {},
}))

const set = useListStore.setState
class ListActions {
  clear() {
    set({ lists: {} })
  }

  upsertMany(lists: ListModel[]) {
    runTransactionInScope(() => {
      ListService.upsertMany(lists)
    })
    set((state) =>
      produce(state, (state) => {
        for (const list of lists) {
          if (list.creator) {
            userActions.upsert(list.creator)
          }
          if (list.feeds) {
            feedActions.upsertMany(list.feeds)
          }

          state.lists[list.id] = list
        }
      }),
    )
  }

  private patch(listId: string, patch: Partial<ListModel>) {
    set((state) =>
      produce(state, (state) => {
        const list = state.lists[listId]
        if (!list) return

        Object.assign(list, patch)
      }),
    )
  }

  // API Fetcher
  //

  async fetchListById({ listId }: { listId: string }) {
    const res = await apiClient.lists.$get({
      query: {
        listId,
      },
    })

    this.upsertMany([res.data.list])

    return res.data
  }
}
export const listActions = new ListActions()

export const getListById = (listId: string): Nullable<ListModel> =>
  useListStore.getState().lists[listId]
