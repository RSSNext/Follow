import type { CombinedEntryModel, FeedModel } from "@renderer/models"
import {
  EntryRelatedKey,
  EntryRelatedService,
  EntryService,
  FeedService,
  SubscriptionService,
} from "@renderer/services"

import { entryActions } from "../entry/store"
import { feedActions, useFeedStore } from "../feed"
import { subscriptionActions } from "../subscription"

// This flag controls write data in indexedDB, if it's false, pass data insert to db
// When app not ready, it's false, after hydrate data, it's true
// Or set is false when disable indexedDB in setting
let _isHydrated = false

export const setHydrated = (v: boolean) => {
  console.info("setHydrated", v)
  _isHydrated = v
}

export const isHydrated = () => _isHydrated

export const hydrateDatabaseToStore = async () => {
  const now = Date.now()
  const [feeds] = await Promise.all([hydrateFeed(), hydrateSubscription()])

  await hydrateEntry(feeds)
  _isHydrated = true
  console.info("hydrate data done, cast:", Date.now() - now)
}

async function hydrateFeed() {
  const feeds = await FeedService.findAll()
  feedActions.upsertMany(feeds)
  return useFeedStore.getState().feeds
}
async function hydrateEntry(feedMap: Record<string, FeedModel>) {
  const [entries, entryRelated, feedEntries] = await Promise.all([
    EntryService.findAll(),

    EntryRelatedService.findAll(EntryRelatedKey.READ),
    EntryRelatedService.findAll(EntryRelatedKey.FEED_ID),
  ])

  const storeValue = [] as CombinedEntryModel[]
  for (const entry of entries) {
    const entryRelatedFeedId = feedEntries[entry.id]
    if (!entryRelatedFeedId) {
      logHydrateError(`Entry ${entry.id} has no related feed id`)
      continue
    }
    const feed = feedMap[entryRelatedFeedId]

    if (!feed) {
      logHydrateError(`Entry related feed ${entryRelatedFeedId} is missing`)
      continue
    }

    storeValue.push({
      entries: entry,
      feeds: feed,
      read: entryRelated[entry.id] || false,
    })
  }
  entryActions.upsertMany(storeValue)
}

async function hydrateSubscription() {
  const subscriptions = await SubscriptionService.findAll()

  subscriptionActions.upsertMany(subscriptions)
}

const logHydrateError = (message: string) => {
  // eslint-disable-next-line no-console
  console.debug(
    `Hydrate error: ${message}, maybe local database data is dirty.`,
  )
}
