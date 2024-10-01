import { initializeDefaultGeneralSettings } from "~/atoms/settings/general"
import { initializeDefaultIntegrationSettings } from "~/atoms/settings/integration"
import { initializeDefaultUISettings } from "~/atoms/settings/ui"
import { appLog } from "~/lib/log"
import { sleep } from "~/lib/utils"
import {
  EntryRelatedKey,
  EntryRelatedService,
  EntryService,
  FeedService,
  FeedUnreadService,
  SubscriptionService,
} from "~/services"
import { ListService } from "~/services/list"
import type { FlatEntryModel } from "~/store/entry"
import { listActions } from "~/store/list"

import { entryActions, useEntryStore } from "../store/entry/store"
import { feedActions, useFeedStore } from "../store/feed"
import { subscriptionActions } from "../store/subscription"
import { feedUnreadActions } from "../store/unread"

export const setHydrated = (v: boolean) => {
  window.__dbIsReady = v
}

export const hydrateDatabaseToStore = async () => {
  async function hydrate() {
    const now = Date.now()
    await Promise.all([
      hydrateFeed(),
      hydrateSubscription(),
      hydrateFeedUnread(),
      hydrateEntry(),
      hydrateList(),
    ])

    window.__dbIsReady = true
    const costTime = Date.now() - now

    return costTime
  }
  return Promise.race([hydrate(), sleep(1000).then(() => 10e10)]).then((result) => {
    if (result === 10e10) {
      appLog("Hydrate data timeout")
    }
    return result
  })
}

async function hydrateFeed() {
  const feeds = await FeedService.findAll()
  feedActions.upsertMany(feeds)
  return useFeedStore.getState().feeds
}

async function hydrateFeedUnread() {
  const unread = await FeedUnreadService.getAll()

  return feedUnreadActions.hydrate(unread)
}
async function hydrateEntry() {
  const [entries, entryRelated, feedEntries, collections] = await Promise.all([
    EntryService.findAll(),

    EntryRelatedService.findAll(EntryRelatedKey.READ),
    EntryRelatedService.findAll(EntryRelatedKey.FEED_ID),
    EntryRelatedService.findAll(EntryRelatedKey.COLLECTION),
  ])

  const storeValue = [] as FlatEntryModel[]
  for (const entry of entries) {
    const entryRelatedFeedId = entry.feedId || feedEntries[entry.id]
    if (!entryRelatedFeedId) {
      logHydrateError(`Entry ${entry.id} has no related feed id`)
      continue
    }

    storeValue.push({
      entries: entry,
      feedId: entryRelatedFeedId,
      read: entryRelated[entry.id] || false,
      collections: collections[entry.id] as {
        createdAt: string
      },
    })
  }
  entryActions.hydrate(storeValue)
  useEntryStore.setState({
    starIds: new Set(Object.keys(collections)),
  })
}

async function hydrateSubscription() {
  const subscriptions = await SubscriptionService.findAll()

  subscriptionActions.upsertMany(subscriptions)
}

async function hydrateList() {
  const lists = await ListService.findAll()
  listActions.upsertMany(lists)
}

const logHydrateError = (message: string) => {
  // eslint-disable-next-line no-console
  console.debug(`Hydrate error: ${message}, maybe local database data is dirty.`)
}

export const hydrateSettings = () => {
  initializeDefaultUISettings()
  initializeDefaultGeneralSettings()
  initializeDefaultIntegrationSettings()
}
