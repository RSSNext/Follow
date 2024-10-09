import camelcaseKeys from "camelcase-keys"

import { apiFetch } from "~/lib/api-fetch"
import type { Models } from "~/models"

const v1ApiPrefix = "/v1"
export const getTrendingAggregates = () => {
  return apiFetch<Models.TrendingAggregates>(`${v1ApiPrefix}/trendings`).then((data) =>
    camelcaseKeys(data as any, { deep: true }),
  )
}
