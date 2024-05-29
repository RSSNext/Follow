import type { EntriesResponse, ListResponse } from "@renderer/lib/types"
import { Queries } from "@renderer/queries"
import type { Response as SubscriptionsResponse } from "@renderer/queries/subscriptions"
import type { InfiniteData, QueryKey } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"

export const useUpdateEntry = ({
  entryId,
  feedId,
}: {
  entryId?: string
  feedId?: string
}) => {
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
      const assertData = data as InfiniteData<ListResponse<EntriesResponse>>
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

    if (changed.read !== undefined) {
      const entriesData = queryClient.getQueriesData({
        queryKey: ["subscriptions"],
      })
      entriesData.forEach(([key, data]: [QueryKey, unknown]) => {
        const chage = changed.read ? -1 : 1
        const assertData = data as SubscriptionsResponse
        const finaldata = produce(assertData, (assertData) => {
          for (const list of assertData.list) {
            for (const item of list.list) {
              if (item.feeds.id === feedId) {
                assertData.unread += chage
                list.unread += chage
                item.unread = (item.unread || 0) + chage
              }
            }
          }
        })
        queryClient.setQueryData<typeof assertData>(key, finaldata)
      })
    }
  }

  return updateEntry
}
