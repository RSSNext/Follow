import { levels } from "@renderer/lib/constants"
import type { DataResponse, EntriesResponse, ListResponse } from "@renderer/lib/types"
import { apiFetch } from "@renderer/queries/api-fetch"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

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
        view?: number
        feedId?: string
        feedIdList?: string[]
      } = {}
      if (level === levels.folder) {
        params.feedIdList = (`${id}`).split(",")
      } else if (level === levels.feed) {
        params.feedId = `${id}`
      }
      return await apiFetch<ListResponse<EntriesResponse>>("/entries", {
        method: "POST",
        body: {
          offset: pageParam,
          view,
          ...params,
        },
      })
    },
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPageParam + (lastPage.data?.length || 0),
    initialPageParam: 0,
  })

export const useEntry = ({ id }: { id?: string | null }) =>
  useQuery({
    queryKey: ["entry", id],
    enabled: !!id,
    queryFn: async () => {
      const data = await apiFetch<DataResponse<EntriesResponse[number]>>(
        "/entries",
        {
          query: {
            id,
          },
        },
      )
      return data.data
    },
  })
