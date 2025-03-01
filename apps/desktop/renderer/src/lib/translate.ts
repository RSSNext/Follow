import { parseHtml } from "@follow/components/ui/markdown/parse-html.js"
import { views } from "@follow/constants"
import type { SupportedLanguages } from "@follow/models/types"
import { franc } from "franc-min"

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
    label: "Traditional Chinese (Taiwan)",
    code: "cmn",
  },
}

export const checkLanguage = ({
  content,
  language,
}: {
  content: string
  language: SupportedLanguages
}) => {
  if (!content) return true
  const pureContent = parseHtml(content)
    .toText()
    .replaceAll(/https?:\/\/\S+|www\.\S+/g, " ")
  const sourceLanguage = franc(pureContent, {
    only: [LanguageMap[language].code],
  })
  if (sourceLanguage === LanguageMap[language].code) {
    return true
  } else {
    return false
  }
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
  let fields = language && view !== undefined ? views[view!]!.translation.split(",") : []
  if (extraFields) {
    fields = [...fields, ...extraFields]
  }

  fields = fields.filter((field) => {
    if (language && entry.entries[field]) {
      const isLanguageMatch = checkLanguage({
        content: entry.entries[field],
        language,
      })
      return !isLanguageMatch
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
