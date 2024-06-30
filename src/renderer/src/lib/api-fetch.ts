import { getCsrfToken } from "@hono/auth-js/react"
import type { AppType } from "@renderer/hono"
import { hc } from "hono/client"
import { FetchError, ofetch } from "ofetch"

const csrfToken = await getCsrfToken()

export const apiFetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
  retry: false,
  onRequest: async ({ options }) => {
    if (options.method && options.method.toLowerCase() !== "get") {
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
    const { router } = window
    if (context.response.status === 401) {
      // Or we can present LoginModal here.
      router.navigate("/login")
    }
    try {
      const json = JSON.parse(context.response._data)
      if (context.response.status === 400 && json.code === 1003) {
        router.navigate("/invitation")
      }
    } catch {
      // ignore
    }
  },
})

export const apiClient = hc<AppType>("", {
  fetch: async (input, options = {}) => apiFetch(input.toString(), options),
})

export const getFetchErrorMessage = (error: Error) => {
  if (error instanceof FetchError) {
    try {
      const json = JSON.parse(error.response?._data)
      // TODO get the biz code to show the error message, and for i18n
      // const bizCode = json.code
      return json.message || error.message
    } catch {
      return error.message
    }
  }

  return error.message
}
