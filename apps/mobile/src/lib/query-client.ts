import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"
import { QueryClient } from "@tanstack/react-query"
import { persistQueryClient } from "@tanstack/react-query-persist-client"

import { kv } from "./kv"

export const queryClient = new QueryClient()

export const kvStoragePersister = createSyncStoragePersister({
  storage: {
    getItem: (key: string) => kv.getSync(key),
    setItem: (key: string, value: string) => kv.setSync(key, value),
    removeItem: (key: string) => kv.delete(key),
  },
})

persistQueryClient({
  queryClient,
  persister: kvStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery(query) {
      return query.queryKey.includes("cache")
    },
    shouldDehydrateMutation() {
      return false
    },
  },
  maxAge: 1000 * 60 * 60 * 24 * 1,
})
