import { useInfiniteQuery } from "@tanstack/react-query"
import { levels } from "@renderer/lib/constants"
import { EntriesResponse, ListResponse } from "../types"
import { apiFetch } from "@renderer/lib/queries/api-fetch"

export const useEntries = ({
  level,
  id,
  view,
}: {
  level?: string
  id?: number | string
  view?: number
}) =>
  useInfiniteQuery({
    queryKey: ["entries", level, id],
    enabled: level !== undefined && id !== undefined,
    queryFn: async ({ pageParam }) => {
      const params: {
        category?: string
        view?: string
        feedId?: string
      } = {}
      if (level === levels.folder) {
        params.category = id + ""
      } else if (level === levels.feed) {
        params.feedId = id + ""
      }
      return await apiFetch<ListResponse<EntriesResponse>>("/entries", {
        query: {
          offset: pageParam + "",
          view,
          ...params,
        },
      })
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPageParam + (lastPage.data?.length || 0),
    initialPageParam: 0,
  })
