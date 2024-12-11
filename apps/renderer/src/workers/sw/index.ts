/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { CacheFirst } from "workbox-strategies"

import { registerPusher } from "./pusher"

declare let self: ServiceWorkerGlobalScope

registerPusher(self)

const preCacheExclude = new Set(["og-image.png", "opengraph-image.png"])

const precacheManifest = self.__WB_MANIFEST.filter((entry) => {
  return typeof entry === "string" || !preCacheExclude.has(entry.url)
})

registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-assets",
  }),
)

precacheAndRoute(precacheManifest)

cleanupOutdatedCaches()
