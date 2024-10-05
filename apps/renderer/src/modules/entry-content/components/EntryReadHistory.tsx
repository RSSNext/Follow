import {
  HoverCard,
  HoverCardContent,
  HoverCardPortal,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card"
import clsx from "clsx"
import { m } from "framer-motion"
import { memo } from "react"
import { useTranslation } from "react-i18next"

import { useWhoami } from "~/atoms/user"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from "~/components/ui/tooltip"
import { EllipsisHorizontalTextWithTooltip } from "~/components/ui/typography"
import { useAuthQuery } from "~/hooks/common"
import { useAppLayoutGridContainerWidth } from "~/providers/app-grid-layout-container-provider"
import { Queries } from "~/queries"
import { useEntryReadHistory } from "~/store/entry"
import { useUserById } from "~/store/user"

import { usePresentUserProfileModal } from "../../profile/hooks"

export const EntryReadHistory: Component<{ entryId: string }> = ({ entryId }) => {
  const me = useWhoami()
  const entryHistory = useEntryReadHistory(entryId)

  const { data } = useAuthQuery(Queries.entries.entryReadingHistory(entryId), {
    refetchInterval: 1000 * 60,
  })
  const totalCount = data?.total || 0

  const appGirdContainerWidth = useAppLayoutGridContainerWidth()

  const LIMIT = appGirdContainerWidth > 600 ? 10 : 5

  if (!entryHistory) return null
  if (!me) return null
  if (!entryHistory.userIds) return null

  return (
    <div className="hidden items-center duration-200 animate-in fade-in @md:flex">
      {entryHistory.userIds
        .filter((id) => id !== me?.id)
        .slice(0, LIMIT)

        .map((userId, i) => (
          <EntryUser userId={userId} i={i} key={userId} />
        ))}

      {!!totalCount && totalCount > LIMIT && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <button
              type="button"
              style={{
                right: `${LIMIT * 8}px`,
                zIndex: 11,
              }}
              className="no-drag-region relative flex size-7 items-center justify-center rounded-full border border-border bg-muted ring-2 ring-background"
            >
              <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
                +{Math.min(totalCount - LIMIT, 99)}
              </span>
            </button>
          </HoverCardTrigger>

          {totalCount > LIMIT && (
            <HoverCardPortal>
              <HoverCardContent
                sideOffset={12}
                align="start"
                side="right"
                className={clsx(
                  "z-10 rounded-md border bg-background drop-shadow",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                  "data-[state=closed]:slide-out-to-left-5 data-[state=open]:slide-in-from-left-5",
                  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                  "transition-all duration-200 ease-in-out",
                )}
              >
                <ScrollArea.ScrollArea
                  rootClassName="max-h-[300px] max-w-[20ch] flex flex-col"
                  flex
                >
                  <ul>
                    {entryHistory.userIds
                      .filter((id) => id !== me?.id)
                      .slice(LIMIT)
                      .map((userId) => (
                        <EntryUserRow userId={userId} key={userId} />
                      ))}
                  </ul>
                </ScrollArea.ScrollArea>
              </HoverCardContent>
            </HoverCardPortal>
          )}
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
    <li
      onClick={() => presentUserProfile(userId)}
      role="button"
      tabIndex={0}
      className="relative flex min-w-0 max-w-[50ch] shrink-0 cursor-button items-center gap-2 truncate rounded-md p-1 px-2 hover:bg-muted"
    >
      <Avatar className="block aspect-square size-7 overflow-hidden rounded-full border border-border ring-1 ring-background">
        <AvatarImage src={user?.image || undefined} />
        <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
      </Avatar>

      {user.name && (
        <EllipsisHorizontalTextWithTooltip className="pr-8 text-xs font-medium">
          <span>{user.name}</span>
        </EllipsisHorizontalTextWithTooltip>
      )}
    </li>
  )
})

const EntryUser: Component<{
  userId: string
  i: number
}> = memo(({ userId, i }) => {
  const user = useUserById(userId)
  const { t } = useTranslation()
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
            <AvatarImage src={user?.image || undefined} className="bg-theme-placeholder-image" />
            <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </m.button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="top">
          {t("entry_actions.recent_reader")} {user.name}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
})
