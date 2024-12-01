import { getSession } from "@follow/shared/auth"
import type { AuthSession } from "@follow/shared/hono"
import type { FetchError } from "ofetch"

import { useAuthQuery } from "~/hooks/common"
import { defineQuery } from "~/lib/defineQuery"

export const auth = {
  getSession: () => defineQuery(["auth", "session"], () => getSession()),
}

export const useSession = (options?: { enabled?: boolean }) => {
  const { data, isLoading, ...rest } = useAuthQuery(auth.getSession(), {
    retry(failureCount, error) {
      const fetchError = error as FetchError

      if (fetchError.statusCode === undefined) {
        return false
      }

      return !!(3 - failureCount)
    },
    enabled: options?.enabled ?? true,
    refetchOnMount: true,
    staleTime: 0,
    meta: {
      persist: true,
    },
  })
  const { error } = rest
  const fetchError = error as FetchError

  return {
    session: data?.data as AuthSession,
    ...rest,
    status: isLoading
      ? "loading"
      : data
        ? "authenticated"
        : fetchError
          ? "error"
          : "unauthenticated",
  }
}
