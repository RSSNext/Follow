import { RelativeDay } from "@renderer/components/ui/datetime"
import { useScrollViewElement } from "@renderer/components/ui/scroll-area/hooks"
import { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { throttle } from "lodash-es"
import { memo, useLayoutEffect, useMemo, useRef, useState } from "react"

import { MarkAllButton } from "./mark-all-button"

const useParseDate = (date: string) => useMemo(() => {
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

  const { isSticky, itemRef } = useSticky()
  const RelativeElement = <RelativeDay date={dateObj} />
  return (
    <div className={cn(className, isSticky && "border-b")} ref={itemRef}>
      <MarkAllButton
        which={RelativeElement}
        className="size-7 text-base"
        filter={{
          startTime: startOfDay,
          endTime: endOfDay,
        }}
      />
      {RelativeElement}
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

  const { isSticky, itemRef } = useSticky()
  const RelativeElement = <RelativeDay date={dateObj} />
  return (
    <div className={cn(className, isSticky && "border-b")} ref={itemRef}>
      <div className="m-auto flex w-[67ch] gap-3 pl-5 text-lg">
        <MarkAllButton
          filter={{
            startTime: startOfDay,
            endTime: endOfDay,
          }}
          which={RelativeElement}
        />
        {RelativeElement}
      </div>
    </div>
  )
}
