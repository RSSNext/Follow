import { apiClient } from "@renderer/lib/api-fetch"
import { views } from "@renderer/lib/constants"
import { defineQuery } from "@renderer/lib/defineQuery"
import type { CombinedEntryModel, SupportedLanguages } from "@renderer/models"
import { franc } from "franc-min"

const LanguageMap: Record<
  SupportedLanguages,
  {
    code: string
  }
> = {
  "en": {
    code: "eng",
  },
  "ja": {
    code: "jpn",
  },
  "zh-CN": {
    code: "cmn",
  },
  "zh-TW": {
    code: "cmn",
  },
}

export const ai = {
  translation: ({
    entry,
    view,
    language,
    extraFields,
  }: {
    entry: CombinedEntryModel
    view?: number
    language?: SupportedLanguages
    extraFields?: string[]
  }) =>
    defineQuery(["translation", entry?.entries?.id, language], async () => {
      if (!language) {
        return null
      }
      let fields =
        entry.settings?.translation && view !== undefined ?
          views[view!].translation.split(",") :
            []
      if (extraFields) {
        fields = [...fields, ...extraFields]
      }

      fields = fields.filter((field) => {
        if (entry.settings?.translation && entry.entries[field]) {
          const sourceLanguage = franc(entry.entries[field])

          if (sourceLanguage === LanguageMap[entry.settings?.translation].code) {
            return false
          } else {
            return true
          }
        } else {
          return false
        }
      })

      if (fields.length > 0) {
        const res = await apiClient.ai.translation.$get({
          query: {
            id: entry.entries.id,
            language,
            fields: fields?.join(",") || "title",
          },
        })
        return res.data
      } else {
        return null
      }
    }),
  summary: ({
    entryId,
    language,
  }: {
    entryId: string
    language?: SupportedLanguages
  }) =>
    defineQuery(["summary", entryId, language], async () => {
      const res = await apiClient.ai.summary.$get({
        query: {
          id: entryId,
          language,
        },
      })
      return res.data
    }),
}
