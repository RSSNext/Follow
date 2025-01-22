import type { Credentials } from "@eneris/push-receiver/dist/types"
import Store from "electron-store"

// @keep-sorted
type StoreData = {
  "notifications-credentials"?: Credentials | null
  "notifications-persistent-ids"?: string[] | null
  appearance?: "light" | "dark" | "system" | null
  betterAuthSessionCookie?: string | null
  cacheSizeLimit?: number | null
  proxy?: string | null
  user?: string | null
}
export const store = new Store<StoreData>({ name: "db" })

export enum StoreKey {
  CacheSizeLimit = "cacheSizeLimit",
}
