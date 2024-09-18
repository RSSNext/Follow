import { produce } from "immer"

import type { UserModel } from "~/models"

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
    } else {
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
}

export const userActions = new UserActions()
