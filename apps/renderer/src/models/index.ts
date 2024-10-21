import type { User } from "@auth/core/types"

import type { FeedModel } from "./types"

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

  export interface TrendingAggregates {
    trendingFeeds: FeedModel[]
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
}
