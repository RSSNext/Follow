import { getSession, listAccounts } from "@follow/shared/auth"
import type { AuthSession } from "@follow/shared/hono"
import type { FetchError } from "ofetch"

import { useAuthQuery } from "~/hooks/common"
import { defineQuery } from "~/lib/defineQuery"

export const auth = {
  getSession: () => defineQuery(["auth", "session"], () => getSession()),
  getAccounts: () =>
    defineQuery(["auth", "accounts"], async () => {
      const accounts = await listAccounts()
      return accounts.data as Array<{ id: string; provider: string }>
    }),
}

export const useAccounts = () => {
  return useAuthQuery(auth.getAccounts())
}

export const useHasPassword = () => {
  const accounts = useAccounts()
  return {
    ...accounts,
    data: !!accounts.data?.find((account) => account.provider === "credential"),
  }
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
      : data?.data
        ? "authenticated"
        : fetchError
          ? "error"
          : "unauthenticated",
  }
}
