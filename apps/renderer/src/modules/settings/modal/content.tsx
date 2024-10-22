import { ScrollArea } from "@follow/components/ui/scroll-area/index.js"
import { repository } from "@pkg"
import i18next from "i18next"
import type { FC } from "react"
import { Suspense, useDeferredValue, useEffect, useLayoutEffect, useState } from "react"
import { Trans } from "react-i18next"

import { ModalClose } from "~/components/ui/modal/stacked/components"
import { SettingsTitle } from "~/modules/settings/title"

import { settings } from "../constants"
import { SettingTabProvider, useSettingTab } from "./context"
import { SettingModalLayout } from "./layout"

const pages = (() => {
  const pages = {}
  for (const setting of settings) {
    const filename = setting.path

    pages[filename] = {
      Component: setting.Component,
      loader: setting.loader,
    }
  }
  return pages
})()
export const SettingModalContent: FC<{
  initialTab?: string
}> = ({ initialTab }) => {
  useEffect(() => {
    // load i18n
    i18next.loadNamespaces("settings")
  }, [])
  return (
    <SettingTabProvider>
      <SettingModalLayout
        initialTab={initialTab ? (initialTab in pages ? initialTab : undefined) : undefined}
      >
        <Content />
      </SettingModalLayout>
    </SettingTabProvider>
  )
}

const Content = () => {
  const key = useDeferredValue(useSettingTab() || "general")
  const { Component, loader } = pages[key]

  const [scroller, setScroller] = useState<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (scroller) {
      scroller.scrollTop = 0
    }
  }, [key])

  if (!Component) return null

  return (
    <Suspense>
      <SettingsTitle loader={loader} className="relative mb-0 px-8" />
      <ModalClose />
      <ScrollArea.ScrollArea
        mask={false}
        ref={setScroller}
        rootClassName="h-full grow flex-1 shrink-0 overflow-auto pl-8 pr-7"
        viewportClassName="px-1 min-h-full [&>div]:min-h-full [&>div]:relative pb-8"
      >
        <Component />

        <div className="h-12" />
        <p className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 text-xs opacity-80">
          <Trans
            ns="settings"
            i18nKey="common.give_star"
            components={{
              Link: <a href={`${repository.url}`} className="text-accent" target="_blank" />,
              HeartIcon: <i className="i-mgc-heart-cute-fi" />,
            }}
          />
        </p>
      </ScrollArea.ScrollArea>
    </Suspense>
  )
}
