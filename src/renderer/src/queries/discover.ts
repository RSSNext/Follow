import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"

export const discover = {
  rsshubCategory: ({
    category,
  }: {
    category: string
  }) =>
    defineQuery(["discover", "rsshub", category], async () => {
      const res = await apiClient.discover.rsshub.$get({
        query: {
          category,
        },
      })
      return res.data
    }),
}
