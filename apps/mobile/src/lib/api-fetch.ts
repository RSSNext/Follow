import type { AppType } from "@follow/shared"
// import { hc } from "hono/dist/cjs/hono"
import { ofetch } from "ofetch"

import { getSessionToken } from "./cookie"

const { hc } = require("hono/dist/cjs/client/client") as typeof import("hono/client")

export const apiFetch = ofetch.create({
  retry: false,
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  onRequest: async ({ options }) => {
    const header = new Headers(options.headers)

    header.set("x-app-name", "Follow Mobile")

    const token = await getSessionToken()

    if (token) {
      // TODO
      // header.set("Cookie", `better-auth.session_token=${decodeURIComponent(token.value)};`)
    }

    options.headers = header
  },
})

export const apiClient = hc<AppType>(process.env.EXPO_PUBLIC_API_URL, {
  fetch: async (input: any, options = {}) =>
    apiFetch(input.toString(), options).catch((err) => {
      throw err
    }),
  headers() {
    return {
      "X-App-Name": "Follow Mobile",
    }
  },
})
