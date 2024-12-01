import { getSession } from "@follow/shared/auth"
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
    session: data,
    ...rest,
    status: isLoading
      ? "loading"
      : data
        ? "authenticated"
        : fetchError?.statusCode === 401
          ? "unauthenticated"
          : "error",
  }
}
