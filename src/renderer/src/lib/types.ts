import type { apiClient } from "@renderer/queries/api-fetch"
import type { InferResponseType } from "hono/client"

export type ActiveList = {
  level: string
  id: string | number
  name: string
  view: number
  preventNavigate?: boolean
} | null

export type FeedResponse = SubscriptionResponse[number]["feeds"]

export type FeedModel = Extract<
  InferResponseType<typeof apiClient.feeds.$get>,
  { code: 0 }
>["data"]["feed"]

export type SubscriptionResponse = Array<
  Exclude<
    Extract<
      InferResponseType<typeof apiClient.subscriptions.$get>,
      { code: 0 }
    >["data"],
    undefined
  >[number] & { unread?: number }
>

export type EntryResponse = Exclude<
  Extract<
    InferResponseType<typeof apiClient.entries.$get>,
    { code: 0 }
  >["data"],
  undefined
>

export type EntriesResponse = Array<
  Exclude<
    Extract<
      InferResponseType<typeof apiClient.entries.$post>,
      { code: 0 }
    >["data"],
    undefined
  >[number]
>

export type EntryModel = EntriesResponse[number]
export type DiscoverResponse = Array<
  Exclude<
    InferResponseType<typeof apiClient.discover.$post>["data"],
    undefined
  >[number]
>

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

export type ActiveEntry = string | null
