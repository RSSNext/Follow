import { EventBus } from "@follow/utils/event-bus"
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { useAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useLayoutEffect } from "react"
import { I18nextProvider } from "react-i18next"

import { currentSupportedLanguages } from "~/@types/constants"
import { getGeneralSettings, setGeneralSetting } from "~/atoms/settings/general"
import { I18N_LOCALE_KEY } from "~/constants"
import { i18nAtom } from "~/i18n"

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
    const languageDetector = new LanguageDetector(null, {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupLocalStorage: I18N_LOCALE_KEY,
      caches: ["localStorage"],
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
