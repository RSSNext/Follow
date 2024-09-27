import type { FeedOrListRespModel } from "~/models"

export type DB_FeedUnread = {
  id: string
  count: number
}

export type DB_Feed = FeedOrListRespModel & { id: string }
