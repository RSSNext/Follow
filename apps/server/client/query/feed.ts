import { apiClient } from "@client/lib/api-fetch"
import { getHydrateData } from "@client/lib/helper"
import { useQuery } from "@tanstack/react-query"

async function fetchFeedById(id: string) {
  const res = await apiClient.feeds.$get({
    query: {
      id,
    },
  })
  return res.data
}
export const useFeed = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["feed", id],
    queryFn: () => fetchFeedById(id),
    initialData: getHydrateData(`feeds.$get,query:id=${id}`) as any as Awaited<
      ReturnType<typeof fetchFeedById>
    >,
  })

export type Feed = Awaited<ReturnType<typeof fetchFeedById>>
