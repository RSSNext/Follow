import type { ListSchema } from "@/src/database/schemas/types"
import { storeDbMorph } from "@/src/morph/store-db"
import { ListService } from "@/src/services/list"

import { createTransaction, createZustandStore } from "../internal/helper"

export type ListModel = Omit<ListSchema, "feedIds"> & {
  feedIds: string[]
}
interface ListState {
  lists: ListModel[]
}

const defaultState: ListState = {
  lists: [],
}

const useListStore = createZustandStore<ListState>("list")(() => defaultState)

const get = useListStore.getState
const set = useListStore.setState
class ListActions {
  upsertMany(lists: ListModel[]) {
    const state = get()

    const tx = createTransaction()
    tx.store(() => {
      set({ ...state, lists: [...state.lists, ...lists] })
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
