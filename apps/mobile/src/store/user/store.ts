import type { UserSchema } from "@/src/database/schemas/types"
import { apiClient } from "@/src/lib/api-fetch"
import { UserService } from "@/src/services/user"

import { createImmerSetter, createTransaction, createZustandStore } from "../internal/helper"

export type UserModel = Omit<UserSchema, "isMe">
type UserStore = {
  users: Record<string, UserModel>
  whoami: UserModel | null
}

export const useUserStore = createZustandStore<UserStore>("user")(() => ({
  users: {},
  whoami: null,
}))

// const set = useUserStore.setState
const immerSet = createImmerSetter(useUserStore)

class UserSyncService {
  async whoami() {
    const res = (await (apiClient["better-auth"] as any)["get-session"].$get()) as {
      user: UserModel
    } | null // TODO
    if (res) {
      immerSet((state) => {
        state.whoami = res.user
      })
      userActions.upsertMany([res.user])
      return res.user
    } else {
      return null
    }
  }
}

class UserActions {
  upsertManyInSession(users: UserModel[]) {
    immerSet((state) => {
      for (const user of users) {
        state.users[user.id] = user
      }
    })
  }

  async upsertMany(users: UserModel[]) {
    const tx = createTransaction()
    tx.store(() => this.upsertManyInSession(users))
    const { whoami } = useUserStore.getState()
    tx.persist(() =>
      UserService.upsertMany(
        users.map((user) => ({ ...user, isMe: whoami?.id === user.id ? 1 : 0 })),
      ),
    )
    await tx.run()
  }
}

export const userSyncService = new UserSyncService()
export const userActions = new UserActions()
