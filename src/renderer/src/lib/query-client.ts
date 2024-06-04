import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      refetchInterval: 1000 * 60 * 10,
      throwOnError: import.meta.env.DEV,
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
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
})

export { queryClient }
