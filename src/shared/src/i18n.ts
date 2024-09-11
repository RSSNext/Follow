import { getGeneralSettings } from "@renderer/atoms/settings/general"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import en from "../../../locales/en.json"
import zhCN from "../../../locales/zh_CN.json"

const resources = {
  en: {
    translation: en,
    name: "English",
  },
  zh_CN: {
    translation: zhCN,
    name: "简体中文 (部分完成)",
  },
}

export const fallbackLanguage = "en"
export const initI18n = () => {
  const { language } = getGeneralSettings()

  i18next.use(initReactI18next).init({
    lng: language,
    fallbackLng: fallbackLanguage,
    resources,
  })
}

export const currentSupportedLanguages = Object.keys(resources)
export const languageCodeToName = Object.fromEntries(
  currentSupportedLanguages.map((lang) => [lang, resources[lang].name]),
)
