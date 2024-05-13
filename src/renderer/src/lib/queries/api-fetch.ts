import { ofetch } from "ofetch"
import { getCsrfToken } from "@hono/auth-js/react"

export const apiFetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
  onRequest: async ({ options }) => {
    if (options.method && options.method.toLowerCase() !== "get") {
      const csrfToken = await getCsrfToken()
      if (!options.body) {
        options.body = {}
      }
      ;(options.body as Record<string, any>).csrfToken = csrfToken
    }
  },
})
