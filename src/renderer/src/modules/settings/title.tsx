import { cn } from "@renderer/lib/utils"
import { useLoaderData } from "react-router-dom"

import { settings } from "./constants"
import type { SettingPageConfig } from "./utils"

export const SettingsSidebarTitle = ({
  path,
  className,
}: {
  path: string
  className?: string
}) => {
  const tab = settings.find((t) => t.path === path)

  if (!tab) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-[0.94rem] font-medium",
        className,
      )}
    >
      <i className={tab.iconName} />
      <span>{tab.name}</span>
    </div>
  )
}

export const SettingsTitle = ({
  className,
  loader,
}: {
  className?: string
  loader?: () => SettingPageConfig
}) => {
  const { iconName, name: title } = (useLoaderData() ||
    loader?.() ||
    {}) as SettingPageConfig

  if (!title) {
    return null
  }
  return (
    <div
      className={cn(
        "flex items-center gap-2 pb-2 pt-6 text-xl font-bold",
        "sticky top-0 z-[11] mb-4 bg-background",
        className,
      )}
    >
      <i className={iconName} />
      <span>{title}</span>
    </div>
  )
}
