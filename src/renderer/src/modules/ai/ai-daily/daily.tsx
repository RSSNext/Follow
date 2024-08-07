import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import { Card, CardHeader } from "@renderer/components/ui/card"
import { Collapse } from "@renderer/components/ui/collapse"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { parseMarkdown } from "@renderer/lib/parse-markdown"
import { MarkAllButton } from "@renderer/modules/entry-column/mark-all-button"
import type { FC } from "react"
import { useMemo, useState } from "react"

import { useParseDailyDate } from "./hooks"
import type { DailyItemProps, DailyView } from "./types"

export const DailyItem = ({ view, day }: DailyItemProps) => {
  const { title, startDate, endDate } = useParseDailyDate(day)
  return (
    <Collapse
      hideArrow
      title={
        <DailyReportTitle title={title} startDate={startDate} endDate={endDate} />
      }
      className="mx-auto w-full max-w-lg border-b pb-6 last:border-b-0"
    >
      <DailyReportContent endDate={endDate} view={view} startDate={startDate} />
    </Collapse>
  )
}

export const DailyReportTitle = ({
  endDate,
  startDate,
  title,
}: {
  title: string
  startDate: number
  endDate: number
}) => (
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
      <TooltipPortal>
        <TooltipContent>
          <ul className="list-outside list-decimal text-wrap pl-6 text-left text-sm">
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
      </TooltipPortal>
    </Tooltip>
  </div>
)

export const DailyReportContent: FC<{
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

  const eleContent = useMemo(() => {
    if (!content.data) return null
    const { content: _content } = parseMarkdown(content.data)
    return _content
  }, [content.data])

  return (
    <Card className="border-none bg-transparent">
      <CardHeader className="space-y-0 p-0">
        <ScrollArea.ScrollArea
          mask={false}
          flex
          viewportClassName="max-h-[calc(100vh-500px)]"
        >
          <AutoResizeHeight spring>
            {content.isLoading ? (
              <LoadingCircle size="large" className="mt-8 text-center" />
            ) : (
              eleContent && (
                <div className="prose-sm mt-4 px-6 prose-p:my-1 prose-ul:my-1 prose-ul:list-outside prose-ul:list-disc prose-li:marker:text-theme-accent">
                  {eleContent}
                </div>
              )
            )}
          </AutoResizeHeight>
        </ScrollArea.ScrollArea>
        {eleContent && (
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
