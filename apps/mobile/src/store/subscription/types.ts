import type { FeedViewType } from "@follow/constants"

export interface SubscriptionForm {
  url?: string
  view: FeedViewType
  category: string
  isPrivate: boolean
  title: string
  feedId?: string
  listId?: string
}
