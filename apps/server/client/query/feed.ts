import { apiClient } from "@client/lib/api-fetch"
import { useQuery } from "@tanstack/react-query"

export const useFeed = ({ id }: { id: string }) =>
  useQuery({
    queryKey: ["feed", id],
    queryFn: async () => {
      const res = await apiClient.feeds.$get({
        query: {
          id,
        },
      })
      return res.data
    },
  })
