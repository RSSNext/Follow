import "./load-env"

import { requestContext } from "@fastify/request-context"
import { env } from "@follow/shared/env"
import type { AppType } from "@follow/shared/hono"
import { hc } from "hono/client"
import { ofetch } from "ofetch"

import PKG from "../../../../package.json"
import { isDev } from "./env"

export const createApiClient = () => {
  const authSessionToken = getTokenFromCookie(requestContext.get("req")?.headers.cookie || "")

  const req = requestContext.get("req")!

  const { host } = req.headers

  let baseURL = env.VITE_EXTERNAL_API_URL || env.VITE_API_URL

  if (env.VITE_EXTERNAL_API_URL?.startsWith("/")) {
    baseURL = `http://${host}${env.VITE_EXTERNAL_API_URL}`
  }

  const upstreamEnv = req.requestContext.get("upstreamEnv")
  if (upstreamEnv === "dev" && env.VITE_EXTERNAL_DEV_API_URL) {
    baseURL = env.VITE_EXTERNAL_DEV_API_URL
  }
  if (upstreamEnv === "prod" && env.VITE_EXTERNAL_PROD_API_URL) {
    baseURL = env.VITE_EXTERNAL_PROD_API_URL
  }

  const apiFetch = ofetch.create({
    credentials: "include",

    retry: false,

    onRequestError(context) {
      if (context.error.name === "AbortError") {
        return
      }
    },
  })

  const apiClient = hc<AppType>(baseURL, {
    fetch: async (input: any, options = {}) => apiFetch(input.toString(), options),
    headers() {
      return {
        "X-App-Version": PKG.version,
        "X-App-Dev": isDev ? "1" : "0",
        Cookie: authSessionToken ? `authjs.session-token=${authSessionToken}` : "",
      }
    },
  })
  return apiClient
}

export const getTokenFromCookie = (cookie: string) => {
  const parsedCookieMap = cookie
    .split(";")
    .map((item) => item.trim())
    .reduce(
      (acc, item) => {
        const [key, value] = item.split("=")
        acc[key] = value
        return acc
      },
      {} as Record<string, string>,
    )
  return parsedCookieMap["authjs.session-token"]
}

export type ApiClient = ReturnType<typeof createApiClient>
