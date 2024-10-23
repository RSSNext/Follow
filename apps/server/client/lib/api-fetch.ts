import { env } from "@follow/shared/env"
import type { AppType } from "@follow/shared/hono"
import { getCsrfToken } from "@hono/auth-js/react"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

let csrfTokenPromise: Promise<string> | null = null
const apiFetch = ofetch.create({
  credentials: "include",
  retry: false,
  onRequest: async ({ options }) => {
    if (!csrfTokenPromise) {
      csrfTokenPromise = getCsrfToken()
    }

    const csrfToken = await csrfTokenPromise

    const header = new Headers(options.headers)

    header.set("x-app-version", "Web External")
    header.set("X-Csrf-Token", csrfToken)
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
