import type { Hydratable } from "../services/base"
import { FeedService } from "../services/feed"

export const hydrateDatabaseToStore = async () => {
  async function hydrate() {
    const now = Date.now()

    const hydrates: Hydratable[] = [FeedService]
    await Promise.all(hydrates.map((h) => h.hydrate()))

    const costTime = Date.now() - now

    return costTime
  }
  return hydrate()
}

export const hydrateSettings = () => {}
