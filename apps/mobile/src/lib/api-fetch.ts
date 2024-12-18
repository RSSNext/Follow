/* eslint-disable no-console */
import type { AppType } from "@follow/shared"
import { ofetch } from "ofetch"

import { getSessionToken } from "./cookie"

const { hc } = require("hono/dist/cjs/client/client") as typeof import("hono/client")

export const apiFetch = ofetch.create({
  retry: false,
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  onRequest: async ({ options, request }) => {
    const header = new Headers(options.headers)

    header.set("x-app-name", "Follow Mobile")

    const token = await getSessionToken()

    if (token) {
      // TODO
      // header.set("Cookie", `better-auth.session_token=${decodeURIComponent(token.value)};`)
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
    console.error(error)
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
