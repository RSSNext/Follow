import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import type { SupportedLanguages } from "@renderer/models"

export const ai = {
  translation: ({
    id,
    language,
    fields,
  }: {
    id: string
    language?: SupportedLanguages
    fields: string
  }) =>
    defineQuery(["translation", id, language], async () => {
      if (!language) {
        return null
      }
      const res = await apiClient.ai.translation.$get({
        query: {
          id,
          language: language as SupportedLanguages,
          fields,
        },
      })
      return res.data
    }),
}
