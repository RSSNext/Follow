import type { EntriesResponse, ListResponse } from "@renderer/lib/types"
import { Queries } from "@renderer/queries"
import type { InfiniteData, QueryKey } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"

export const useUpdateEntry = ({ entryId }: { entryId?: string }) => {
  const queryClient = useQueryClient()

  const updateEntry = (changed: Partial<EntriesResponse[number]>) => {
    const query = Queries.entries.byId(entryId)

    query.setData((draft) => {
      if (!draft) return
      Object.assign(draft, changed)
    })

    const entriesData = queryClient.getQueriesData({
      queryKey: ["entries"],
    })
    entriesData.forEach(([key, data]: [QueryKey, unknown]) => {
      const list = (data as InfiniteData<ListResponse<EntriesResponse>>)
        ?.pages?.[0]?.data
      if (list) {
        for (const item of list) {
          if (item.id === entryId) {
            for (const [key, value] of Object.entries(changed)) {
              item[key] = value
            }
            queryClient.setQueryData(key, data)
          }
        }
      }
    })
  }

  return updateEntry
}
