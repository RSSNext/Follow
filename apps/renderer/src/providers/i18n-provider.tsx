import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { useAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useLayoutEffect } from "react"
import { I18nextProvider } from "react-i18next"

import { currentSupportedLanguages } from "~/@types/constants"
import { getGeneralSettings, setGeneralSetting } from "~/atoms/settings/general"
import { i18nAtom, langChain } from "~/i18n"
import { EventBus } from "~/lib/event-bus"
import { loadLanguageAndApply } from "~/lib/load-language"
import { appLog } from "~/lib/log"

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

  useLayoutEffect(() => {
    const i18next = currentI18NInstance

    const handler = (lang: string) => {
      if (i18next.language === lang) return
      loadLanguageAndApply(lang).then(() => {
        langChain.next(() => {
          appLog("change language to", lang)
          return i18next.changeLanguage(lang)
        })
      })
    }
    i18next.on("languageChanged", handler)

    return () => {
      i18next.off("languageChanged")
    }
  }, [currentI18NInstance])

  useLayoutEffect(() => {
    const languageDetector = new LanguageDetector(null, {
      order: ["navigator", "htmlTag"],
    })
    const userLang = languageDetector.detect()
    if (!userLang) return
    const firstUserLang = Array.isArray(userLang) ? userLang[0] : userLang
    if (currentSupportedLanguages.includes(firstUserLang)) {
      setGeneralSetting("language", firstUserLang)
    }
  }, [])

  return <I18nextProvider i18n={currentI18NInstance}>{children}</I18nextProvider>
}
