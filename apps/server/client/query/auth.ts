import { getSession } from "@follow/shared/auth"
import type { AuthSession } from "@follow/shared/hono"
import { useQuery } from "@tanstack/react-query"
import type { FetchError } from "ofetch"

export const useSession = (options?: { enabled?: boolean }) => {
  const { data, isLoading, ...rest } = useQuery({
    queryKey: ["auth", "session"],
    queryFn: () => getSession(),
    retry(failureCount, error) {
      const fetchError = error as FetchError

      if (fetchError.statusCode === undefined) {
        return false
      }

      return !!(3 - failureCount)
    },
    enabled: options?.enabled ?? true,
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
