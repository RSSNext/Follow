import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import en from "../../../locales/en.json"
import zhCN from "../../../locales/zh_CN.json"

i18next.use(initReactI18next).init({
  lng: "zh",
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
