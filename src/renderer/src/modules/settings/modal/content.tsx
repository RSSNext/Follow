import { repository } from "@pkg"
import { MotionButtonBase } from "@renderer/components/ui/button"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { SettingsTitle } from "@renderer/modules/settings/title"
import type { FC } from "react"
import { Suspense, useDeferredValue, useLayoutEffect, useState } from "react"

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
      initialTab={
        initialTab ? (initialTab in pages ? initialTab : undefined) : undefined
      }
    >
      <Content />
    </SettingModalLayout>
  </SettingTabProvider>
)

const Close = () => {
  const { dismiss } = useCurrentModal()

  return (
    <MotionButtonBase
      className="absolute right-8 top-8 z-[99]"
      onClick={dismiss}
    >
      <i className="i-mgc-close-cute-re" />
    </MotionButtonBase>
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
      <Close />
      <ScrollArea.ScrollArea
        mask={false}
        ref={setScroller}
        rootClassName="h-full grow flex-1 shrink-0 overflow-auto pl-8 pr-7"
        viewportClassName="pr-1 min-h-full [&>div]:min-h-full [&>div]:relative pb-8"
      >
        <Component />

        <div className="h-12" />
        <p className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 text-xs opacity-80">
          <i className="i-mgc-heart-cute-fi" />
          {" "}
          Love our product?
          {" "}
          <a
            href={`${repository.url}`}
            className="text-accent"
            target="_blank"
          >
            Give us a star on GitHub
          </a>
          !
        </p>
      </ScrollArea.ScrollArea>
    </Suspense>
  )
}
