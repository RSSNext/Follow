import { LoadRemixAsyncComponent } from "@renderer/components/common/LoadRemixAsyncComponent"
import { MotionButtonBase } from "@renderer/components/ui/button"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { SettingsTitle } from "@renderer/modules/settings/title"

import { SettingTabProvider, useSettingTab } from "./context"
import { SettingModalLayout } from "./layout"

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
export const SettingModalContent = () => (
  <SettingTabProvider>
    <SettingModalLayout>
      <ScrollArea.ScrollArea
        scrollbarClassName="mt-12 mb-2"
        rootClassName="h-full flex-1 shrink-0 overflow-auto pl-8 pr-7"
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
    <MotionButtonBase className="absolute right-8 top-7" onClick={dismiss}>
      <i className="i-mgc-close-cute-re" />
    </MotionButtonBase>
  )
}

const Content = () => {
  const key = useSettingTab()
  const Component = pages[key]

  if (!Component) return null

  return <LoadRemixAsyncComponent Header={SettingsTitle} loader={Component} />
}
