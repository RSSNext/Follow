import { apiClient } from "~/lib/api-fetch"
import { defineQuery } from "~/lib/defineQuery"

export const lists = {
  list: () =>
    defineQuery(
      ["lists"],
      async () => {
        const res = await apiClient.lists.list.$get()
        return res.data
      },
      {
        rootKey: ["lists"],
      },
    ),
}
