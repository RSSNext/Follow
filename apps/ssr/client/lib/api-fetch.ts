import { env } from "@follow/shared/env"
import type { AppType } from "@follow/shared/hono"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

const apiFetch = ofetch.create({
  credentials: "include",
  retry: false,
  onRequest: ({ options }) => {
    const header = new Headers(options.headers)

    header.set("x-app-version", "Web External")
    options.headers = header
  },
})

export const apiClient = hc<AppType>(env.VITE_EXTERNAL_API_URL || env.VITE_API_URL, {
  fetch: async (input: any, options = {}) =>
    apiFetch(input.toString(), options).catch((err) => {
      throw err
    }),
  headers() {
    return {
      "X-App-Version": "Web External",
    }
  },
})
