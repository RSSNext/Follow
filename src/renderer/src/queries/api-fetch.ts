import { getCsrfToken } from "@hono/auth-js/react"
import type { AppType } from "@renderer/hono"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

export const apiFetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
  onRequest: async ({ options }) => {
    if (options.method && options.method.toLowerCase() !== "get") {
      const csrfToken = await getCsrfToken()
      if (!options.body) {
        options.body = {}
      }
      if (options.body instanceof FormData) {
        options.body.append("csrfToken", csrfToken)
      } else {
        ;(options.body as Record<string, unknown>).csrfToken = csrfToken
      }
    }
  },
})

export const apiClient = hc<AppType>(
  import.meta.env.VITE_API_URL,
  {
    fetch: async (...args) => {
      const options = args[1] as RequestInit
      options.credentials = "include"
      if (options.method && options.method.toLowerCase() !== "get") {
        const csrfToken = await getCsrfToken()
        if (!options.body) {
          options.body = JSON.stringify({})
        }
        if (options.body instanceof FormData) {
          options.body.append("csrfToken", csrfToken)
        } else {
          if (typeof options.body === "string") {
            options.body = JSON.stringify({ csrfToken, ...JSON.parse(options.body) })
          }
        }
      }
      return fetch(args[0], options)
    },
  },
)
