import { settingTabs } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"

export const SettingsTitle = ({
  path,
  className,
}: {
  path: string
  className?: string
}) => {
  const tab = settingTabs.find((t) => t.path === path)

  if (!tab) {
    return null
  }

  return (
    <div className={cn("flex items-center gap-2 text-xl font-bold", className)}>
      <i className={tab.className} />
      <span>{tab.name}</span>
    </div>
  )
}
