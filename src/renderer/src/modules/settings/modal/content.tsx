import { MotionButtonBase } from "@renderer/components/ui/button"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { SettingsTitle } from "@renderer/modules/settings/title"
import type { FC } from "react"

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
}> = ({ initialTab }) => (
  <SettingTabProvider>
    <SettingModalLayout
      initialTab={initialTab ? initialTab in pages ? initialTab : undefined : undefined}
    >
      <ScrollArea.ScrollArea
        scrollbarClassName="mt-12 mb-2"
        rootClassName="h-full flex-1 shrink-0 overflow-auto pl-8 pr-7 pb-8"
        viewportClassName="pr-1"
      >
        <Content />
        <Close />
      </ScrollArea.ScrollArea>
    </SettingModalLayout>
  </SettingTabProvider>
)

const Close = () => {
  const { dismiss } = useCurrentModal()

  return (
    <MotionButtonBase className="absolute right-8 top-7 z-[99]" onClick={dismiss}>
      <i className="i-mgc-close-cute-re" />
    </MotionButtonBase>
  )
}

const Content = () => {
  const key = useSettingTab() || "general"
  const { Component, loader } = pages[key]

  if (!Component) return null

  return (
    <>
      <SettingsTitle loader={loader} />
      <Component />

    </>
  )
}
