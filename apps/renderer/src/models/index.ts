export * from "./types"

/* eslint-disable @typescript-eslint/no-namespace */
export namespace Models {
  export interface TrendingList {
    id: string
    title: string
    description: string
    image: string
    view: number
    fee: number
    timelineUpdatedAt: string
    ownerUserId: string
    subscriberCount: number
  }

  export interface TrendingFeed {
    id: string
    url: string
    title: string
    description: string
    siteUrl: string
    image: string
    checkedAt: string
    lastModified: string
    ttl: number
    subscriberCount: number
    ownerUserId: string
  }

  export interface TrendingAggregates {
    trendingFeeds: TrendingFeed[]
    trendingLists: TrendingList[]
    trendingEntries: TrendingEntry[]
    trendingUsers: User[]
  }

  export interface TrendingEntry {
    id: string
    feedId: string
    title: string
    url: string
    content: string
    description: string
    guid: string
    author: string
    insertedAt: string
    publishedAt: string
    readCount: number
  }

  export interface List {
    id: string
    feedIds: string[]
    title: string
    description: string
    image: string
    view: number
    fee: number
    timelineUpdatedAt: string
    ownerUserId: string
  }
  export interface Entry {
    id: string
    feedId: string
    title: string
    url: string
    content: string
    description: string
    guid: string
    author: string
    authorUrl: string
    authorAvatar: string
    insertedAt: string
    publishedAt: string
    media: any[]
  }

  export interface UserSession {
    user: {
      createdAt: string
      email: string
      emailVerified: string | null
      handle: string
      id: string
      image: string
      name: string
    }
  }
  export interface FeedModal {
    id: string
    url: string
    title: string
    description: string
    siteUrl: string
    image: string
    checkedAt: string
    lastModifiedHeader: string
    etagHeader: string
    ttl: number
    ownerUserId: string
  }

  export interface User {
    id: string
    name: string
    handle: string
    image: string
  }

  export interface Comment {
    id: number
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    userId: string
    entryId: string
    content: string
  }
}
