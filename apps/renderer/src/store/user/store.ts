import type { UserModel } from "@follow/models/types"
import { produce } from "immer"

import { createZustandStore } from "../utils/helper"

interface UserStoreState {
  users: Record<string, UserModel>
}
export const useUserStore = createZustandStore<UserStoreState>("user")(() => ({
  users: {},
}))

const { getState: _get, setState: set } = useUserStore
class UserActions {
  upsert(user: UserModel | UserModel[] | Record<string, UserModel>) {
    if (!user) return
    if (Array.isArray(user)) {
      set((state) =>
        produce(state, (state) => {
          for (const u of user) {
            if (u?.id) {
              state.users[u.id] = u
            }
          }
        }),
      )
      return
    }
    const idKeyValue = user.id
    if (typeof idKeyValue === "string") {
      set((state) => ({
        users: {
          ...state.users,
          [idKeyValue]: user as UserModel,
        },
      }))
    } else {
      for (const id in user) {
        set((state) => ({
          users: {
            ...state.users,
            [id]: user[id],
          },
        }))
      }
    }
  }
}

export const userActions = new UserActions()
