import { useUISettingKey } from "~/atoms/settings/ui"
import { cn } from "~/lib/utils"

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
  if (!showUnreadCount) return null
  if (!unread) return null
  return (
    <div
      className={cn("text-[0.65rem] tabular-nums text-zinc-400 dark:text-neutral-500", className)}
    >
      {isList ? (
        <i className="block size-1.5 rounded-full bg-zinc-400 dark:bg-neutral-500" />
      ) : (
        unread
      )}
    </div>
  )
}
