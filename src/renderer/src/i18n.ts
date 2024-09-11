import { getGeneralSettings } from "@renderer/atoms/settings/general"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import resources from "./@types/resources"

export const defaultNS = "translation"

export const fallbackLanguage = "en"
export const initI18n = () => {
  const { language } = getGeneralSettings()

  i18next.use(initReactI18next).init({
    lng: language,
    fallbackLng: fallbackLanguage,
    defaultNS,
    ns: [defaultNS],

    resources,
  })
}

export const currentSupportedLanguages = Object.keys(resources)
export const languageCodeToName = Object.fromEntries(
  currentSupportedLanguages.map((lang) => [lang, resources[lang].lang["name"]]),
)
