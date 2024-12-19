import type { Hydratable } from "../services/base"
import { FeedService } from "../services/feed"
import { SubscriptionService } from "../services/subscription"

const hydrates: Hydratable[] = [FeedService, SubscriptionService]
export const hydrateDatabaseToStore = async () => {
  await Promise.all(hydrates.map((h) => h.hydrate()))
}

export const hydrateSettings = () => {}
