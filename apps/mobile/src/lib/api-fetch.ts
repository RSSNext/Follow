/* eslint-disable no-console */
import type { AppType } from "@follow/shared"
import { router } from "expo-router"
import { ofetch } from "ofetch"

import { getSessionToken } from "./cookie"
import { getApiUrl } from "./env"

const { hc } = require("hono/dist/cjs/client/client") as typeof import("hono/client")

export const apiFetch = ofetch.create({
  retry: false,

  baseURL: getApiUrl(),
  onRequest: async ({ options, request }) => {
    const header = new Headers(options.headers)

    header.set("x-app-name", "Follow Mobile")

    const sessionToken = await getSessionToken()
    if (sessionToken) {
      header.set("cookie", `__Secure-better-auth.session_token=${sessionToken}`)
    }
    if (__DEV__) {
      // Logger
      console.log(`---> ${options.method} ${request as string}`)
    }

    options.headers = header
  },
  onRequestError: ({ error, request, options }) => {
    if (__DEV__) {
      console.log(`[Error] ---> ${options.method} ${request as string}`)
    }
    console.error(error)
  },

  onResponse: ({ response, request, options }) => {
    if (__DEV__) {
      console.log(`<--- ${response.status} ${options.method} ${request as string}`)
    }
  },
  onResponseError: ({ error, request, options, response }) => {
    if (__DEV__) {
      console.log(`<--- [Error] ${response.status} ${options.method} ${request as string}`)
    }
    if (response.status === 401) {
      router.replace("/login")
    } else {
      console.error(error)
    }
  },
})

export const apiClient = hc<AppType>(getApiUrl(), {
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
