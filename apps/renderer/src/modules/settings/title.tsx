import { EllipsisHorizontalTextWithTooltip } from "@follow/components/ui/typography/index.js"
import { cn } from "@follow/utils/utils"
import { Slot } from "@radix-ui/react-slot"
import { useContext } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router"

import { IsInSettingIndependentWindowContext } from "./context"
import { getMemoizedSettings } from "./settings-glob"
import type { SettingPageConfig } from "./utils"

export const SettingsSidebarTitle = ({ path, className }: { path: string; className?: string }) => {
  const { t } = useTranslation("settings")
  const tab = getMemoizedSettings().find((t) => t.path === path)

  if (!tab) {
    return null
  }

  return (
    <div className={cn("flex min-w-0 items-center gap-2 text-[0.94rem] font-medium", className)}>
      {typeof tab.icon === "string" ? (
        <i className={`${tab.icon} shrink-0 text-[19px]`} />
      ) : (
        <Slot className="shrink-0 text-[19px]">{tab.icon}</Slot>
      )}
      <EllipsisHorizontalTextWithTooltip>{t(tab.name as any)}</EllipsisHorizontalTextWithTooltip>
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
    icon: iconName,
    name: title,
    headerIcon,
  } = (useLoaderData() || loader || {}) as SettingPageConfig

  const usedIcon = headerIcon || iconName
  const isInSettingIndependentWindow = useContext(IsInSettingIndependentWindowContext)
  if (!title) {
    return null
  }
  return (
    <div
      className={cn(
        "flex items-center gap-2 pb-2 pt-6 text-xl font-bold",
        "sticky top-0 mb-4",
        isInSettingIndependentWindow ? "z-[99] bg-background" : "",
        className,
      )}
    >
      {typeof usedIcon === "string" ? <i className={usedIcon} /> : usedIcon}
      <span>{t(title as any)}</span>
    </div>
  )
}
