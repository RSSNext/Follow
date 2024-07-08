import { getCsrfToken } from "@hono/auth-js/react"
import PKG from "@pkg"
import { NetworkStatus, setApiStatus } from "@renderer/atoms/network"
import { setLoginModalShow } from "@renderer/atoms/user"
import type { AppType } from "@renderer/hono"
import { hc } from "hono/client"
import { FetchError, ofetch } from "ofetch"

let csrfTokenPromise: Promise<string> | null = null
export const apiFetch = ofetch.create({
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
  retry: false,
  onRequest: async ({ options }) => {
    if (!csrfTokenPromise) {
      csrfTokenPromise = getCsrfToken()
    }

    const csrfToken = await csrfTokenPromise
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

      const header = new Headers(options.headers)

      header.set("x-app-version", PKG.version)
      header.set(
        "X-App-Dev",
        process.env.NODE_ENV === "development" ? "1" : "0",
      )
      options.headers = header
    }
  },
  onResponse() {
    setApiStatus(NetworkStatus.ONLINE)
  },
  onResponseError(context) {
    const { router } = window

    // If api is down
    if ((!context.response || context.response.status === 0) && navigator.onLine) {
      setApiStatus(NetworkStatus.OFFLINE)
    } else {
      setApiStatus(NetworkStatus.ONLINE)
    }

    if (context.response.status === 401) {
      // Or we can present LoginModal here.
      // router.navigate("/login")
      // If any response status is 401, we can set auth fail. Maybe some bug, but if navigate to login page, had same issues
      setLoginModalShow(true)
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
  fetch: async (input, options = {}) => apiFetch(input.toString(), options).catch(
    (err) => {
      if (err instanceof FetchError && !err.response) {
        setApiStatus(NetworkStatus.OFFLINE)
      }
      throw err
    },
  ),
  headers() {
    return {
      "X-App-Version": PKG.version,
      "X-App-Dev": process.env.NODE_ENV === "development" ? "1" : "0",
    }
  },
})

export const getFetchErrorMessage = (error: Error) => {
  if (error instanceof FetchError) {
    try {
      const json = JSON.parse(error.response?._data)
      // TODO get the biz code to show the error message, and for i18n
      // const bizCode = json.code
      const { reason } = json
      return `${json.message || error.message}${reason ? `: ${reason}` : ""}`
    } catch {
      return error.message
    }
  }

  return error.message
}
