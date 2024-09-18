import { apiClient } from "~/lib/api-fetch"
import type { UserModel } from "~/models"

import { entryActions } from "../entry/store"
import { userActions } from "../user"

class EntryHistoryActions {
  async fetchEntryHistory(entryId: string) {
    const res = await apiClient.entries["read-histories"][entryId].$get()

    const data = res.data as {
      users: Record<string, UserModel>
      entryReadHistories: {
        entryId: string
        userIds: string[]
        readCount: number
      }
    }

    userActions.upsert(data.users)
    entryActions.updateReadHistory(entryId, data.entryReadHistories)

    return data
  }
}

export const entryHistoryActions = new EntryHistoryActions()
