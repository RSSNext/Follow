import type { TargetModel } from "~/models"

export type DB_FeedUnread = {
  id: string
  count: number
}

export type DB_Feed = TargetModel & { id: string }
