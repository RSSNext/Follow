const langs = ["en", "ja", "zh-CN", "zh-TW"]
export const currentSupportedLanguages = langs.sort()
export const dayjsLocaleImportMap = {
  en: ["en", () => import("dayjs/locale/en")],
  ["zh-CN"]: ["zh-cn", () => import("dayjs/locale/zh-cn")],
  ["ja"]: ["ja", () => import("dayjs/locale/ja")],
  ["zh-TW"]: ["zh-TW", () => import("dayjs/locale/zh-TW")],
}
export const ns = ["app", "common", "lang", "settings", "shortcuts"] as const
export const defaultNS = "app" as const
