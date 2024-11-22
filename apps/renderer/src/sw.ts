/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"
import { CacheFirst, NetworkFirst } from "workbox-strategies"

declare let self: ServiceWorkerGlobalScope

// 从 Service Worker 的 URL 参数中获取 PWA 状态
const isPWA = new URL(self.location.href).searchParams.get("pwa") === "true"

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
})

const preCacheExclude = new Set(["og-image.png", "opengraph-image.png"])

const precacheManifest = self.__WB_MANIFEST.filter((entry) => {
  return typeof entry === "string" || !preCacheExclude.has(entry.url)
})
precacheAndRoute(precacheManifest)

cleanupOutdatedCaches()

// 根据 PWA 状态选择固定的策略
const strategy = isPWA
  ? new CacheFirst({ cacheName: "assets-cache-first" })
  : new NetworkFirst({
      cacheName: "assets-network-first",
      networkTimeoutSeconds: 1,
    })

const fileExtensionRegexp = /\/[^/?][^./?]*\.[^/]+$/
registerRoute(({ url }) => {
  if (
    precacheManifest.some((entry) => {
      const urlToMatch = typeof entry === "string" ? entry : entry.url
      return url.pathname === urlToMatch
    })
  ) {
    return true
  }
  return fileExtensionRegexp.test(url.pathname)
}, strategy)

let allowlist
if (import.meta.env.DEV) allowlist = [/^\/$/]

registerRoute(new NavigationRoute(strategy, { allowlist }))
