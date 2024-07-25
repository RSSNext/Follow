import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import type { OmitKeyof } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import type { PersistQueryClientOptions } from "@tanstack/react-query-persist-client"
import { FetchError } from "ofetch"

import { QUERY_PERSIST_KEY } from "../constants/app"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1000,
      retry(failureCount, error) {
        console.error(error)
        if (error instanceof FetchError && error.statusCode === undefined) {
          return false
        }

        return !!(3 - failureCount)
      },
      // throwOnError: import.meta.env.DEV,
    },
  },
})
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: QUERY_PERSIST_KEY,
})

declare module "@tanstack/react-query" {
  interface Meta {
    queryMeta: { persist?: boolean }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Register extends Meta {}
}

export const persistConfig: OmitKeyof<
  PersistQueryClientOptions,
  "queryClient"
> = {
  persister: localStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      if (!query.meta?.persist) return false
      const queryIsReadyForPersistance = query.state.status === "success"
      if (queryIsReadyForPersistance) {
        return (
          !((query.state?.data as any)?.pages?.length > 1) &&
          query.queryKey?.[0] !== "check-eagle"
        )
      } else {
        return false
      }
    },
  },
}

export { queryClient }
