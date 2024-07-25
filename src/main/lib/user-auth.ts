import { store } from "./store"

const Key = "authSessionToken"
export const setAuthSessionToken = (token: string) => store.set(Key, token)
export const getAuthSessionToken = (): string | null => store.get(Key)
export const cleanAuthSessionToken = () => store.set(Key, null)
