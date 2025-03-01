import type { AppType } from "@follow/shared"
import { env } from "@follow/shared/env"
import PKG from "@pkg"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

import { logger } from "../logger"
import { getBetterAuthSessionCookie, getUser } from "./user"

const abortController = new AbortController()
export const apiFetch = ofetch.create({
  baseURL: env.VITE_API_URL,
  credentials: "include",
  signal: abortController.signal,
  retry: false,
  onRequest({ request }) {
    const betterAuthSessionCookie = getBetterAuthSessionCookie()
    if (!betterAuthSessionCookie) {
      abortController.abort()
      return
    }

    logger.info(`API Request: ${request.toString()}`)
  },
  onRequestError(context) {
    if (context.error.name === "AbortError") {
      return
    }
  },
})

export const apiClient = hc<AppType>("", {
  fetch: async (input, options = {}) => apiFetch(input.toString(), options),
  headers() {
    const betterAuthSessionCookie = getBetterAuthSessionCookie()
    const user = getUser()
    return {
      "X-App-Version": PKG.version,
      "X-App-Dev": process.env.NODE_ENV === "development" ? "1" : "0",
      Cookie: betterAuthSessionCookie ? atob(betterAuthSessionCookie) : "",
      "User-Agent": `Follow/${PKG.version}${user?.id ? ` uid: ${user.id}` : ""}`,
    }
  },
})
