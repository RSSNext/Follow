import { runTransactionInScope } from "~/database"
import { apiClient } from "~/lib/api-fetch"
import type { InboxModel } from "~/models"
import { InboxService } from "~/services/inbox"

import { createImmerSetter, createZustandStore } from "../utils/helper"
import type { InboxState } from "./types"

export const useInboxStore = createZustandStore<InboxState>("inbox")(() => ({
  inboxes: {},
}))

const set = createImmerSetter(useInboxStore)

class InboxActionStatic {
  upsertMany(inboxs: InboxModel[]) {
    if (inboxs.length === 0) return
    set((state) => {
      for (const inbox of inboxs) {
        state.inboxes[inbox.id] = inbox
      }
      return state
    })

    runTransactionInScope(() => InboxService.upsertMany(inboxs))
  }

  async fetchInboxById(id: string) {
    const res = await apiClient.inboxes.$get({
      query: {
        handle: id,
      },
    })
    this.upsertMany([res.data])

    return res.data
  }

  clear() {
    set((state) => {
      state.inboxes = {}
    })
  }
}

export const inboxActions = new InboxActionStatic()
