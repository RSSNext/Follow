import type { Session } from "@auth/core/types"
import type { GetSessionParams } from "@hono/auth-js/react"
import { authConfigManager } from "@hono/auth-js/react"
import { useBizQuery } from "@renderer/hooks"
import { defineQuery } from "@renderer/lib/defineQuery"
import type { FetchError } from "ofetch"
import { ofetch } from "ofetch"

export const auth = {
  getSession: () => defineQuery(["auth", "session"], () => getSession()),
}

export const useSession = () => {
  const { data, isLoading, ...rest } = useBizQuery(auth.getSession(), {
    retry(failureCount, error) {
      const fetchError = error as FetchError

      if (fetchError.statusCode === undefined) {
        return false
      }

      return !!(3 - failureCount)
    },
  })
  const { error } = rest
  const fetchError = error as FetchError

  return {
    session: data,
    ...rest,
    status: isLoading ?
      "loading" :
      data ?
        "authenticated" :
        fetchError?.statusCode === 401 ?
          "unauthenticated" :
          "error",
  }
}

/**
 * Fetch session data, copy and patch code from @hono/auth-js/react
 */
async function fetchData<T = any>(
  path: string,

  req: any = {},
): Promise<T | null> {
  const config = authConfigManager.getConfig()
  const url = `${config.baseUrl}${config.basePath}/${path}`

  const options: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(req?.headers?.cookie ? { cookie: req.headers.cookie } : {}),
    },
    credentials: config.credentials,
  }

  if (req?.body) {
    options.body = JSON.stringify(req.body)
    options.method = "POST"
  }

  const data = await ofetch(url, options)

  return data as T
}

function getSession(params?: GetSessionParams) {
  return fetchData<Session>("session", params)
}
