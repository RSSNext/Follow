import {
  currentSupportedLanguages,
  dayjsLocaleImportMap,
} from "@renderer/@types/constants"
import { defaultResources } from "@renderer/@types/default-resource"
import { getGeneralSettings, setGeneralSetting } from "@renderer/atoms/settings/general"
import { fallbackLanguage, i18nAtom, LocaleCache } from "@renderer/i18n"
import { EventBus } from "@renderer/lib/event-bus"
import { jotaiStore } from "@renderer/lib/jotai"
import { isEmptyObject } from "@renderer/lib/utils"
import dayjs from "dayjs"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { useAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useLayoutEffect, useRef } from "react"
import { I18nextProvider } from "react-i18next"
import { toast } from "sonner"

const loadingLangLock = new Set<string>()
const loadedLangs = new Set<string>([fallbackLanguage])

const langChangedHandler = async (lang: string) => {
  const dayjsImport = dayjsLocaleImportMap[lang]

  if (dayjsImport) {
    const [locale, loader] = dayjsImport
    loader().then(() => {
      dayjs.locale(locale)
    })
  }

  const { t } = jotaiStore.get(i18nAtom)
  if (loadingLangLock.has(lang)) return
  const isSupport = currentSupportedLanguages.includes(lang)
  if (!isSupport) {
    return
  }
  const loaded = loadedLangs.has(lang)

  if (loaded) {
    return
  }

  loadingLangLock.add(lang)

  if (import.meta.env.DEV) {
    const nsGlobbyMap = import.meta.glob("@locales/*/*.json")

    const namespaces = Object.keys(defaultResources.en)

    const res = await Promise.allSettled(
      namespaces.map(async (ns) => {
        const loader = nsGlobbyMap[`../../locales/${ns}/${lang}.json`]

        if (!loader) return
        const nsResources = await loader().then((m: any) => m.default)

        i18next.addResourceBundle(lang, ns, nsResources, true, true)
      }),
    )

    for (const r of res) {
      if (r.status === "rejected") {
        toast.error(`${t("common:tips.load-lng-error")}: ${lang}`)
        loadingLangLock.delete(lang)

        return
      }
    }
  } else {
    const res = await eval(`import('/locales/${lang}.js')`)
      .then((res: any) => res?.default || res)
      .catch(() => {
        toast.error(`${t("common:tips.load-lng-error")}: ${lang}`)
        loadingLangLock.delete(lang)
        return {}
      })

    if (isEmptyObject(res)) {
      return
    }
    for (const namespace in res) {
      i18next.addResourceBundle(lang, namespace, res[namespace], true, true)
    }
  }

  await i18next.reloadResources()
  await i18next.changeLanguage(lang)
  LocaleCache.shared.set(lang)
  loadedLangs.add(lang)
  loadingLangLock.delete(lang)
}
export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentI18NInstance, update] = useAtom(i18nAtom)

  if (import.meta.env.DEV)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(
      () =>
        EventBus.subscribe("I18N_UPDATE", () => {
          const lang = getGeneralSettings().language
          const nextI18n = i18next.cloneInstance({
            lng: lang,
          })
          update(nextI18n)
        }),
      [update],
    )

  const callOnce = useRef(false)
  const detectOnce = useRef(false)
  useLayoutEffect(() => {
    if (detectOnce.current) return
    const languageDetector = new LanguageDetector()
    const userLang = languageDetector.detect()
    if (!userLang) return
    const firstUserLang = Array.isArray(userLang) ? userLang[0] : userLang
    if (currentSupportedLanguages.includes(firstUserLang)) {
      setGeneralSetting("language", firstUserLang)
    }
    detectOnce.current = true
  }, [])

  useLayoutEffect(() => {
    const i18next = currentI18NInstance

    i18next.on("languageChanged", langChangedHandler)

    return () => {
      i18next.off("languageChanged")
    }
  }, [currentI18NInstance])

  useLayoutEffect(() => {
    if (callOnce.current) return
    const { language } = getGeneralSettings()

    i18next.changeLanguage(language)
    callOnce.current = true
  }, [])

  return <I18nextProvider i18n={currentI18NInstance}>{children}</I18nextProvider>
}
