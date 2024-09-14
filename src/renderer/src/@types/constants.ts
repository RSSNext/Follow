const langs = ["en", "ja", "zh-CN", "pt", "ru"]
export const currentSupportedLanguages = langs.sort()
export const dayjsLocaleImportMap = {
  en: ["en", () => import("dayjs/locale/en")],
  ["zh-CN"]: ["zh-cn", () => import("dayjs/locale/zh-cn")],
  ["ja"]: ["ja", () => import("dayjs/locale/ja")],
  ["ru"]: ["ru", () => import("dayjs/locale/ru")],
  ["pt"]: ["pt", () => import("dayjs/locale/pt")],
}
export const ns = ["app", "common", "lang", "settings", "shortcuts"] as const
export const defaultNS = "app" as const
