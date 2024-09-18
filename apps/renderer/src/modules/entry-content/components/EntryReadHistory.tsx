import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card"
import clsx from "clsx"
import { LayoutGroup, m } from "framer-motion"
import { memo, useEffect, useState } from "react"

import { useWhoami } from "~/atoms/user"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"
import { useEntryReadHistory } from "~/store/entry"
import { useUserById } from "~/store/user"

import { usePresentUserProfileModal } from "../../profile/hooks"

export const EntryReadHistory: Component<{ entryId: string }> = ({ entryId }) => {
  const me = useWhoami()
  const entryHistory = useEntryReadHistory(entryId)

  const [isEnabledPolling, setIsEnabledPolling] = useState(false)
  useAuthQuery(Queries.entries.entryReadingHistory(entryId), {
    refetchInterval: 1000 * 60,
    enabled: isEnabledPolling,
  })
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEnabledPolling(true)
    }, 1000 * 60)

    return () => {
      clearTimeout(timer)
    }
  }, [entryId])

  if (!entryHistory) return null
  if (!me) return null
  if (!entryHistory.userIds) return null

  return (
    <div className="hidden items-center duration-200 animate-in fade-in @md:flex">
      <LayoutGroup>
        {entryHistory.userIds
          .filter((id) => id !== me?.id)
          .slice(0, 10)

          .map((userId, i) => (
            <EntryUser userId={userId} i={i} key={userId} />
          ))}
      </LayoutGroup>

      {entryHistory.readCount &&
        entryHistory.readCount > 10 &&
        entryHistory.userIds &&
        entryHistory.userIds.length >= 10 && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <button
                type="button"
                style={{
                  right: "80px",
                  zIndex: 11,
                }}
                className="no-drag-region relative flex size-7 items-center justify-center rounded-full border border-border bg-muted ring ring-background"
              >
                <span className="text-[10px] font-medium text-muted-foreground">
                  +{Math.min(entryHistory.readCount - 10, 99)}
                </span>
              </button>
            </HoverCardTrigger>

            <HoverCardPortal>
              <HoverCardContent
                sideOffset={12}
                align="start"
                side="right"
                asChild
                className={clsx(
                  "flex max-h-[300px] flex-col overflow-y-auto rounded-md border bg-background drop-shadow",
                  // Animation, fade up
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-3",
                )}
              >
                <ul>
                  {entryHistory.userIds
                    .filter((id) => id !== me?.id)
                    .slice(10)
                    .map((userId) => (
                      <EntryUserRow userId={userId} key={userId} />
                    ))}
                </ul>
              </HoverCardContent>
            </HoverCardPortal>
          </HoverCard>
        )}
    </div>
  )
}

const EntryUserRow: Component<{ userId: string }> = memo(({ userId }) => {
  const user = useUserById(userId)
  const presentUserProfile = usePresentUserProfileModal("drawer")
  if (!user) return null

  return (
    <li className="relative flex min-w-0 max-w-[50ch] rounded-md p-1 hover:bg-muted">
      <button
        type="button"
        className="flex min-w-0 items-center gap-2 truncate"
        onClick={() => {
          presentUserProfile(userId)
        }}
      >
        <Avatar className="aspect-square size-7 overflow-hidden rounded-full border border-border ring-1 ring-background">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
        </Avatar>

        {user.name && <p className="truncate pr-8 text-xs font-medium">{user.name}</p>}
      </button>
    </li>
  )
})

const EntryUser: Component<{
  userId: string
  i: number
}> = memo(({ userId, i }) => {
  const user = useUserById(userId)
  const presentUserProfile = usePresentUserProfileModal("drawer")
  if (!user) return null
  return (
    <Tooltip>
      <TooltipTrigger
        className="no-drag-region relative cursor-pointer"
        style={{
          right: `${i * 8}px`,
          zIndex: i,
        }}
        asChild
      >
        <m.button
          layout="position"
          layoutId={userId}
          type="button"
          onClick={() => {
            presentUserProfile(userId)
          }}
        >
          <Avatar className="aspect-square size-7 border border-border ring-1 ring-background">
            <AvatarImage src={user?.image || undefined} />
            <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </m.button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="top">Recent reader: {user.name}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
})
