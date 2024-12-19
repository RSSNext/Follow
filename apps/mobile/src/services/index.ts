import { FeedService } from "./feed"
import { InboxService } from "./inbox"
import type { Hydratable } from "./internal/base"
import { SubscriptionService } from "./subscription"

const hydrates: Hydratable[] = [FeedService, SubscriptionService, InboxService]

export const hydrateDatabaseToStore = async () => {
  await Promise.all(hydrates.map((h) => h.hydrate()))
}
