import { cn } from "@follow/utils/utils"

import { useUISettingKey } from "~/atoms/settings/ui"

export const UnreadNumber = ({ unread, className }: { unread: number; className?: string }) => {
  const showUnreadCount = useUISettingKey("sidebarShowUnreadCount")

  if (!unread) return null
  return (
    <div
      className={cn(
        "center text-[0.65rem] tabular-nums text-zinc-400 dark:text-neutral-500",
        className,
      )}
    >
      {!showUnreadCount ? <i className="i-mgc-round-cute-fi text-[0.3rem]" /> : unread}
    </div>
  )
}
