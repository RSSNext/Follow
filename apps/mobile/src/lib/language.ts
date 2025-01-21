import type { languageSchema } from "@follow/shared/src/hono"
import type { z } from "zod"

export type SupportedLanguages = z.infer<typeof languageSchema>
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
