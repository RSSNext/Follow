import type { CombinedEntryModel } from "@renderer/models"

import { useRouteParamsSelector } from "./useRouteParams"

export function useAsRead(entry?: CombinedEntryModel) {
  return useRouteParamsSelector(() => {
    if (!entry) return false
    return entry.read
  }, [entry?.read])
}
