import { getCsrfToken } from "@hono/auth-js/react"
import type { AppType } from "@renderer/hono"
import { router } from "@renderer/router"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

export const apiFetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
  retry: false,
  onRequest: async ({ options }) => {
    if (options.method && options.method.toLowerCase() !== "get") {
      const csrfToken = await getCsrfToken()

      if (typeof options.body === "string") {
        options.body = JSON.parse(options.body)
      }
      if (!options.body) {
        options.body = {}
      }
      if (options.body instanceof FormData) {
        options.body.append("csrfToken", csrfToken)
      } else {
        (options.body as Record<string, unknown>).csrfToken = csrfToken
      }
    }
  },
  onResponseError(context) {
    if (context.response.status === 401) {
      router.navigate("/login")
    }
  },
})

export const apiClient = hc<AppType>("", {
  fetch: async (input, options = {}) => apiFetch(input.toString(), options),
})
