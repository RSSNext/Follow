import type { EntryModel, FeedModel } from "~/models"

import type { SubscriptionFlatModel } from "../subscription"
import type { SearchType } from "./constants"

// @ts-expect-error
export interface SearchResult<T extends object, A extends object = object> extends A {
  item: T
}

export interface SearchState {
  feeds: SearchResult<FeedModel>[]
  entries: SearchResult<EntryModel, { feedId: string }>[]
  subscriptions: SearchResult<SubscriptionFlatModel, { feedId: string }>[]

  keyword: string
  searchType: SearchType
}
export interface SearchInstance {
  search: (keyword: string) => SearchState

  counts: {
    feeds: number
    entries: number
    subscriptions: number
  }
}
