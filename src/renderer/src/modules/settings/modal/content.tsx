import { MotionButtonBase } from "@renderer/components/ui/button"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { preventDefault } from "@renderer/lib/dom"
import {
  SettingsSidebarTitle,
  SettingsTitle,
} from "@renderer/modules/settings/title"
import { createContextState } from "foxact/context-state"
import { m } from "framer-motion"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { createElement, useEffect, useState } from "react"

import { settings } from "../constants"

const [SettingTabProvider, useSettingTab, useSetSettingTab] =
  createContextState("")

const pages = (() => {
  const map = import.meta.glob("@renderer/pages/settings/*.tsx")
  const pages = {}
  for (const key in map) {
    const filename = key.split("/").pop()
    if (!filename) continue
    const settingKey = filename.split(".").slice(0, -1).join(".")
    pages[settingKey] = map[key]
  }
  return pages
})()

function Layout(props: PropsWithChildren) {
  const { children } = props
  const setTab = useSetSettingTab()
  const tab = useSettingTab()

  useEffect(() => {
    if (!tab) setTab(settings[0].path)
  }, [])
  return (
    <m.div
      exit={{
        opacity: 0,
        scale: 0.96,
      }}
      className="flex h-[500px] max-h-[80vh] w-[660px] max-w-full flex-col overflow-hidden rounded-xl border border-border"
      onContextMenu={preventDefault}
    >
      <div className="flex h-0 flex-1 bg-theme-tooltip-background">
        <div className="w-44 border-r px-2 py-6">
          {settings.map((t) => (
            <button
              key={t.path}
              className={`my-1 flex w-full items-center rounded-lg px-2.5 py-0.5 leading-loose text-theme-foreground/70 transition-colors ${
                tab === t.path ?
                  "bg-theme-item-active text-theme-foreground/90" :
                  ""
              }`}
              type="button"
              onClick={() => setTab(t.path)}
            >
              <SettingsSidebarTitle
                path={t.path}
                className="text-[15px] font-medium"
              />
            </button>
          ))}
        </div>
        <div className="relative h-full flex-1 bg-theme-background p-8">
          {children}
        </div>
      </div>
    </m.div>
  )
}

export const SettingModalContent = () => (
  <SettingTabProvider>
    <Layout>
      <div className="h-full flex-1 shrink-0 overflow-auto">
        <Content />
        <Close />
      </div>
    </Layout>
  </SettingTabProvider>
)

const Close = () => {
  const { dismiss } = useCurrentModal()

  return (
    <MotionButtonBase className="absolute right-8 top-8" onClick={dismiss}>
      <i className="i-mgc-close-cute-re" />
    </MotionButtonBase>
  )
}

const Content = () => {
  const key = useSettingTab()
  const Component = pages[key]

  if (!Component) return null

  return <LoadRemixAsyncComponent loader={Component} />
}

const LoadRemixAsyncComponent: FC<{
  loader: () => Promise<any>
}> = ({ loader }) => {
  const [loading, setLoading] = useState(true)

  const [Component, setComponent] = useState<{ c: () => ReactNode }>({
    c: () => null,
  })

  useEffect(() => {
    setLoading(true)
    loader()
      .then((module) => {
        if (!module.Component) {
          return
        }

        const { loader } = module
        setComponent({
          c: () => (
            <>
              <SettingsTitle loader={loader} />
              <module.Component />
            </>
          ),
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }, [loader])

  if (loading) {
    return (
      <div className="center h-full">
        <LoadingCircle size="large" />
      </div>
    )
  }

  return createElement(Component.c)
}
