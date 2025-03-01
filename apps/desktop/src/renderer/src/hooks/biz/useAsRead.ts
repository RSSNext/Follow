import { useRouteParamsSelector } from "./useRouteParams"

export function useAsRead<T extends { read: Nullable<boolean> }>(entry?: T) {
  return useRouteParamsSelector(
    (params) => {
      if (params.isCollection) {
        return true
      }
      if (!entry) return false
      return entry.read
    },
    [entry?.read],
  )
}
