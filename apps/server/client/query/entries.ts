import { apiClient } from "@client/lib/api-fetch"
import { useQuery } from "@tanstack/react-query"

const fetchEntriesPreview = async ({ id }: { id?: string }) => {
  const res = await apiClient.entries.preview.$get({
    query: {
      id: id!,
    },
  })

  return res.data
}
export const useEntriesPreview = ({ id }: { id?: string }) =>
  useQuery({
    queryKey: ["entries-preview", id],
    queryFn: () => fetchEntriesPreview({ id }),
    enabled: !!id,
  })

export type EntriesPreview = Awaited<ReturnType<typeof fetchEntriesPreview>>
