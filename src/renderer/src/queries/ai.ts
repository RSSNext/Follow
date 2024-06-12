import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"

export const ai = {
  translation: ({
    id,
    language,
    fields,
  }: {
    id: string
    language?: string
    fields: string
  }) =>
    defineQuery(["translation", id, language], async () => {
      if (!language) {
        return null
      }
      const res = await apiClient.ai.translation.$get({
        query: {
          id,
          language: language as "en" | "ja" | "zh-CN" | "zh-TW",
          fields,
        },
      })
      return res.data
    }),
}
