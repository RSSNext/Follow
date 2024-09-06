import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"

export const settings = {
  get: () =>
    defineQuery(["settings"], async () => await apiClient.settings.$get({ query: {} })),
}
