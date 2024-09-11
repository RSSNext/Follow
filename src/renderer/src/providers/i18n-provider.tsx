import { EventBus } from "@renderer/lib/event-bus"
import i18next from "i18next"
import type { FC, PropsWithChildren } from "react"
import { useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentI18NInstance, update] = useState(i18next)

  useEffect(
    () =>
      EventBus.subscribe("I18N_UPDATE", () => {
        update(i18next.cloneInstance())
      }),
    [],
  )
  return <I18nextProvider i18n={currentI18NInstance}>{children}</I18nextProvider>
}
