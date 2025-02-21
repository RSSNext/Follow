import { Divider } from "@follow/components/ui/divider/Divider.js"
import { RootPortal } from "@follow/components/ui/portal/index.js"
import { ScrollArea } from "@follow/components/ui/scroll-area/ScrollArea.js"
import { EllipsisHorizontalTextWithTooltip } from "@follow/components/ui/typography/EllipsisWithTooltip.js"
import type { FeedViewType } from "@follow/constants"
import { views } from "@follow/constants"
import { cn } from "@follow/utils/utils"
import { AnimatePresence, m, useAnimationControls } from "framer-motion"
import type { HTMLAttributes } from "react"
import { forwardRef, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { useShowContextMenu } from "~/atoms/context-menu"
import { useUISettingKey } from "~/atoms/settings/ui"
import {
  ROUTE_TIMELINE_OF_INBOX,
  ROUTE_TIMELINE_OF_LIST,
  ROUTE_TIMELINE_OF_VIEW,
} from "~/constants"
import { useListActions } from "~/hooks/biz/useFeedActions"
import { useNavigateEntry } from "~/hooks/biz/useNavigateEntry"
import { useContextMenu } from "~/hooks/common"
import { useInboxById } from "~/store/inbox"
import { useListById } from "~/store/list"

import { FeedIcon } from "../feed/feed-icon"
import { feedColumnStyles } from "./styles"

interface QuickSelectorPanelProps {
  rootContainer: HTMLElement | null
  timelineList: {
    views: string[]
    lists: string[]
    inboxes: string[]
    all: string[]
  }
  activeTimelineId: string | undefined
  open: boolean
}

export const QuickSelectorPanel = forwardRef<HTMLDivElement, QuickSelectorPanelProps>(
  ({ rootContainer, timelineList, activeTimelineId, open: shouldOpen }, ref) => {
    const feedColWidth = useUISettingKey("feedColWidth")
    const animateControls = useAnimationControls()
    const [renderPanel, setRenderPanel] = useState(false)

    useEffect(() => {
      let cancel = false
      if (shouldOpen) {
        setRenderPanel(true)
        animateControls.start({
          transform: "translateX(0%)",
        })
      } else {
        animateControls
          .start({
            transform: "translateX(-100%)",
          })
          .then(() => {
            if (cancel) return
            setRenderPanel(false)
          })
      }
      return () => {
        cancel = true
      }
    }, [animateControls, renderPanel, shouldOpen])

    return (
      <RootPortal to={rootContainer}>
        <AnimatePresence>
          <div
            className="pointer-events-none fixed inset-y-0 z-[1] w-64 overflow-hidden"
            style={{ left: feedColWidth }}
          >
            <m.div
              ref={ref}
              className="pointer-events-auto flex h-full w-64 flex-col border-x bg-native"
              initial={{ transform: "translateX(-100%)" }}
              animate={animateControls}
              transition={{
                damping: 50,
                stiffness: 500,
                type: "spring",
              }}
            >
              {renderPanel && (
                <>
                  <header className="flex items-center justify-between border-b p-3 text-lg font-medium">
                    <span className="text-lg font-medium">Quick Selector</span>

                    <button
                      type="button"
                      className="flex items-center justify-center rounded p-1 transition-colors duration-200 hover:bg-theme-item-hover"
                      onClick={() => {
                        animateControls.start({
                          transform: "translateX(-100%)",
                        })
                      }}
                    >
                      <i className="i-mgc-close-cute-re" />
                    </button>
                  </header>
                  <ScrollArea viewportClassName="pt-2 px-3" rootClassName="w-full">
                    <TimelineSection
                      title="Views"
                      items={timelineList.views}
                      activeTimelineId={activeTimelineId}
                      ItemComponent={TimelineListViewItem}
                    />
                    <Divider className="mx-12 my-4" />
                    <TimelineSection
                      title="Inboxes"
                      items={timelineList.inboxes}
                      activeTimelineId={activeTimelineId}
                      ItemComponent={TimelineInboxListItem}
                    />
                    <Divider className="mx-12 my-4" />
                    <TimelineSection
                      title="Lists"
                      items={timelineList.lists}
                      activeTimelineId={activeTimelineId}
                      ItemComponent={TimelineListListItem}
                    />
                  </ScrollArea>
                </>
              )}
            </m.div>
          </div>
        </AnimatePresence>
      </RootPortal>
    )
  },
)

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
        "flex w-full cursor-button items-center justify-between rounded-md px-2.5 py-0.5 text-base font-medium leading-loose lg:text-sm",
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

interface TimelineSectionProps {
  title: string
  items: string[]
  ItemComponent: React.ComponentType<TimelineItemProps>
  activeTimelineId?: string | undefined
}

const TimelineSection = ({
  title,
  items,
  activeTimelineId,
  ItemComponent,
}: TimelineSectionProps) => {
  return (
    <>
      <div className="mb-1 text-base font-bold">{title}</div>
      {items.length > 0 ? (
        <div className="flex flex-col gap-1">
          {items.map((timelineId) => (
            <ItemComponent
              key={timelineId}
              timelineId={timelineId}
              isActive={activeTimelineId === timelineId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground">Nothing in {title}</div>
      )}
    </>
  )
}
