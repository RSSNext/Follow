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
    code?: string
  }
> = {
  "ar-DZ": {
    label: "Arabic (Algeria)",
    value: "ar-DZ",
  },
  "ar-IQ": {
    label: "Arabic (Iraq)",
    value: "ar-IQ",
  },
  "ar-KW": {
    label: "Arabic (Kuwait)",
    value: "ar-KW",
  },
  "ar-MA": {
    label: "Arabic (Morocco)",
    value: "ar-MA",
  },
  "ar-SA": {
    label: "Arabic (Saudi Arabia)",
    value: "ar-SA",
  },
  "ar-TN": {
    label: "Arabic (Tunisia)",
    value: "ar-TN",
  },
  de: {
    label: "German",
    value: "de",
    code: "deu",
  },
  en: {
    label: "English",
    value: "en",
    code: "eng",
  },
  es: {
    label: "Spanish",
    value: "es",
    code: "spa",
  },
  fi: {
    label: "Finnish",
    value: "fi",
    code: "fin",
  },
  fr: {
    label: "French",
    value: "fr",
    code: "fra",
  },
  it: {
    label: "Italian",
    value: "it",
    code: "ita",
  },
  ja: {
    label: "Japanese",
    value: "ja",
    code: "jpn",
  },
  ko: {
    label: "Korean",
    value: "ko",
    code: "kor",
  },
  pt: {
    label: "Portuguese",
    value: "pt",
    code: "por",
  },
  ru: {
    label: "Russian",
    value: "ru",
    code: "rus",
  },
  tr: {
    label: "Turkish",
    value: "tr",
    code: "tur",
  },
  "zh-CN": {
    label: "Simplified Chinese",
    value: "zh-CN",
    code: "cmn",
  },
  "zh-HK": {
    label: "Traditional Chinese (Hong Kong)",
    value: "zh-HK",
  },
  "zh-TW": {
    label: "Traditional Chinese (Taiwan)",
    value: "zh-TW",
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
  const { code } = LanguageMap[language]
  if (!code) return false
  const sourceLanguage = franc(pureContent, {
    only: [code],
  })
  if (sourceLanguage === code) {
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
