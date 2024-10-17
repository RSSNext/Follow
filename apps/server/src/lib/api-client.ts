import "./load-env"

import { env } from "@follow/shared/env"
import type { AppType } from "@follow/shared/hono"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

import PKG from "../../../../package.json"

export const createApiClient = (authSessionToken: string) => {
  const apiFetch = ofetch.create({
    baseURL: process.env.VITE_API_URL,
    credentials: "include",

    retry: false,

    onRequestError(context) {
      if (context.error.name === "AbortError") {
        return
      }
    },
  })

  const apiClient = hc<AppType>(env.VITE_API_URL, {
    fetch: async (input, options = {}) => apiFetch(input.toString(), options),
    headers() {
      return {
        "X-App-Version": PKG.version,
        "X-App-Dev": __DEV__ ? "1" : "0",
        Cookie: authSessionToken ? `authjs.session-token=${authSessionToken}` : "",
      }
    },
  })
  return apiClient
}

export const getTokenFromCookie = (cookie: string) => {
  const parsedCookieMap = cookie
    .split(";")
    .map((item) => item.trim())
    .reduce((acc, item) => {
      const [key, value] = item.split("=")
      acc[key] = value
      return acc
    }, {})
  return parsedCookieMap["authjs.session-token"]
}
