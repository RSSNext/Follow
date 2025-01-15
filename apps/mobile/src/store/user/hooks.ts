import { useQuery } from "@tanstack/react-query"

import { userSyncService, useUserStore } from "./store"

export const usePrefetchSessionUser = () => {
  useQuery({
    queryKey: ["user", "whoami"],
    queryFn: () => userSyncService.whoami(),
  })
}

export const useWhoami = () => {
  return useUserStore((state) => state.whoami)
}
