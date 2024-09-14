const langs = ["en", "ja", "zh-CN", "ar-dz", "ar-sa", "ar-ma"]
export const currentSupportedLanguages = langs.sort()
export const dayjsLocaleImportMap = {
  en: ["en", () => import("dayjs/locale/en")],
  ["zh-CN"]: ["zh-cn", () => import("dayjs/locale/zh-cn")],
  ["ja"]: ["ja", () => import("dayjs/locale/ja")],
  ["ar-dz"]: ["ar-dz", () => import("dayjs/locale/ar-dz")],
  ["ar-sa"]: ["ar-sa", () => import("dayjs/locale/ar-sa")],
  ["ar-ma"]: ["ar-ma", () => import("dayjs/locale/ar-ma")],
}
export const ns = ["app", "common", "lang", "settings", "shortcuts"] as const
export const defaultNS = "app" as const
