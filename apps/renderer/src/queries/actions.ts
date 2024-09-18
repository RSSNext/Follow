import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"

export const action = {
  getAll: () =>
    defineQuery(["actions"], async () => {
      const res = await apiClient.actions.$get()
      return res.data
    }),
}
