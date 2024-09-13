import { EventBus } from "@renderer/lib/event-bus"
import dayjs from "dayjs"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { atom } from "jotai"
import { initReactI18next } from "react-i18next"

import { defaultResources } from "./@types/default-resource"
import { jotaiStore } from "./lib/jotai"

export const i18nAtom = atom(i18next)

export const defaultNS = "app"

export const fallbackLanguage = "en"
export const initI18n = async () => {
  const i18next = jotaiStore.get(i18nAtom)
  await i18next.use(initReactI18next).init({
    ns: ["app", "common", "lang", "settings"],
    lng: "en",
    fallbackLng: fallbackLanguage,
    defaultNS,
    debug: import.meta.env.DEV,

    resources: defaultResources,
  })
}

if (import.meta.hot) {
  import.meta.hot.on(
    "i18n-update",
    async ({ file, content }: { file: string; content: string }) => {
      const resources = JSON.parse(content)
      const i18next = jotaiStore.get(i18nAtom)
      // `file` is absolute path e.g. /Users/innei/git/follow/locales/en.json
      // Absolute path e.g. /Users/innei/git/follow/locales/<module-name>/en.json

      // 1. parse root language
      if (!file.includes("locales/namespaces")) {
        const lang = file.split("/").pop()?.replace(".json", "")
        if (!lang) return
        i18next.addResourceBundle(lang, defaultNS, resources, true, true)
        i18next.reloadResources(lang, defaultNS)
      } else {
        const nsName = file.match(/locales\/namespaces\/(.+?)\//)?.[1]

        if (!nsName) return
        const lang = file.split("/").pop()?.replace(".json", "")
        if (!lang) return
        i18next.addResourceBundle(lang, nsName, resources, true, true)
        await i18next.reloadResources(lang, nsName)
      }

      import.meta.env.DEV && EventBus.dispatch("I18N_UPDATE", "")
    },
  )
}

declare module "@renderer/lib/event-bus" {
  interface CustomEvent {
    I18N_UPDATE: string
  }
}

export { currentSupportedLanguages } from "./@types/constants"

window["i18next"] = i18next
