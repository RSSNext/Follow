import type { Models } from "@follow/models"
import camelcaseKeys from "camelcase-keys"

import { apiFetch } from "~/lib/api-fetch"

const v1ApiPrefix = "/v1"
export const getTrendingAggregates = async () => {
  const data = await apiFetch<Models.TrendingAggregates>(`${v1ApiPrefix}/trendings`)
  return camelcaseKeys(data as any, { deep: true }) as Models.TrendingAggregates
}
