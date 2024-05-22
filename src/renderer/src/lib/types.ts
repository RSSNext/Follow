export type ActivedList = {
  level: string
  id: string | number
  name: string
  view: number
  preventNavigate?: boolean
} | null

export type FeedResponse = {
  id: string
  url: string
  title?: string
  description?: string
  siteUrl?: string
  image?: string
  checkedAt: string
  nextCheckAt: string
  lastModifiedHeader?: string
  etagHeader?: string
  ttl: number
  errorAt?: string
  errorMessage?: string
}

export type SubscriptionResponse = {
  userId: string
  feedId: string
  view: number
  category?: string
  title?: string
  isPrivate?: boolean
  unread?: number
  feeds: FeedResponse
}[]

export type EntriesResponse = {
  author?: string
  category?: string[]
  changedAt: string
  content?: string
  description?: string
  enclosure?: {
    url: string
    type?: string
    length?: number
    title?: string
  }
  feedId: string
  guid: string
  id: string
  images?: string[]
  publishedAt: string
  readingTime?: number
  title?: string
  url?: string

  feeds: FeedResponse
  collections: {
    createdAt: string
  } | null
}[]

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

export type ActivedEntry = string | null
