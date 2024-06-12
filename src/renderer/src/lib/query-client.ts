import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { FetchError } from "ofetch"

import { QUERY_PERSIST_KEY } from "./constants"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      refetchInterval: 1000 * 60 * 10,
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
export const persistConfig = {
  persister: localStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      const queryIsReadyForPersistance = query.state.status === "success"
      if (queryIsReadyForPersistance) {
        return !((query.state?.data as any)?.pages?.length > 1)
      } else {
        return false
      }
    },
  },
}

export { queryClient }
