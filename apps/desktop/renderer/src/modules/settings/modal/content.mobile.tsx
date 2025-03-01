import PKG from "@pkg"
import { createElement, Suspense } from "react"
import { Trans, useTranslation } from "react-i18next"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"

import { getSettingPages } from "../settings-glob"
import { SettingsTitle } from "../title"
import { SettingTabProvider } from "./context"
import { SidebarItems } from "./layout"

export const MobileSettingModalContent = () => {
  const { t } = useTranslation()
  const { present } = useModalStack()
  return (
    <SettingTabProvider>
      <div className="relative pb-safe">
        <div className="flex flex-col">
          <div className="mb-4 flex items-center gap-2 px-3.5 text-xl font-semibold">
            {t("user_button.preferences")}
          </div>

          <SidebarItems
            onChange={(tab) => {
              present({
                title: "",
                content: () => <Content tab={tab} />,
              })
            }}
          />
        </div>
      </div>
    </SettingTabProvider>
  )
}

const Content = (props: { tab: string }) => {
  const { tab } = props
  const { Component, loader } = getSettingPages()[tab]

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsTitle loader={loader} className="relative -mt-6 mb-0 text-xl font-semibold" />
      {createElement(Component)}

      <p className="mt-4 flex items-center justify-center gap-1 text-xs opacity-80 pb-safe">
        <Trans
          ns="settings"
          i18nKey="common.give_star"
          components={{
            Link: <a href={`${PKG.repository.url}`} className="text-accent" target="_blank" />,
            HeartIcon: <i className="i-mgc-heart-cute-fi" />,
          }}
        />
      </p>
    </Suspense>
  )
}
