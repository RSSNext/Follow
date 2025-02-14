import { useDroppable } from "@dnd-kit/core"
import { ActionButton } from "@follow/components/ui/button/index.js"
import type { FeedViewType } from "@follow/constants"
import { views } from "@follow/constants"
import { nextFrame } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import type { FC } from "react"
import { startTransition, useCallback } from "react"
import { useTranslation } from "react-i18next"

import { useShowContextMenu } from "~/atoms/context-menu"
import { getMainContainerElement } from "~/atoms/dom"
import { useUISettingKey } from "~/atoms/settings/ui"
import {
  ROUTE_TIMELINE_OF_INBOX,
  ROUTE_TIMELINE_OF_LIST,
  ROUTE_TIMELINE_OF_VIEW,
} from "~/constants"
import { useListActions } from "~/hooks/biz/useFeedActions"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useContextMenu } from "~/hooks/common"
import { useInboxById } from "~/store/inbox"
import { useListById } from "~/store/list"
import { subscriptionActions } from "~/store/subscription"
import { useFeedUnreadStore } from "~/store/unread"
import { useUnreadByView } from "~/store/unread/hooks"

import { FeedIcon } from "../feed/feed-icon"
import { resetSelectedFeedIds } from "./atom"

export function TimelineSwitchButton({ timelineId }: { timelineId: string }) {
  const activeTimelineId = useRouteParamsSelector((s) => s.timelineId)
  const isActive = activeTimelineId === timelineId
  const navigate = useNavigateEntry()
  const setActive = useCallback(() => {
    navigate({
      timelineId,
      feedId: null,
      entryId: null,
    })
    resetSelectedFeedIds()
  }, [navigate, timelineId])

  if (timelineId.startsWith(ROUTE_TIMELINE_OF_VIEW)) {
    const id = Number.parseInt(timelineId.slice(ROUTE_TIMELINE_OF_VIEW.length), 10) as FeedViewType
    return <ViewSwitchButton view={id} isActive={isActive} setActive={setActive} />
  } else if (timelineId.startsWith(ROUTE_TIMELINE_OF_LIST)) {
    const id = timelineId.slice(ROUTE_TIMELINE_OF_LIST.length)
    return <ListSwitchButton listId={id} isActive={isActive} setActive={setActive} />
  } else if (timelineId.startsWith(ROUTE_TIMELINE_OF_INBOX)) {
    const id = timelineId.slice(ROUTE_TIMELINE_OF_INBOX.length)
    return <InboxSwitchButton inboxId={id} isActive={isActive} setActive={setActive} />
  }
}

const ViewSwitchButton: FC<{
  view: FeedViewType
  isActive: boolean
  setActive: () => void
}> = ({ view, isActive, setActive }) => {
  const unreadByView = useUnreadByView()
  const { t } = useTranslation()
  const showSidebarUnreadCount = useUISettingKey("sidebarShowUnreadCount")
  const item = views.find((item) => item.view === view)!

  const { isOver, setNodeRef } = useDroppable({
    id: `view-${item.name}`,
    data: {
      category: "",
      view: item.view,
    },
  })

  return (
    <ActionButton
      ref={setNodeRef}
      key={item.name}
      tooltip={t(item.name as any)}
      shortcut={`${view + 1}`}
      className={cn(
        isActive && item.className,
        "flex h-11 shrink-0 flex-col items-center gap-1 text-[1.375rem]",
        ELECTRON ? "hover:!bg-theme-item-hover" : "",
        isOver && "border-theme-accent-400 bg-theme-accent-400/60",
      )}
      size="lg"
      onClick={(e) => {
        startTransition(() => {
          setActive()
        })
        e.stopPropagation()
      }}
    >
      {item.icon}
      {showSidebarUnreadCount ? (
        <div className="text-[0.625rem] font-medium leading-none">
          {unreadByView[view]! > 99 ? <span className="-mr-0.5">99+</span> : unreadByView[view]}
        </div>
      ) : (
        <i
          className={cn(
            "i-mgc-round-cute-fi text-[0.25rem]",
            unreadByView[view] ? (isActive ? "opacity-100" : "opacity-60") : "opacity-0",
          )}
        />
      )}
    </ActionButton>
  )
}

const ListSwitchButton: FC<{
  listId: string
  isActive: boolean
  setActive: () => void
}> = ({ listId, isActive, setActive }) => {
  const list = useListById(listId)
  const listUnread = useFeedUnreadStore((state) => state.data[listId] || 0)

  const handleNavigate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      setActive()
      subscriptionActions.markReadByFeedIds({
        listId,
      })
      // focus to main container in order to let keyboard can navigate entry items by arrow keys
      nextFrame(() => {
        getMainContainerElement()?.focus()
      })
    },
    [listId, setActive],
  )

  const items = useListActions({ listId })
  const showContextMenu = useShowContextMenu()
  const contextMenuProps = useContextMenu({
    onContextMenu: async (e) => {
      await showContextMenu(items, e)
    },
  })

  if (!list) return null

  return (
    <ActionButton
      key={list.id}
      tooltip={list.title}
      className={cn(
        "flex h-11 shrink-0 flex-col items-center gap-1 text-xl grayscale",
        "hover:!bg-theme-item-hover",
        isActive && "!bg-theme-item-active grayscale-0",
      )}
      size="lg"
      onClick={handleNavigate}
      {...contextMenuProps}
    >
      <FeedIcon fallback feed={list} size={22} noMargin />
      {!!listUnread && (
        <div className="center h-2.5 text-[0.25rem]">
          <i className={"i-mgc-round-cute-fi"} />
        </div>
      )}
      {!listUnread && (
        <span className="line-clamp-1 break-all px-1 text-[0.625rem] font-medium leading-none">
          {list.title}
        </span>
      )}
    </ActionButton>
  )
}

const InboxSwitchButton: FC<{
  inboxId: string
  isActive: boolean
  setActive: () => void
}> = ({ inboxId, isActive, setActive }) => {
  const inbox = useInboxById(inboxId)
  const inboxUnread = useFeedUnreadStore((state) => state.data[inboxId] || 0)
  const showSidebarUnreadCount = useUISettingKey("sidebarShowUnreadCount")

  const handleNavigate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      setActive()
      // focus to main container in order to let keyboard can navigate entry items by arrow keys
      nextFrame(() => {
        getMainContainerElement()?.focus()
      })
    },
    [setActive],
  )

  if (!inbox) return null

  return (
    <ActionButton
      tooltip={inbox.title}
      className={cn(
        "flex h-11 shrink-0 flex-col items-center gap-1 text-xl grayscale",
        ELECTRON ? "hover:!bg-theme-item-hover" : "",
        isActive && "text-black dark:text-white",
      )}
      size="lg"
      onClick={handleNavigate}
    >
      <FeedIcon fallback feed={inbox} size={22} noMargin />
      {showSidebarUnreadCount ? (
        <div className="text-[0.625rem] font-medium leading-none">
          {inboxUnread > 99 ? <span className="-mr-0.5">99+</span> : inboxUnread}
        </div>
      ) : (
        <i
          className={cn(
            "i-mgc-round-cute-fi text-[0.25rem]",
            inboxUnread ? (isActive ? "opacity-100" : "opacity-60") : "opacity-0",
          )}
        />
      )}
    </ActionButton>
  )
}
