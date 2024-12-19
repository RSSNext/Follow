import { create } from "zustand"

import type { InboxSchema } from "@/src/database/schemas/types"
import { InboxService } from "@/src/services/inbox"

import { createTransaction } from "../internal/helper"

const defaultState = {
  inboxes: [],
}
export const useInboxStore = create<{
  inboxes: InboxSchema[]
}>(() => defaultState)

// const get = useInboxStore.getState
const set = useInboxStore.setState
class InboxActions {
  async upsertMany(inboxes: InboxSchema[]) {
    const state = useInboxStore.getState()
    const tx = createTransaction()
    tx.store(() => {
      const nextInboxes = [...state.inboxes, ...inboxes]
      set({
        ...state,
        inboxes: nextInboxes,
      })
    })
    tx.persist(() => {
      return InboxService.upsertMany(inboxes)
    })
    tx.run()
  }

  reset() {
    set(defaultState)
  }
}

export const inboxActions = new InboxActions()
