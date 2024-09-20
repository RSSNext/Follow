import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"

export const action = {
  getAll: () =>
    defineQuery(["actions"], async () => {
      const res = await apiClient.actions.$get()
      return res.data
    }),
}
