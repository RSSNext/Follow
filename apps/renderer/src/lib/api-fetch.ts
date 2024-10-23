import { env } from "@follow/shared/env"
import type { AppType } from "@follow/shared/hono"
import { getCsrfToken } from "@hono/auth-js/react"
import PKG from "@pkg"
import { hc } from "hono/client"
import { FetchError, ofetch } from "ofetch"
import { createElement } from "react"
import { toast } from "sonner"

import { NetworkStatus, setApiStatus } from "~/atoms/network"
import { setLoginModalShow } from "~/atoms/user"
import { NeedActivationToast } from "~/modules/activation/NeedActivationToast"

let csrfTokenPromise: Promise<string> | null = null
export const apiFetch = ofetch.create({
  baseURL: env.VITE_API_URL,
  credentials: "include",
  retry: false,
  onRequest: async ({ options }) => {
    if (!csrfTokenPromise) {
      csrfTokenPromise = getCsrfToken()
    }

    const csrfToken = await csrfTokenPromise

    const header = new Headers(options.headers)

    header.set("x-app-version", PKG.version)
    header.set("X-App-Dev", process.env.NODE_ENV === "development" ? "1" : "0")
    header.set("X-Csrf-Token", csrfToken)
    options.headers = header
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
      if (json.code.toString().startsWith("11")) {
        setTimeout(() => {
          const toastId = toast.error(
            createElement(NeedActivationToast, {
              dimiss: () => {
                toast.dismiss(toastId)
              },
            }),
            {
              closeButton: true,
              duration: 10e4,
            },
          )
        }, 500)
      }
    } catch {
      // ignore
    }
  },
})

export const apiClient = hc<AppType>(env.VITE_API_URL, {
  fetch: async (input, options = {}) =>
    apiFetch(input.toString(), options).catch((err) => {
      if (err instanceof FetchError && !err.response) {
        setApiStatus(NetworkStatus.OFFLINE)
      }
      throw err
    }),
  async headers() {
    return {
      "X-App-Version": PKG.version,
      "X-App-Dev": process.env.NODE_ENV === "development" ? "1" : "0",
      "X-Csrf-Token": await getCsrfToken(),
    }
  },
})
