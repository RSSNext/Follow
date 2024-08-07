import { Card, CardHeader } from "@renderer/components/ui/card"
import { Collapse, CollapseGroup } from "@renderer/components/ui/collapse"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { Markdown } from "@renderer/components/ui/markdown"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import type { FeedViewType } from "@renderer/lib/enum"
import { cn } from "@renderer/lib/utils"
import { MarkAllButton } from "@renderer/modules/entry-column/mark-all-button"
import type { FC } from "react"
import { useState } from "react"

type DailyView = Extract<
  FeedViewType,
  FeedViewType.Articles | FeedViewType.SocialMedia
>
enum DayOf {
  Today,
  Yesterday,
}
interface DailyItemProps {
  view: DailyView
  day: DayOf
}

const DailyItem = ({ view, day }: DailyItemProps) => {
  const dateObj = new Date()

  const nowHour = dateObj.getHours()
  let startDate: number
  let endDate: number
  let title: string

  const today8AM = dateObj.setHours(8, 0, 0, 0)
  const today8PM = dateObj.setHours(20, 0, 0, 0)
  dateObj.setDate(dateObj.getDate() - 1)
  const yesterday8AM = dateObj.setHours(8, 0, 0, 0)
  const yesterday8PM = dateObj.setHours(20, 0, 0, 0)
  dateObj.setDate(dateObj.getDate() - 1)
  const dayBeforeYesterday8PM = dateObj.setHours(20, 0, 0, 0)

  const isToday = day === DayOf.Today
  // For index 0, get the last past 8 AM or 8 PM; for index 1, get the second last past 8 AM or 8 PM.
  if (nowHour >= 20) {
    if (isToday) {
      endDate = today8PM - 1
      startDate = today8AM
      title = "Today"
    } else {
      endDate = today8AM - 1
      startDate = yesterday8PM
      title = "Last Night"
    }
  } else if (nowHour >= 8) {
    if (isToday) {
      endDate = today8AM - 1
      startDate = yesterday8PM
      title = "Last Night"
    } else {
      endDate = yesterday8PM - 1
      startDate = yesterday8AM
      title = "Yesterday"
    }
  } else {
    if (isToday) {
      endDate = yesterday8PM - 1
      startDate = yesterday8AM
      title = "Yesterday"
    } else {
      endDate = yesterday8AM - 1
      startDate = dayBeforeYesterday8PM
      title = "The Night Before Last"
    }
  }

  return (
    <Collapse
      hideArrow
      title={(
        <div className="flex items-center justify-center gap-2 text-base">
          <i className="i-mgc-magic-2-cute-re" />
          <div className="font-medium">
            {title}
            's Top News
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <i className="i-mgc-question-cute-re translate-y-px" />
            </TooltipTrigger>
            <TooltipContent>
              <ul className="list-decimal text-wrap pl-4 text-left text-sm">
                <li>
                  Here is news selected by AI from your timeline
                  {" ("}
                  {new Date(startDate).toLocaleTimeString("en-US", {
                    weekday: "short",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                  {" "}
                  -
                  {" "}
                  {new Date(endDate + 1).toLocaleTimeString("en-US", {
                    weekday: "short",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                  {") "}
                  that may be important to you.
                </li>
                <li>Update daily at 8 AM and 8 PM.</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      className="mx-auto w-full max-w-lg border-b pb-6 last:border-b-0"
    >
      <DailyReportContent endDate={endDate} view={view} startDate={startDate} />
    </Collapse>
  )
}

const DailyReportContent: FC<{
  view: DailyView
  startDate: number
  endDate: number
}> = ({ endDate, startDate, view }) => {
  const content = useAuthQuery(
    defineQuery(["daily", view, startDate, endDate], async () => {
      const res = await apiClient.ai.daily.$get({
        query: {
          startDate: `${+startDate}`,
          view: `${view}`,
        },
      })
      return res.data
    }),
    {
      meta: {
        persist: true,
      },
    },
  )

  const [markAllButtonRef, setMarkAllButtonRef] =
    useState<HTMLButtonElement | null>(null)

  return (
    <Card className="border-none bg-transparent">
      <CardHeader className="space-y-0 p-0">
        <ScrollArea.ScrollArea
          mask={false}
          flex
          viewportClassName="max-h-[calc(100vh-500px)]"
        >
          {content.isLoading ? (
            <LoadingCircle size="large" className="mt-8 text-center" />
          ) : (
            content.data && (
              <Markdown className="prose-sm mt-4 px-6 prose-p:my-1 prose-ul:my-1">
                {content.data}
              </Markdown>
            )
          )}
        </ScrollArea.ScrollArea>
        {content.data && (
          <button
            type="button"
            onClick={() => {
              markAllButtonRef?.click()
            }}
            className="!mt-4 ml-auto flex items-center rounded-lg py-1 pr-2 duration-200 hover:!bg-theme-button-hover"
          >
            <MarkAllButton
              ref={setMarkAllButtonRef}
              filter={{
                startTime: startDate,
                endTime: endDate,
              }}
              className="pointer-events-none text-[1.05rem]"
            />
            <span>Mark all as read</span>
          </button>
        )}
      </CardHeader>
    </Card>
  )
}

export const Daily = ({
  view,
  className,
}: {
  view: DailyView
  className?: string
}) => (
  <div className={cn(className, "mx-auto flex w-[75ch] flex-col gap-6")}>
    <CollapseGroup>
      <DailyItem day={DayOf.Today} view={view} />

      <DailyItem day={DayOf.Yesterday} view={view} />
    </CollapseGroup>
  </div>
)
