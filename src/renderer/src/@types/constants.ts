const langs = ["en", "ja", "zh-CN", "fr"]
export const currentSupportedLanguages = langs.sort()
export const dayjsLocaleImportMap = {
  en: ["en", () => import("dayjs/locale/en")],
  ["zh-CN"]: ["zh-cn", () => import("dayjs/locale/zh-cn")],
  ["ja"]: ["ja", () => import("dayjs/locale/ja")],
  ["fr"]: ["fr", () => import("dayjs/locale/fr")],
}
export const ns = ["app", "common", "lang", "settings", "shortcuts"] as const
export const defaultNS = "app" as const
