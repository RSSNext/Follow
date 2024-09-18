import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { useAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useLayoutEffect, useRef } from "react"
import { I18nextProvider } from "react-i18next"

import { currentSupportedLanguages } from "~/@types/constants"
import { getGeneralSettings, setGeneralSetting } from "~/atoms/settings/general"
import { IS_MANUAL_CHANGE_LANGUAGE_KEY } from "~/constants"
import { i18nAtom } from "~/i18n"
import { EventBus } from "~/lib/event-bus"
import { loadLanguageAndApply } from "~/lib/load-language"

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
    const i18next = currentI18NInstance

    i18next.on("languageChanged", loadLanguageAndApply)

    return () => {
      i18next.off("languageChanged")
    }
  }, [currentI18NInstance])

  useLayoutEffect(() => {
    if (localStorage.getItem(IS_MANUAL_CHANGE_LANGUAGE_KEY)) return
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
    if (callOnce.current) return
    const { language } = getGeneralSettings()

    i18next.changeLanguage(language)
    callOnce.current = true
  }, [])

  return <I18nextProvider i18n={currentI18NInstance}>{children}</I18nextProvider>
}
