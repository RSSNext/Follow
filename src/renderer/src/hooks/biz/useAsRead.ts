import type { CombinedEntryModel } from "@renderer/models"

import { useRouteParamsSelector } from "./useRouteParams"

export function useAsRead(entry?: CombinedEntryModel) {
  return useRouteParamsSelector((params) => {
    if (params.isCollection) {
      return true
    }
    if (!entry) return false
    return entry.read
  }, [entry?.read])
}
