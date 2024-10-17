import { apiClient } from "@client/lib/api-fetch"
import { useQuery } from "@tanstack/react-query"

export const useEntriesPreview = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: ["entries-preview", id],
    queryFn: async () => {
      const res = await apiClient.entries.preview.$get({
        query: {
          id: id!,
        },
      })

      return res.data
    },
    enabled: !!id,
  })
