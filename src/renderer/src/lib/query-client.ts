import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: Infinity,
      refetchInterval: 1000 * 60 * 10,
    },
  },
})

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
})

export { queryClient }
