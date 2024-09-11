import { getGeneralSettings } from "@renderer/atoms/settings/general"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import en from "../../../locales/en.json"
import zhCN from "../../../locales/zh_CN.json"

const { language } = getGeneralSettings()

i18next.use(initReactI18next).init({
  lng: language,
  fallbackLng: "en",
  resources: {
    en: {
      translation: en,
    },
    zh: {
      translation: zhCN,
    },
  },
})
