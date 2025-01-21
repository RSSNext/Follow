import { useQuery } from "@tanstack/react-query"

import { userSyncService, useUserStore } from "./store"

export const whoamiQueryKey = ["user", "whoami"]

export const usePrefetchSessionUser = () => {
  useQuery({
    queryKey: whoamiQueryKey,
    queryFn: () => userSyncService.whoami(),
  })
}

export const useWhoami = () => {
  return useUserStore((state) => state.whoami)
}
