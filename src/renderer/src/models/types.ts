import type { apiClient } from "@renderer/lib/api-fetch"
import type { languageSchema, users } from "src/hono"
import type { z } from "zod"

export type UserModel = Omit<typeof users.$inferSelect, "emailVerified">

export type ExtractBizResponse<T extends (...args: any[]) => any> = Exclude<
  Awaited<ReturnType<T>>,
  undefined
>

export type ActiveList = {
  id: string | number
  name: string
  view: number
}

export type FeedResponse = SubscriptionResponse[number]["feeds"]

export type FeedModel = ExtractBizResponse<
  typeof apiClient.feeds.$get
>["data"]["feed"]

export type SubscriptionResponse = Array<
  ExtractBizResponse<typeof apiClient.subscriptions.$get>["data"][number] & {
    unread?: number
  }
>

export type EntryResponse = Exclude<
  Extract<
    ExtractBizResponse<typeof apiClient.entries.$get>,
    { code: 0 }
  >["data"],
  undefined
>

export type EntriesResponse = Array<
  Exclude<
    Awaited<ReturnType<typeof apiClient.entries.$post>>["data"],
    undefined
  >
>[number]

export type CombinedEntryModel = EntriesResponse[number] & {
  entries: {
    content?: string | null
  }
}
export type EntryModel = CombinedEntryModel["entries"]
export type DiscoverResponse = Array<
  Exclude<
    ExtractBizResponse<typeof apiClient.discover.$post>["data"],
    undefined
  >[number]
>

export type ActionsResponse = Exclude<
  ExtractBizResponse<typeof apiClient.actions.$get>["data"],
  undefined
>["rules"]

export type ListResponse<T> = {
  code: number
  data?: T
  total?: number
  message?: string
}

export type DataResponse<T> = {
  code: number
  data?: T
}

export type ActiveEntryId = Nullable<string>

export type SubscriptionModel = SubscriptionResponse[number]

export type FeedListModel = {
  list: {
    list: SubscriptionResponse
    name: string
  }[]
}

export type SupportedLanguages = z.infer<typeof languageSchema>

export type RecommendationItem = ExtractBizResponse<typeof apiClient.discover.rsshub.$get>["data"][string]

export type ActionOperation =
  | "contains"
  | "not_contains"
  | "eq"
  | "not_eq"
  | "gt"
  | "lt"
  | "regex"
export type ActionEntryField = "all" | "title" | "content" | "author" | "url" | "order"
export type ActionFeedField = "view" | "title" | "site_url" | "feed_url" | "category"
