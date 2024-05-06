import { useInfiniteQuery } from "@tanstack/react-query"
import { levels } from "@renderer/lib/constants"
import { EntriesResponse, ListResponse } from "../types"

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
      const baseUrl = `${import.meta.env.VITE_ELECTRON_REMOTE_API_URL}/entries?`
      const params: {
        category?: string
        view?: string
        feedId?: string
      } = {}
      if (level === levels.folder) {
        params.category = id + ""
      } else if (level === levels.view) {
        params.view = id + ""
      } else if (level === levels.feed) {
        params.feedId = id + ""
      }
      entries = await (
        await fetch(
          baseUrl +
            new URLSearchParams({
              offset: pageParam + "",
              ...params,
            }),
          {
            credentials: "include",
          },
        )
      ).json()

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
