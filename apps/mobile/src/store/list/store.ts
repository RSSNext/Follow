import type { ListSchema } from "@/src/database/schemas/types"
import { apiClient } from "@/src/lib/api-fetch"
import { honoMorph } from "@/src/morph/hono"
import { storeDbMorph } from "@/src/morph/store-db"
import { ListService } from "@/src/services/list"

import { createTransaction, createZustandStore } from "../internal/helper"

export type ListModel = Omit<ListSchema, "feedIds"> & {
  feedIds: string[]
}
type ListId = string
interface ListState {
  lists: Record<ListId, ListModel>
  listIds: ListId[]
}

const defaultState: ListState = {
  lists: {},
  listIds: [],
}

export const useListStore = createZustandStore<ListState>("list")(() => defaultState)

const get = useListStore.getState
const set = useListStore.setState
class ListActions {
  upsertManyInSession(lists: ListModel[]) {
    const state = get()

    set({
      ...state,
      lists: { ...state.lists, ...Object.fromEntries(lists.map((list) => [list.id, list])) },
      listIds: [...state.listIds, ...lists.map((list) => list.id)],
    })
  }
  upsertMany(lists: ListModel[]) {
    const tx = createTransaction()
    tx.store(() => {
      this.upsertManyInSession(lists)
    })

    tx.persist(() => {
      return ListService.upsertMany(lists.map((list) => storeDbMorph.toListSchema(list)))
    })
    tx.run()
  }
  reset() {
    set(defaultState)
  }
}

export const listActions = new ListActions()

class ListSyncServices {
  async fetchListById(params: { id: string }) {
    const list = await apiClient.lists.$get({ query: { listId: params.id } })

    listActions.upsertMany([honoMorph.toList(list.data)])

    return list.data
  }
}

export const listSyncServices = new ListSyncServices()
