import type { InboxSchema } from "@/src/database/schemas/types"
import { InboxService } from "@/src/services/inbox"

import { createTransaction, createZustandStore } from "../internal/helper"

const defaultState = {
  inboxes: [],
}
export const useInboxStore = createZustandStore<{
  inboxes: InboxSchema[]
}>("inbox")(() => defaultState)

// const get = useInboxStore.getState
const set = useInboxStore.setState
class InboxActions {
  async upsertManyInSession(inboxes: InboxSchema[]) {
    const state = useInboxStore.getState()
    const nextInboxes = [...state.inboxes, ...inboxes]
    set({
      ...state,
      inboxes: nextInboxes,
    })
  }
  async upsertMany(inboxes: InboxSchema[]) {
    const tx = createTransaction()
    tx.store(() => {
      this.upsertManyInSession(inboxes)
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
