import { useQuery } from "@tanstack/react-query"

import { userSyncService } from "./store"

export const usePrefetchSessionUser = () => {
  useQuery({
    queryKey: ["user", "whoami"],
    queryFn: () => userSyncService.whoami(),
  })
}
