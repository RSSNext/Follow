import type { User } from "@auth/core/types"

import { store } from "./store"

const AuthKey = "authSessionToken"
export const setAuthSessionToken = (token: string) => store.set(AuthKey, token)
export const getAuthSessionToken = (): string | null => store.get(AuthKey)
export const cleanAuthSessionToken = () => store.set(AuthKey, null)

const UserKey = "user"
export const setUser = (user: User) => store.set(UserKey, JSON.stringify(user))
export const getUser = (): User | null => {
  const user = store.get(UserKey)
  return user ? JSON.parse(user) : null
}

export const cleanUser = () => store.set(UserKey, null)
