import { repository } from "@pkg"
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
      className="absolute right-8 top-7 z-[99]"
      onClick={dismiss}
    >
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
      <SettingsTitle loader={loader} className="relative mb-0 px-8" />
      <Close />
      <ScrollArea.ScrollArea
        rootClassName="h-full grow flex-1 shrink-0 overflow-auto pl-8 pr-7 pb-8"
        viewportClassName="pr-1"
      >
        <Component />
        <p className="mt-12 flex items-center justify-center gap-1 text-xs opacity-80">
          <i className="i-mgc-heart-cute-fi" />
          {" "}
          {/* 喜欢我们的产品？在 GitHub 给添加星标 并 分享您宝贵的建议 ! */}
          Love our product?
          {" "}
          <a href={`${repository.url}`} className="text-theme-accent" target="_blank">
            Give us a star on GitHub
          </a>
          !
        </p>
      </ScrollArea.ScrollArea>
    </>
  )
}
