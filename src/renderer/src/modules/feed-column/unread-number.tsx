import { useUISettingKey } from "@renderer/atoms/settings/ui"
import { cn } from "@renderer/lib/utils"

export const UnreadNumber = ({
  unread,
  className,
}: {
  unread: number
  className?: string
}) => {
  const showUnreadCount = useUISettingKey("sidebarShowUnreadCount")
  return !!showUnreadCount && !!unread && (
    <div className={cn("text-[0.65rem] tabular-nums text-zinc-400 dark:text-neutral-500", className)}>
      {unread}
    </div>
  )
}
