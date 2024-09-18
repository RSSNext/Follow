import type { IFuseOptions } from "fuse.js"
import Fuse from "fuse.js"

import type { EntryModel } from "~/models"
import { EntryService, FeedService, SubscriptionService } from "~/services"

import type { SubscriptionFlatModel } from "../subscription"
import { createZustandStore } from "../utils/helper"
import { SearchType } from "./constants"
import { defineSearchInstance } from "./helper"
import type { SearchResult, SearchState } from "./types"

const createState = (): SearchState => ({
  feeds: [],
  entries: [],
  subscriptions: [],
  keyword: "",
  searchType: SearchType.All,
})
export const useSearchStore = createZustandStore<SearchState>("search")(createState)

const { getState: get, setState: set } = useSearchStore

class SearchActions {
  reset() {
    set(createState)
  }

  private createFuse<T extends object>(data: T[], keys: (keyof T)[]) {
    const options: IFuseOptions<T> = {
      keys: keys as any,
    }
    const index = Fuse.createIndex(options.keys!, data)
    return new Fuse(data, options, index)
  }

  async createLocalDbSearch() {
    const [entries, feeds, subscriptions] = await Promise.all([
      EntryService.findAll(),
      FeedService.findAll(),
      SubscriptionService.findAll(),
    ])

    const feedsMap = new Map(feeds.map((feed) => [feed.id, feed]))

    const entriesFuse = this.createFuse(entries, ["title", "content", "description", "id"])
    const feedsFuse = this.createFuse(feeds, ["title", "description", "id", "siteUrl", "url"])
    const subscriptionsFuse = this.createFuse(subscriptions, ["title", "category"])

    return defineSearchInstance({
      counts: {
        entries: entries.length,
        feeds: feeds.length,
        subscriptions: subscriptions.length,
      },
      search(keyword: string) {
        const type = get().searchType
        const entries = type & SearchType.Entry ? entriesFuse.search(keyword) : []
        const feeds = type & SearchType.Feed ? feedsFuse.search(keyword) : []

        const subscriptions =
          type & SearchType.Subscription ? subscriptionsFuse.search(keyword) : []

        const processedEntries = [] as SearchResult<EntryModel, { feedId: string }>[]
        for (const entry of entries) {
          const feedId = feedsMap.get(entry.item.feedId)?.id
          if (feedId) {
            processedEntries.push({ item: entry.item, feedId })
          }
        }

        const processedSubscriptions = [] as SearchResult<
          SubscriptionFlatModel,
          { feedId: string }
        >[]
        for (const subscription of subscriptions) {
          const { feedId } = subscription.item
          if (feedId) {
            processedSubscriptions.push({ item: subscription.item, feedId })
          }
        }

        set({
          keyword,
          entries: processedEntries,
          feeds,
          subscriptions: processedSubscriptions,
          searchType: type,
        })

        return get()
      },
    })
  }

  setSearchType(type: SearchType) {
    set({ searchType: type })
  }

  getCurrentKeyword() {
    return get().keyword
  }
}

export const searchActions = new SearchActions()
