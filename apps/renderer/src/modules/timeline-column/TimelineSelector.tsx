import { Divider, DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { RootPortal } from "@follow/components/ui/portal/index.js"
import { ScrollArea } from "@follow/components/ui/scroll-area/ScrollArea.js"
import { EllipsisHorizontalTextWithTooltip } from "@follow/components/ui/typography/EllipsisWithTooltip.js"
import type { FeedViewType } from "@follow/constants"
import { views } from "@follow/constants"
import { getNodeXInScroller, isNodeVisibleInScroller } from "@follow/utils/dom"
import { clsx, cn } from "@follow/utils/utils"
import { AnimatePresence, m, useAnimationControls } from "framer-motion"
import type { HTMLAttributes } from "react"
import { Fragment, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { useShowContextMenu } from "~/atoms/context-menu"
import { useUISettingKey } from "~/atoms/settings/ui"
import {
  ROUTE_TIMELINE_OF_INBOX,
  ROUTE_TIMELINE_OF_LIST,
  ROUTE_TIMELINE_OF_VIEW,
} from "~/constants/app"
import { ROOT_CONTAINER_ID } from "~/constants/dom"
import { useListActions } from "~/hooks/biz/useFeedActions"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useTimelineList } from "~/hooks/biz/useTimelineList"
import { useContextMenu } from "~/hooks/common"
import { useInboxById } from "~/store/inbox"
import { useListById } from "~/store/list"

import { FeedIcon } from "../feed/feed-icon"
import styles from "./index.module.css"
import { feedColumnStyles } from "./styles"
import { TimelineSwitchButton } from "./TimelineSwitchButton"

export const TimelineSelector = ({ timelineId }: { timelineId: string | undefined }) => {
  const timelineList = useTimelineList()
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const $scroll = scrollRef.current
    if (!$scroll) {
      return
    }
    const handler = () => {
      if (!timelineId) return
      const targetElement = [...$scroll.children]
        .filter(($el) => $el.tagName === "BUTTON")
        .find(($el, index) => index === timelineList.all.indexOf(timelineId))
      if (!targetElement) {
        return
      }

      const isInCurrentView = isNodeVisibleInScroller(targetElement, $scroll)
      if (!targetElement || isInCurrentView) {
        return
      }
      const targetX = getNodeXInScroller(targetElement, $scroll) - 12

      $scroll.scrollTo({
        left: targetX,
        behavior: "smooth",
      })
    }
    handler()
  }, [timelineId])

  const feedColWidth = useUISettingKey("feedColWidth")
  const [rootContainer, setRootContainer] = useState<HTMLElement | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const $root = document.querySelector(`#${ROOT_CONTAINER_ID}`)
    if (!$root) return

    setRootContainer($root as HTMLElement)
  }, [])

  const activeTimelineId = useRouteParamsSelector((s) => s.timelineId)

  const [panelRef, setPanelRef] = useState<HTMLDivElement | null>(null)
  const shouldOpen = useTriangleMenu(containerRef, panelRef!)

  const animateControls = useAnimationControls()
  useEffect(() => {
    if (shouldOpen) {
      animateControls.start({
        transform: "translateX(0%)",
      })
    } else {
      animateControls.start({
        transform: "translateX(-100%)",
      })
    }
  }, [animateControls, shouldOpen])

  return (
    <Fragment>
      <div ref={containerRef} className="mt-3 pb-4">
        <div
          ref={scrollRef}
          className={clsx(
            styles["mask-scroller"],
            "flex h-11 justify-between gap-0.5 overflow-auto px-2 text-xl text-theme-vibrancyFg scrollbar-none",
          )}
          onWheel={(e) => {
            e.preventDefault()
            e.currentTarget.scrollLeft += e.deltaY
          }}
        >
          {timelineList.views.map((timelineId) => (
            <TimelineSwitchButton key={timelineId} timelineId={timelineId} />
          ))}

          {timelineList.inboxes.length > 0 && <DividerVertical className="mx-1 my-auto h-8" />}
          {timelineList.inboxes.map((timelineId) => (
            <TimelineSwitchButton key={timelineId} timelineId={timelineId} />
          ))}
          {timelineList.lists.length > 0 && <DividerVertical className="mx-1 my-auto h-8" />}
          {timelineList.lists.map((timelineId) => (
            <TimelineSwitchButton key={timelineId} timelineId={timelineId} />
          ))}
        </div>
      </div>

      <RootPortal to={rootContainer}>
        <AnimatePresence>
          <m.div
            ref={setPanelRef}
            className="fixed inset-y-0 z-[1] flex h-full w-64 flex-col border-x bg-native"
            style={{ left: feedColWidth }}
            initial={{ transform: "translateX(-100%)" }}
            animate={animateControls}
            // animate={{ transform: "translateX(0%)" }}
            transition={{
              damping: 50,
              stiffness: 500,
              type: "spring",
            }}
          >
            <div className="border-b p-3 text-lg font-medium">Quick Selector</div>
            <ScrollArea viewportClassName="pt-2 px-3" rootClassName="w-full">
              <span className="mb-3 text-base font-bold">Views</span>
              {timelineList.views.map((timelineId) => (
                <TimelineListViewItem
                  key={timelineId}
                  timelineId={timelineId}
                  isActive={activeTimelineId === timelineId}
                />
              ))}
              <Divider className="mx-12 my-4" />
              <span className="mb-3 text-base font-bold">Inboxes</span>
              {timelineList.inboxes.map((timelineId) => (
                <TimelineInboxListItem
                  key={timelineId}
                  timelineId={timelineId}
                  isActive={activeTimelineId === timelineId}
                />
              ))}
              <Divider className="mx-12 my-4" />
              <span className="mb-3 text-base font-bold">Lists</span>
              {timelineList.lists.map((timelineId) => (
                <TimelineListListItem
                  key={timelineId}
                  timelineId={timelineId}
                  isActive={activeTimelineId === timelineId}
                />
              ))}
            </ScrollArea>
          </m.div>
        </AnimatePresence>
      </RootPortal>
    </Fragment>
  )
}

interface TimelineItemProps {
  timelineId: string
  isActive: boolean
}
const TimelineListViewItem = ({ timelineId, isActive }: TimelineItemProps) => {
  const id = Number.parseInt(timelineId.slice(ROUTE_TIMELINE_OF_VIEW.length), 10) as FeedViewType
  const item = views.find((item) => item.view === id)!
  const { t } = useTranslation()

  return (
    <ItemBase timelineId={timelineId} isActive={isActive}>
      <div className="flex min-w-0 items-center gap-2">
        {item.icon}
        <EllipsisHorizontalTextWithTooltip className="truncate">
          {t(item.name as any)}
        </EllipsisHorizontalTextWithTooltip>
      </div>
    </ItemBase>
  )
}

const ItemBase: Component<
  { timelineId: string; isActive: boolean } & HTMLAttributes<HTMLButtonElement>
> = ({ timelineId, isActive, children, className, ...props }) => {
  const navigate = useNavigateEntry()
  return (
    <button
      type="button"
      onClick={() => {
        navigate({
          timelineId,
          feedId: null,
          entryId: null,
        })
      }}
      className={cn(
        feedColumnStyles.item,
        "flex w-full cursor-menu items-center justify-between rounded-md px-2.5 py-0.5 text-base font-medium leading-loose lg:text-sm",
        isActive && "bg-theme-item-active",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const TimelineListListItem = ({ timelineId, isActive }: TimelineItemProps) => {
  const id = timelineId.slice(ROUTE_TIMELINE_OF_LIST.length)
  const list = useListById(id)

  const items = useListActions({ listId: id })
  const showContextMenu = useShowContextMenu()

  const contextMenuProps = useContextMenu({
    onContextMenu: async (e) => {
      await showContextMenu(items, e)
    },
  })

  if (!list) return null
  return (
    <ItemBase className="px-1" timelineId={timelineId} isActive={isActive} {...contextMenuProps}>
      <div className="flex min-w-0 items-center gap-2">
        <FeedIcon fallback feed={list} size={22} noMargin />
        <EllipsisHorizontalTextWithTooltip className="truncate">
          {list.title}
        </EllipsisHorizontalTextWithTooltip>
      </div>
    </ItemBase>
  )
}

const TimelineInboxListItem = ({ timelineId, isActive }: TimelineItemProps) => {
  const id = timelineId.slice(ROUTE_TIMELINE_OF_INBOX.length)
  const inbox = useInboxById(id)

  if (!inbox) return null
  return (
    <ItemBase timelineId={timelineId} isActive={isActive}>
      <div className="flex min-w-0 items-center gap-2">
        <FeedIcon fallback feed={inbox} size={16} noMargin />
        <EllipsisHorizontalTextWithTooltip className="truncate">
          {inbox.title}
        </EllipsisHorizontalTextWithTooltip>
      </div>
    </ItemBase>
  )
}

function useTriangleMenu(triggerRef: React.RefObject<HTMLElement>, panelRef: HTMLElement) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const $trigger = triggerRef.current
    const $panel = panelRef
    if (!$trigger || !$panel) return
    const timer: NodeJS.Timeout | null = null

    let inStartTrack = false
    const mousePath = [] as { x: number; y: number }[]
    function handleMouseMove(event: MouseEvent) {
      const { clientX, clientY } = event

      if (!inStartTrack) return

      mousePath.push({ x: clientX, y: clientY })
      if (mousePath.length > 5) {
        mousePath.shift()
      }

      const triggerRect = $trigger?.getBoundingClientRect()

      if (!triggerRect) return
      const panelRect = $panel.getBoundingClientRect()

      const lastPoint = mousePath[0]

      if (!lastPoint) return

      const inTriangle = isPointInTriangle(
        { x: lastPoint.x, y: lastPoint.y },
        { x: triggerRect.right - triggerRect.width / 2, y: triggerRect.top },
        { x: panelRect.left, y: panelRect.top },
        { x: panelRect.left, y: panelRect.bottom },
      )

      if (inTriangle) {
        setOpen(true)
      } else {
        const inRect =
          isPointInRect(
            { x: clientX, y: clientY },
            {
              x: triggerRect.left,
              y: triggerRect.bottom,
              width: triggerRect.width,
              height: triggerRect.height,
            },
          ) ||
          isPointInRect(
            { x: clientX, y: clientY },
            {
              x: panelRect.left,
              y: panelRect.top,
              width: panelRect.width,
              height: panelRect.height,
            },
          )

        if (inRect) {
          setOpen(true)
        } else {
          setOpen(false)
          inStartTrack = false
        }
      }
    }

    function handleMouseEnter() {
      inStartTrack = true
      setOpen(true)
    }

    function handleMouseLeave() {
      // setOpen(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    $trigger.addEventListener("mouseenter", handleMouseEnter)
    $panel.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      $trigger.removeEventListener("mouseenter", handleMouseEnter)
      $panel.removeEventListener("mouseleave", handleMouseLeave)
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [triggerRef, panelRef])

  return open
}

function isPointInTriangle(
  P: { x: number; y: number },
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number },
) {
  function sign(p1: any, p2: any, p3: any) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  }

  const d1 = sign(P, A, B)
  const d2 = sign(P, B, C)
  const d3 = sign(P, C, A)

  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0

  return !(hasNeg && hasPos)
}

function isPointInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number },
) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  )
}
