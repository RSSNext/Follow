import { beforeEach, describe, expect, it, vi } from "vitest"

import { FeedService } from "~/services/feed"

import { doMigration } from "./index"

describe("migrationTipUser", () => {
  const APP_VERSION = "0.2.0-beta.0"
  const lastAppVersionKey = "follow:app_version"

  beforeEach(() => {
    vi.clearAllMocks()
    // @ts-expect-error simulating global variable
    window.APP_VERSION = APP_VERSION
    localStorage.clear()
  })

  it("should migrationTipUser works", async () => {
    localStorage.setItem(lastAppVersionKey, "0.1.2-beta.0")
    const normalFeed = {
      id: "2",
      type: "feed" as const,
      url: "https://example.com/feed",
      tipUsers: [
        {
          id: "foo",
          name: "bar",
          createdAt: "",
          emailVerified: "",
          handle: null,
          image: null,
        },
      ],
    }
    await FeedService.upsertMany([
      {
        id: "1",
        // @ts-expect-error simulating dirty data
        tipUsers: {},
      },
      normalFeed,
    ])
    await doMigration()
    const feeds = await FeedService.findAll()
    expect(feeds).toEqual([{ id: "1", tipUsers: [] }, normalFeed])
    expect(window.__app_is_upgraded__).toBe(true)
  })
})
