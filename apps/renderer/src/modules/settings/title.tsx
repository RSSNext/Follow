import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"

import { cn } from "~/lib/utils"

import { settings } from "./constants"
import type { SettingPageConfig } from "./utils"

export const SettingsSidebarTitle = ({ path, className }: { path: string; className?: string }) => {
  const { t } = useTranslation("settings")
  const tab = settings.find((t) => t.path === path)

  if (!tab) {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2 text-[0.94rem] font-medium", className)}>
      <i className={`${tab.iconName} text-[19px]`} />
      <span>{t(tab.name as any)}</span>
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
  const { t } = useTranslation("settings")
  const {
    iconName,
    name: title,
    headerIcon,
  } = (useLoaderData() || loader?.() || {}) as SettingPageConfig

  if (!title) {
    return null
  }
  return (
    <div
      className={cn(
        "flex items-center gap-2 pb-2 pt-6 text-xl font-bold",
        "sticky top-0 mb-4 bg-background",
        className,
      )}
    >
      <i className={headerIcon || iconName} />
      <span>{t(title as any)}</span>
    </div>
  )
}
