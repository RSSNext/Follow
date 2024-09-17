import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import { resources } from "../@types/resources"

export const defaultNS = "native"

export const i18n = i18next.createInstance()

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  defaultNS,
  resources,
})

export const { t } = i18n
