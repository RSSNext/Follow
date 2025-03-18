import type { languageSchema } from "@follow/shared/src/hono"
import type { z } from "zod"

export type SupportedLanguages = z.infer<typeof languageSchema>
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
