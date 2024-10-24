import { ActionButton } from "@follow/components/ui/button/index.js"
import { useScrollViewElement } from "@follow/components/ui/scroll-area/hooks.js"
import { FeedViewType } from "@follow/constants"
import { stopPropagation } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { m } from "framer-motion"
import { throttle } from "lodash-es"
import type { FC, PropsWithChildren } from "react"
import {
  cloneElement,
  memo,
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Trans } from "react-i18next"
import { useDebounceCallback } from "usehooks-ts"

import { SafeFragment } from "~/components/common/Fragment"
import { RelativeDay } from "~/components/ui/datetime"
import { IconScaleTransition } from "~/components/ux/transition/icon"
import { useRouteParams } from "~/hooks/biz/useRouteParams"
import { isListSubscription } from "~/store/subscription"

import { useMarkAllByRoute } from "../hooks/useMarkAll"

const useParseDate = (date: string) =>
  useMemo(() => {
    const dateObj = new Date(date)
    return {
      dateObj,
      startOfDay: new Date(dateObj.setHours(0, 0, 0, 0)).getTime(),
      endOfDay: new Date(dateObj.setHours(23, 59, 59, 999)).getTime(),
    }
  }, [date])

const useSticky = () => {
  const $scroller = useScrollViewElement()
  const itemRef = useRef<HTMLDivElement>(null)

  const [isSticky, setIsSticky] = useState(false)
  useLayoutEffect(() => {
    const $ = itemRef.current?.parentElement
    if (!$) return
    const handler = throttle((e: HTMLElementEventMap["scroll"]) => {
      if ((e.target as HTMLElement).scrollTop < 10) {
        setIsSticky(false)
        return
      }
      const isSticky = $.offsetTop <= 0

      setIsSticky(isSticky)
    }, 16)
    $scroller?.addEventListener("scroll", handler)
    return () => {
      $scroller?.removeEventListener("scroll", handler)
    }
  }, [$scroller])

  return { isSticky, itemRef }
}
export const DateItem = memo(({ date, view }: { date: string; view: FeedViewType }) => {
  const className = cn(
    "pt-2",
    `relative z-10 -mx-2 flex items-center gap-1 bg-background px-4 text-base font-bold text-zinc-800 dark:text-neutral-400`,
  )

  if (view === FeedViewType.SocialMedia) {
    return <SocialMediaDateItem date={date} className={className} />
  }
  return <UniversalDateItem date={date} className={className} />
})
const UniversalDateItem = ({ date, className }: { date: string; className?: string }) => {
  const { startOfDay, endOfDay, dateObj } = useParseDate(date)

  return (
    <DateItemInner className={className} date={dateObj} startTime={startOfDay} endTime={endOfDay} />
  )
}

const DateItemInner: FC<{
  date: Date
  startTime: number
  endTime: number
  className?: string
  Wrapper?: FC<PropsWithChildren>
}> = ({ date, endTime, startTime, className, Wrapper }) => {
  const rid = useId()
  const RelativeElement = useMemo(
    () => (
      <m.span key="b" layout layoutId={rid}>
        <RelativeDay date={date} />
      </m.span>
    ),
    [date, rid],
  )

  const handleMarkAllAsRead = useMarkAllByRoute({
    startTime,
    endTime,
  })
  const { isSticky, itemRef } = useSticky()

  const [confirmMark, setConfirmMark] = useState(false)
  const removeConfirm = useDebounceCallback(
    () => {
      setConfirmMark(false)
    },
    1000,
    {
      leading: false,
    },
  )

  const timerRef = useRef<any>()
  const W = Wrapper ?? SafeFragment

  const { feedId } = useRouteParams()
  const isList = isListSubscription(feedId)

  const tooltipId = useRef(Math.random().toString())
  return (
    <div
      className={cn(className, isSticky && "border-b")}
      ref={itemRef}
      onClick={stopPropagation}
      onMouseEnter={removeConfirm.cancel}
      onMouseLeave={removeConfirm}
    >
      <W>
        <ActionButton
          tooltip={
            <span>
              <Trans
                i18nKey="mark_all_read_button.mark_as_read"
                components={{
                  which: useMemo(
                    () => cloneElement(RelativeElement, { layoutId: tooltipId.current }),
                    [RelativeElement],
                  ),
                }}
              />
            </span>
          }
          onClick={() => {
            if (confirmMark) {
              clearTimeout(timerRef.current)
              handleMarkAllAsRead()
              setConfirmMark(false)
            } else {
              setConfirmMark(true)
            }
          }}
          className={cn("size-7 text-base", isList && "pointer-events-none opacity-0")}
        >
          <IconScaleTransition
            icon1="i-mgc-check-filled text-green-600"
            icon2="i-mgc-check-circle-cute-re"
            status={!confirmMark ? "done" : "init"}
          />
        </ActionButton>

        {confirmMark ? (
          <div className="animate-mask-in" key="a">
            <Trans
              i18nKey="mark_all_read_button.confirm_mark_all"
              components={{
                which: <>{RelativeElement}</>,
              }}
            />
          </div>
        ) : (
          RelativeElement
        )}
      </W>
    </div>
  )
}
const SocialMediaDateItem = ({ date, className }: { date: string; className?: string }) => {
  const { startOfDay, endOfDay, dateObj } = useParseDate(date)

  return (
    <DateItemInner
      // @ts-expect-error
      Wrapper={useCallback(
        ({ children }) => (
          <div className="m-auto flex w-[645px] gap-3 pl-5 text-lg">{children}</div>
        ),
        [],
      )}
      className={className}
      date={dateObj}
      startTime={startOfDay}
      endTime={endOfDay}
    />
  )
}
