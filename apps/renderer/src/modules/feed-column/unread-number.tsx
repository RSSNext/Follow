import { cn } from "@follow/utils/utils"

import { useUISettingKey } from "~/atoms/settings/ui"

export const UnreadNumber = ({
  unread,
  className,
  isList,
}: {
  unread: number
  className?: string
  isList?: boolean
}) => {
  const showUnreadCount = useUISettingKey("sidebarShowUnreadCount")

  if (!unread) return null
  return (
    <div
      className={cn(
        "center text-[0.65rem] tabular-nums text-zinc-400 dark:text-neutral-500",
        className,
      )}
    >
      {isList || !showUnreadCount ? <i className="i-mgc-round-cute-fi text-[0.3rem]" /> : unread}
    </div>
  )
}
