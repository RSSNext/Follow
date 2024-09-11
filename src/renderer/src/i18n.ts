import { getGeneralSettings } from "@renderer/atoms/settings/general"
import { EventBus } from "@renderer/lib/event-bus"
import i18next from "i18next"
import { initReactI18next } from "react-i18next"

import { currentSupportedLanguages } from "./@types/constants"
import { defaultResources } from "./@types/default-resource"

export const defaultNS = "translation"

const loadingLangLock = new Set<string>()
export const fallbackLanguage = "en"
export const initI18n = async () => {
  await i18next.use(initReactI18next).init({
    lng: "en",
    fallbackLng: fallbackLanguage,
    defaultNS,
    debug: import.meta.env.DEV,
    resources: defaultResources,
  })

  i18next.on("languageChanged", async (lang) => {
    if (loadingLangLock.has(lang)) return
    const isSupport = currentSupportedLanguages.find((l) => lang === l.code)
    if (!isSupport) {
      return
    }
    const loaded = i18next.getResourceBundle(lang, defaultNS)

    if (loaded) return

    loadingLangLock.add(lang)

    const rootGlobbyMap = import.meta.glob("../../../locales/*.json")
    const nsGlobbyMap = import.meta.glob("../../../locales/namespaces/*/*.json")

    const rootResources = await rootGlobbyMap[`../../../locales/${lang}.json`]().then(
      (m: any) => m.default,
    )

    i18next.addResourceBundle(lang, defaultNS, rootResources, true, true)

    const namespaces = Object.keys(defaultResources.en)

    await Promise.all(
      namespaces.map(async (ns) => {
        if (ns === defaultNS) return

        const loader = nsGlobbyMap[`../../../locales/namespaces/${ns}/${lang}.json`]

        if (!loader) return
        const nsResources = await loader().then((m: any) => m.default)

        i18next.addResourceBundle(lang, ns, nsResources, true, true)
      }),
    )

    await i18next.reloadResources()
    await i18next.changeLanguage(lang)
    loadingLangLock.delete(lang)
    EventBus.dispatch("I18N_UPDATE", "")
  })

  const { language } = getGeneralSettings()

  i18next.changeLanguage(language)
}

if (import.meta.hot) {
  import.meta.hot.on("i18n-update", ({ file, content }: { file: string; content: string }) => {
    const resources = JSON.parse(content)

    // `file` is absolute path e.g. /Users/innei/git/follow/locales/en.json
    // Absolute path e.g. /Users/innei/git/follow/locales/namespaces/<module-name>/en.json

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
      i18next.reloadResources(lang, nsName)
    }

    import.meta.env.DEV && EventBus.dispatch("I18N_UPDATE", "")
  })
}

declare module "@renderer/lib/event-bus" {
  interface CustomEvent {
    I18N_UPDATE: string
  }
}

export { currentSupportedLanguages } from "./@types/constants"

window["i18next"] = i18next
