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
export type SubscriptionResponse = Array<
  Exclude<
    Extract<
      InferResponseType<typeof apiClient.subscriptions.$get>,
      { code: 0 }
    >["data"],
    undefined
  >[number] & { unread?: number }
>

// export type EntriesResponse = {
//   author?: string
//   category?: string[]
//   changedAt: string
//   content?: string
//   description?: string
//   enclosure?: {
//     url: string
//     type?: string
//     length?: number
//     title?: string
//   }
//   feedId: string
//   guid: string
//   id: string
//   images?: string[]
//   publishedAt: string
//   readingTime?: number
//   title?: string
//   url?: string

//   feeds: FeedResponse
//   collected: boolean
//   read: boolean
// }[]
export type EntriesResponse = Array<
  Exclude<
    Extract<
      InferResponseType<typeof apiClient.entries.$get>,
      { code: 0 }
    >["data"],
    undefined
  >
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
