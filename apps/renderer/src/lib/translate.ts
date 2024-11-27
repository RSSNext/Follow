import { views } from "@follow/constants"
import type { SupportedLanguages } from "@follow/models/types"

import type { FlatEntryModel } from "~/store/entry"

import { apiClient } from "./api-fetch"

export const LanguageMap: Record<
  SupportedLanguages,
  {
    label: string
    value: string
    code: string
  }
> = {
  en: {
    value: "en",
    label: "English",
    code: "eng",
  },
  ja: {
    value: "ja",
    label: "Japanese",
    code: "jpn",
  },
  "zh-CN": {
    value: "zh-CN",
    label: "Simplified Chinese",
    code: "cmn",
  },
  "zh-TW": {
    value: "zh-TW",
    label: "Traditional Chinese(Taiwan)",
    code: "cmn",
  },
}
export async function translate({
  entry,
  view,
  language,
  extraFields,
  part,
}: {
  entry: FlatEntryModel
  view?: number
  language?: SupportedLanguages
  extraFields?: string[]
  part?: string
}) {
  if (!language) {
    return null
  }
  let fields = language && view !== undefined ? views[view!].translation.split(",") : []
  if (extraFields) {
    fields = [...fields, ...extraFields]
  }
  const { franc } = await import("franc-min")

  fields = fields.filter((field) => {
    if (language && entry.entries[field]) {
      const sourceLanguage = franc(entry.entries[field])

      if (sourceLanguage === LanguageMap[language].code) {
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
        part,
      },
    })
    return res.data
  } else {
    return null
  }
}
