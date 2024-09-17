const langs = [
  "en",
  "ja",
  "zh-CN",
  "zh-TW",
  "pt",
  "fr",
  "ar-DZ",
  "ar-SA",
  "ar-MA",
  "ar-iq",
  "ar-kw",
  "ar-tn",
]
export const currentSupportedLanguages = langs.sort()
export const dayjsLocaleImportMap = {
  en: ["en", () => import("dayjs/locale/en")],
  ["zh-CN"]: ["zh-cn", () => import("dayjs/locale/zh-cn")],
  ["ja"]: ["ja", () => import("dayjs/locale/ja")],
  ["ar-DZ"]: ["ar-dz", () => import("dayjs/locale/ar-dz")],
  ["ar-SA"]: ["ar-sa", () => import("dayjs/locale/ar-sa")],
  ["ar-MA"]: ["ar-ma", () => import("dayjs/locale/ar-ma")],
  ["es"]: ["es", () => import("dayjs/locale/es")],
  ["fr"]: ["fr", () => import("dayjs/locale/fr")],
  ["pt"]: ["pt", () => import("dayjs/locale/pt")],
  ["zh-TW"]: ["zh-tw", () => import("dayjs/locale/zh-tw")],
  ["ar-IQ"]: ["ar-iq", () => import("dayjs/locale/ar-iq")],
  ["ar-KW"]: ["ar-kw", () => import("dayjs/locale/ar-kw")],
  ["ar-TN"]: ["ar-tn", () => import("dayjs/locale/ar-tn")],
}
export const ns = ["app", "common", "lang", "settings", "shortcuts"] as const
export const defaultNS = "app" as const
