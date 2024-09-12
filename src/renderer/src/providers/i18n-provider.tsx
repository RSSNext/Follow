import { defaultResources } from "@renderer/@types/default-resource"
import { getGeneralSettings } from "@renderer/atoms/settings/general"
import { currentSupportedLanguages, defaultNS, i18nAtom } from "@renderer/i18n"
import { nextFrame } from "@renderer/lib/dom"
import { EventBus } from "@renderer/lib/event-bus"
import { jotaiStore } from "@renderer/lib/jotai"
import i18next from "i18next"
import { useAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useLayoutEffect, useRef } from "react"
import { I18nextProvider } from "react-i18next"
import { toast } from "sonner"

const loadingLangLock = new Set<string>()

const langChangedHandler = async (lang: string) => {
  const { t } = jotaiStore.get(i18nAtom)
  if (loadingLangLock.has(lang)) return
  const isSupport = currentSupportedLanguages.includes(lang)
  if (!isSupport) {
    return
  }
  const loaded = i18next.getResourceBundle(lang, defaultNS)

  if (loaded) {
    return
  }

  loadingLangLock.add(lang)

  const nsGlobbyMap = import.meta.glob("@locales/*/*.json")

  // const rootGlobbyMap = import.meta.glob("@locales/*.json")
  // const rootResources = await rootGlobbyMap[`../../locales/${lang}.json`]()
  //   .then((m: any) => m.default)
  //   .catch(() => {
  //     toast.error(`${t("common:tips.load-lng-error")}: ${lang}`)
  //   })
  // i18next.addResourceBundle(lang, defaultNS, rootResources, true, true)

  const namespaces = Object.keys(defaultResources.en)

  const res = await Promise.allSettled(
    namespaces.map(async (ns) => {
      // if (ns === defaultNS) return

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

  await i18next.reloadResources()
  await i18next.changeLanguage(lang)
  loadingLangLock.delete(lang)
}

langChangedHandler(getGeneralSettings().language)
export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentI18NInstance, update] = useAtom(i18nAtom)

  if (import.meta.env.DEV)
    // eslint-disable-next-line react-compiler/react-compiler, react-hooks/rules-of-hooks
    useEffect(
      () =>
        EventBus.subscribe("I18N_UPDATE", () => {
          nextFrame(() => {
            update(i18next.cloneInstance())
          })
        }),
      [update],
    )

  const callOnce = useRef(false)

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
