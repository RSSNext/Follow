
import { getGeneralSettings } from "@renderer/atoms/settings/general"
import { EventBus } from "@renderer/lib/event-bus"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import resources from "./@types/resources"

export const defaultNS = "translation"

export const fallbackLanguage = "en"
export const initI18n = async () => {
  const { language } = getGeneralSettings()

  await i18next.use(initReactI18next).init({
    lng: language,
    fallbackLng: fallbackLanguage,
    defaultNS,
    ns: [defaultNS],
    debug: true,
    resources,

    backend: [],
  })
}

export const currentSupportedLanguages = Object.keys(resources)
export const languageCodeToName = Object.fromEntries(
  currentSupportedLanguages.map((lang) => [lang, resources[lang].lang["name"]]),
)
if (import.meta.hot) {
  import.meta.hot.on("i18n-update", ({ file, content }: { file: string; content: string }) => {
    const resources = JSON.parse(content)

    // `file` is absolute path e.g. /Users/innei/git/follow/locales/en.json
    // Absolute path e.g. /Users/innei/git/follow/locales/modules/<module-name>/en.json

    // 1. parse root language
    if (!file.includes("locales/modules")) {
      const lang = file.split("/").pop()?.replace(".json", "")
      if (!lang) return
      i18next.addResourceBundle(lang, defaultNS, resources, true, true)
      i18next.reloadResources(lang, defaultNS)
    } else {
      const nsName = file.match(/locales\/modules\/(.+?)\//)?.[1]

      if (!nsName) return
      const lang = file.split("/").pop()?.replace(".json", "")
      if (!lang) return
      i18next.addResourceBundle(lang, nsName, resources, true, true)
      i18next.reloadResources(lang, nsName)
    }

    EventBus.dispatch("I18N_UPDATE", "")
  })
}

declare module "@renderer/lib/event-bus" {
  interface CustomEvent {
    I18N_UPDATE: string
  }
}

window["i18n"] = i18next.t("lang:name")
