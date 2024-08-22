import { SafeFragment } from "@renderer/components/common/Fragment"
import { ActionButton } from "@renderer/components/ui/button"
import { RelativeDay } from "@renderer/components/ui/datetime"
import { useScrollViewElement } from "@renderer/components/ui/scroll-area/hooks"
import { IconScaleTransition } from "@renderer/components/ux/transition/icon"
import { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { throttle } from "lodash-es"
import type { FC, PropsWithChildren } from "react"
import {
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"

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
export const DateItem = memo(
  ({ date, view }: { date: string, view: FeedViewType }) => {
    const className = cn(
      "pt-2",
      `relative z-10 -mx-2 flex items-center gap-1 bg-background px-4 text-base font-bold text-zinc-800 dark:text-neutral-400`,
    )

    if (view === FeedViewType.SocialMedia) {
      return <SocialMediaDateItem date={date} className={className} />
    }
    return <UniversalDateItem date={date} className={className} />
  },
)
const UniversalDateItem = ({
  date,
  className,
}: {
  date: string
  className?: string
}) => {
  const { startOfDay, endOfDay, dateObj } = useParseDate(date)

  return (
    <DateItemInner
      className={className}
      date={dateObj}
      startTime={startOfDay}
      endTime={endOfDay}
    />
  )
}

const DateItemInner: FC<{
  date: Date
  startTime: number
  endTime: number
  className?: string
  Wrapper?: FC<PropsWithChildren>
}> = ({ date, endTime, startTime, className, Wrapper }) => {
  const RelativeElement = <RelativeDay date={date} />

  const handleMarkAllAsRead = useMarkAllByRoute({
    startTime,
    endTime,
  })
  const { isSticky, itemRef } = useSticky()

  const [confirmMark, setConfirmMark] = useState(false)

  const timerRef = useRef<any>()
  const W = Wrapper ?? SafeFragment

  return (
    <div
      className={cn(className, isSticky && "border-b")}
      ref={itemRef}
      onMouseEnter={() => {
        clearTimeout(timerRef.current)
      }}
      onMouseLeave={() => {
        timerRef.current = setTimeout(() => {
          setConfirmMark(false)
        }, 1000)
      }}
    >
      <W>
        <ActionButton
          tooltip={(
            <span>
              Mark
              <span> </span>
              {RelativeElement}
              <span> </span>
              as read
            </span>
          )}
          onClick={() => {
            if (confirmMark) {
              clearTimeout(timerRef.current)
              handleMarkAllAsRead()
              setConfirmMark(false)
            } else {
              setConfirmMark(true)
            }
          }}
          className="size-7 text-base"
        >
          <IconScaleTransition
            icon1="i-mgc-check-filled text-green-600"
            icon2="i-mgc-check-circle-cute-re"
            status={!confirmMark ? "done" : "init"}
          />
        </ActionButton>
        {confirmMark ? (
          <div className="animate-mask-in">
            Mark
            <span> </span>
            {RelativeElement}
            {" "}
            as read?
          </div>
        ) : (
          RelativeElement
        )}
      </W>
    </div>
  )
}
const SocialMediaDateItem = ({
  date,
  className,
}: {
  date: string
  className?: string
}) => {
  const { startOfDay, endOfDay, dateObj } = useParseDate(date)

  return (
    <DateItemInner
      // @ts-expect-error
      Wrapper={useCallback(
        ({ children }) => (
          <div className="m-auto flex w-[67ch] gap-3 pl-5 text-lg">
            {children}
          </div>
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
