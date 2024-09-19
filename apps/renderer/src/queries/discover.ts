import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"

export const discover = {
  rsshubCategory: ({ category }: { category: string }) =>
    defineQuery(["discover", "rsshub", "category", category], async () => {
      const res = await apiClient.discover.rsshub.$get({
        query: {
          category,
        },
      })
      return res.data
    }),
  rsshubNamespace: ({ namespace }: { namespace: string }) =>
    defineQuery(["discover", "rsshub", "namespace", namespace], async () => {
      const res = await apiClient.discover.rsshub.$get({
        query: {
          namespace,
        },
      })
      return res.data
    }),
}
