import { DividerVertical } from "@follow/components/ui/divider/Divider.js"
import { useTriangleMenu } from "@follow/hooks"
import { getNodeXInScroller, isNodeVisibleInScroller } from "@follow/utils/dom"
import { clsx } from "@follow/utils/utils"
import { Fragment, useEffect, useRef, useState } from "react"

import { useTimelineColumnShow } from "~/atoms/sidebar"
import { ROOT_CONTAINER_ID } from "~/constants/dom"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useTimelineList } from "~/hooks/biz/useTimelineList"

import styles from "./index.module.css"
import { QuickSelectorPanel } from "./QuickSelectorPanel"
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

  const [rootContainer, setRootContainer] = useState<HTMLElement | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const $root = document.querySelector(`#${ROOT_CONTAINER_ID}`)
    if (!$root) return

    setRootContainer($root as HTMLElement)
  }, [])

  const activeTimelineId = useRouteParamsSelector((s) => s.timelineId)

  const [panelRef, setPanelRef] = useState<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const shouldOpen = useTriangleMenu(triggerRef, panelRef!, 0)

  const timelineColumnShow = useTimelineColumnShow()

  return (
    <Fragment>
      <div ref={containerRef} className="relative mb-4 mt-3">
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

        <div ref={triggerRef} className="absolute inset-y-0 right-0 w-4" />
      </div>

      {timelineColumnShow && (
        <QuickSelectorPanel
          ref={setPanelRef}
          open={shouldOpen}
          rootContainer={rootContainer}
          timelineList={timelineList}
          activeTimelineId={activeTimelineId}
        />
      )}
    </Fragment>
  )
}
