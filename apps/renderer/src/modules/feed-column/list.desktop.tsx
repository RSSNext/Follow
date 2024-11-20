import { useDraggable } from "@dnd-kit/core"
import { ScrollArea } from "@follow/components/ui/scroll-area/index.js"
import { cn, isKeyForMultiSelectPressed } from "@follow/utils/utils"
import { forwardRef, memo, useImperativeHandle, useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import Selecto from "react-selecto"
import { useEventListener } from "usehooks-ts"

import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"
import { useCategoryOpenStateByView } from "~/store/subscription"

import { setFeedAreaScrollProgressValue, useSelectedFeedIds } from "./atom"
import { DraggableContext } from "./context"
import { useShouldFreeUpSpace } from "./hook"
import {
  EmptyFeedList,
  ListHeader,
  StarredItem,
  useFeedsGroupedData,
  useInboxesGroupedData,
  useListsGroupedData,
} from "./list.shared"
import { SortableFeedList, SortByAlphabeticalInbox, SortByAlphabeticalList } from "./sort-by"

const FeedListImpl = forwardRef<HTMLDivElement, { className?: string; view: number }>(
  ({ className, view }, ref) => {
    const feedsData = useFeedsGroupedData(view)
    const listsData = useListsGroupedData(view)
    const inboxesData = useInboxesGroupedData(view)
    const categoryOpenStateData = useCategoryOpenStateByView(view)

    const hasData =
      Object.keys(feedsData).length > 0 ||
      Object.keys(listsData).length > 0 ||
      Object.keys(inboxesData).length > 0

    const { t } = useTranslation()

    // Data prefetch
    useAuthQuery(Queries.lists.list())

    const hasListData = Object.keys(listsData).length > 0
    const hasInboxData = Object.keys(inboxesData).length > 0

    const scrollerRef = useRef<HTMLDivElement>(null)
    const selectoRef = useRef<Selecto>(null)
    const [selectedFeedIds, setSelectedFeedIds] = useSelectedFeedIds()

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "selected-feed",
      disabled: selectedFeedIds.length === 0,
    })
    const style = useMemo(
      () =>
        transform
          ? ({
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              transitionDuration: "0",
              transition: "none",
            } as React.CSSProperties)
          : undefined,
      [transform],
    )

    const draggableContextValue = useMemo(
      () => ({
        attributes,
        listeners,
        style: {
          ...style,
          willChange: "transform",
        },
      }),
      [attributes, listeners, style],
    )

    useImperativeHandle(ref, () => scrollerRef.current!)

    useEventListener(
      "scroll",
      () => {
        const round = (num: number) => Math.round(num * 1e2) / 1e2
        const getPositions = () => {
          const el = scrollerRef.current
          if (!el) return

          return {
            x: round(el.scrollLeft / (el.scrollWidth - el.clientWidth)),
            y: round(el.scrollTop / (el.scrollHeight - el.clientHeight)),
          }
        }

        const newScrollValues = getPositions()
        if (!newScrollValues) return

        const { y } = newScrollValues
        setFeedAreaScrollProgressValue(y)
      },
      scrollerRef,
      { capture: false, passive: true },
    )

    const shouldFreeUpSpace = useShouldFreeUpSpace()

    return (
      <div className={cn(className, "font-medium")}>
        <ListHeader view={view} />

        <Selecto
          className="!border-theme-accent-400 !bg-theme-accent-400/60"
          ref={selectoRef}
          rootContainer={document.body}
          dragContainer={"#feeds-area"}
          dragCondition={(e) => {
            const inputEvent = e.inputEvent as MouseEvent
            const target = inputEvent.target as HTMLElement
            const closest = target.closest("[data-feed-id]") as HTMLElement | null
            const dataFeedId = closest?.dataset.feedId

            if (
              dataFeedId &&
              selectedFeedIds.includes(dataFeedId) &&
              !isKeyForMultiSelectPressed(inputEvent)
            )
              return false

            return true
          }}
          onDragStart={(e) => {
            if (!isKeyForMultiSelectPressed(e.inputEvent as MouseEvent)) {
              setSelectedFeedIds([])
            }
          }}
          selectableTargets={["[data-feed-id]"]}
          continueSelect
          hitRate={1}
          onSelect={(e) => {
            const allChanged = [...e.added, ...e.removed]
              .map((el) => el.dataset.feedId)
              .filter((id) => id !== undefined)

            setSelectedFeedIds((prev) => {
              const added = allChanged.filter((id) => !prev.includes(id))
              const removed = new Set(allChanged.filter((id) => prev.includes(id)))
              return [...prev.filter((id) => !removed.has(id)), ...added]
            })
          }}
          scrollOptions={{
            container: scrollerRef.current as HTMLElement,
            throttleTime: 30,
            threshold: 0,
          }}
          onScroll={(e) => {
            scrollerRef.current?.scrollBy(e.direction[0] * 10, e.direction[1] * 10)
          }}
        />

        <ScrollArea.ScrollArea
          ref={scrollerRef}
          onScroll={() => {
            selectoRef.current?.checkScroll()
          }}
          mask={false}
          flex
          viewportClassName={cn("!px-3", shouldFreeUpSpace && "!overflow-visible")}
          rootClassName={cn("h-full", shouldFreeUpSpace && "overflow-visible")}
        >
          <StarredItem view={view} />
          {hasListData && (
            <>
              <div className="mt-1 flex h-6 w-full shrink-0 items-center rounded-md px-2.5 text-xs font-semibold text-theme-vibrancyFg transition-colors">
                {t("words.lists")}
              </div>
              <SortByAlphabeticalList view={view} data={listsData} />
            </>
          )}
          {hasInboxData && (
            <>
              <div className="mt-1 flex h-6 w-full shrink-0 items-center rounded-md px-2.5 text-xs font-semibold text-theme-vibrancyFg transition-colors">
                {t("words.inbox")}
              </div>
              <SortByAlphabeticalInbox view={view} data={inboxesData} />
            </>
          )}

          <DraggableContext.Provider value={draggableContextValue}>
            <div className="space-y-px" id="feeds-area" ref={setNodeRef}>
              {(hasListData || hasInboxData) && (
                <div
                  className={cn(
                    "mb-1 flex h-6 w-full shrink-0 items-center rounded-md px-2.5 text-xs font-semibold text-theme-vibrancyFg transition-colors",
                    Object.keys(feedsData).length === 0 ? "mt-0" : "mt-1",
                  )}
                >
                  {t("words.feeds")}
                </div>
              )}
              {hasData ? (
                <SortableFeedList
                  view={view}
                  data={feedsData}
                  categoryOpenStateData={categoryOpenStateData}
                />
              ) : (
                <EmptyFeedList />
              )}
            </div>
          </DraggableContext.Provider>
        </ScrollArea.ScrollArea>
      </div>
    )
  },
)
FeedListImpl.displayName = "FeedListImpl"

export const FeedList = memo(FeedListImpl)
