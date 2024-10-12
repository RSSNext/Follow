import type { languageSchema, users } from "@follow/shared/hono"
import type { z } from "zod"

import type { apiClient } from "~/lib/api-fetch"

export type UserModel = Omit<
  Omit<Omit<typeof users.$inferSelect, "emailVerified">, "email">,
  "createdAt"
>

export type ExtractBizResponse<T extends (...args: any[]) => any> = Exclude<
  Awaited<ReturnType<T>>,
  undefined
>

export type ActiveList = {
  id: string | number
  name: string
  view: number
}

export type TransactionModel = ExtractBizResponse<
  typeof apiClient.wallets.transactions.$get
>["data"][number]

export type FeedModel = ExtractBizResponse<typeof apiClient.feeds.$get>["data"]["feed"]

export type ListModelPoplutedFeeds = ExtractBizResponse<typeof apiClient.lists.$get>["data"]["list"]
export type ListModel = Omit<ListModelPoplutedFeeds, "feeds">

export type InboxModel = ExtractBizResponse<typeof apiClient.inboxes.$get>["data"]

export type FeedOrListRespModel = FeedModel | ListModelPoplutedFeeds | InboxModel
export type FeedOrListModel = FeedModel | ListModel | InboxModel

export type EntryResponse = Exclude<
  Extract<ExtractBizResponse<typeof apiClient.entries.$get>, { code: 0 }>["data"],
  undefined
>

export type EntriesResponse = Array<
  | Exclude<Awaited<ReturnType<typeof apiClient.entries.$post>>["data"], undefined>
  | Exclude<Awaited<ReturnType<typeof apiClient.entries.inbox.$post>>["data"], undefined>
>[number]

export type CombinedEntryModel = EntriesResponse[number] & {
  entries: {
    content?: string | null
  }
}
export type EntryModel = CombinedEntryModel["entries"]
export type DiscoverResponse = Array<
  Exclude<ExtractBizResponse<typeof apiClient.discover.$post>["data"], undefined>[number]
>

export type ActionsResponse = Exclude<
  ExtractBizResponse<typeof apiClient.actions.$get>["data"],
  undefined
>["rules"]

export type DataResponse<T> = {
  code: number
  data?: T
}

export type ActiveEntryId = Nullable<string>

export type SubscriptionModel = ExtractBizResponse<
  typeof apiClient.subscriptions.$get
>["data"][number] & {
  unread?: number
}

export type FeedSubscriptionModel = Extract<SubscriptionModel, { feeds: any }>
export type ListSubscriptionModel = Extract<SubscriptionModel, { list: any }>

export type SupportedLanguages = z.infer<typeof languageSchema>

export type RecommendationItem = ExtractBizResponse<
  typeof apiClient.discover.rsshub.$get
>["data"][string]

export type ActionOperation = "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex"
export type ActionEntryField = "all" | "title" | "content" | "author" | "url" | "order"
export type ActionFeedField = "view" | "title" | "site_url" | "feed_url" | "category"

export type MediaModel = Exclude<
  ExtractBizResponse<typeof apiClient.entries.$get>["data"],
  undefined
>["entries"]["media"]

export type ActionsInput = {
  name: string
  condition: {
    field?: ActionFeedField
    operator?: ActionOperation
    value?: string
  }[]
  result: {
    translation?: string
    summary?: boolean
    readability?: boolean
    silence?: boolean
    newEntryNotification?: boolean
    rewriteRules?: {
      from: string
      to: string
    }[]
    blockRules?: {
      field?: ActionEntryField
      operator?: ActionOperation
      value?: string | number
    }[]
    webhooks?: string[]
  }
}[]

export const TransactionTypes = ["mint", "purchase", "tip", "withdraw"] as const
