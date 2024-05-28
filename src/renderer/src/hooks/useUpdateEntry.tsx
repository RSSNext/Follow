import type { TimelineResponse, ListResponse } from "@renderer/lib/types"
import { Queries } from "@renderer/queries"
import type { InfiniteData, QueryKey } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"

export const useUpdateEntry = ({ entryId }: { entryId?: string }) => {
  const queryClient = useQueryClient()

  const updateEntry = (changed: Partial<TimelineResponse[number]>) => {
    const query = Queries.entries.byId(entryId)

    query.setData((draft) => {
      if (!draft) return
      Object.assign(draft, changed)
    })

    const entriesData = queryClient.getQueriesData({
      queryKey: ["entries"],
    })
    entriesData.forEach(([key, data]: [QueryKey, unknown]) => {
      const assertData = data as InfiniteData<ListResponse<TimelineResponse>>
      const finaldata = produce(assertData, (assertData) => {
        const list = assertData?.pages?.[0]?.data
        if (list) {
          for (const item of list) {
            if (item.entries.id === entryId) {
              for (const [key, value] of Object.entries(changed)) {
                item[key] = value
              }
            }
          }
        }
      })
      queryClient.setQueryData<typeof assertData>(key, finaldata)
    })
  }

  return updateEntry
}
