import { useInfiniteQuery } from "@tanstack/react-query"
import { levels } from "@renderer/lib/constants"
import { EntriesResponse, ListResponse } from "./types"

export const useEntries = ({
  level,
  id,
}: {
  level?: string
  id?: number | string
}) =>
  useInfiniteQuery({
    queryKey: ["entries", level, id],
    enabled: level !== undefined && id !== undefined,
    queryFn: async ({ pageParam }) => {
      let entries: ListResponse<EntriesResponse> | null = null
      if (level === levels.folder) {
        entries = await (
          await fetch(
            `${import.meta.env.VITE_ELECTRON_REMOTE_API_URL}/entries?` +
              new URLSearchParams({
                offset: pageParam + "",
                category: id + "",
              }),
            {
              credentials: "include",
            },
          )
        ).json()
      } else if (level === levels.view) {
        entries = await (
          await fetch(
            `${import.meta.env.VITE_ELECTRON_REMOTE_API_URL}/entries?` +
              new URLSearchParams({
                offset: pageParam + "",
                view: id + "",
              }),
            {
              credentials: "include",
            },
          )
        ).json()
      }

      if (!entries) {
        entries = {
          code: -1,
        }
      }

      return entries
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPageParam + (lastPage.data?.length || 0),
    initialPageParam: 0,
  })
