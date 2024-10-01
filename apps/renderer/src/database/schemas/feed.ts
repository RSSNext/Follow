import type { FeedModel } from "~/models"

export type DB_FeedUnread = {
  id: string
  count: number
}

export type DB_Feed = FeedModel & { id: string }
