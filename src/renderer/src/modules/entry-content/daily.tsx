import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@renderer/components/ui/accordion"
import { Card, CardHeader } from "@renderer/components/ui/card"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { Markdown } from "@renderer/components/ui/markdown"
import { ScrollArea } from "@renderer/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@renderer/components/ui/tooltip"
import { useAuthQuery } from "@renderer/hooks/common"
import { apiClient } from "@renderer/lib/api-fetch"
import { defineQuery } from "@renderer/lib/defineQuery"
import { cn } from "@renderer/lib/utils"
import { MarkAllButton } from "@renderer/modules/entry-column/mark-all-button"
import { useState } from "react"

export const DailyItem = ({
  value,
  index,
  view,
}: {
  value?: string
  index: 0 | 1
  view: 0 | 1
}) => {
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

  // For index 0, get the last past 8 AM or 8 PM; for index 1, get the second last past 8 AM or 8 PM.
  if (nowHour >= 20) {
    if (index === 0) {
      endDate = today8PM - 1
      startDate = today8AM
      title = "Today"
    } else {
      endDate = today8AM - 1
      startDate = yesterday8PM
      title = "Last Night"
    }
  } else if (nowHour >= 8) {
    if (index === 0) {
      endDate = today8AM - 1
      startDate = yesterday8PM
      title = "Last Night"
    } else {
      endDate = yesterday8PM - 1
      startDate = yesterday8AM
      title = "Yesterday"
    }
  } else {
    if (index === 0) {
      endDate = yesterday8PM - 1
      startDate = yesterday8AM
      title = "Yesterday"
    } else {
      endDate = yesterday8AM - 1
      startDate = dayBeforeYesterday8PM
      title = "The Night Before Last"
    }
  }

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
      enabled: value === `${index}`,
    },
  )

  return (
    <AccordionItem value={`${index}`} className="mx-auto max-w-lg last:border-b-0">
      <Card className="border-none">
        <CardHeader className="space-y-0 p-0">
          <AccordionTrigger className="justify-center py-6 pt-2 hover:no-underline">
            <div className="flex items-center gap-2 text-base">
              <i className="i-mgc-magic-2-cute-re" />
              <div className="font-medium">
                {title}
                's Top News
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <i className="i-mgc-information-cute-re" />
                </TooltipTrigger>
                <TooltipContent>
                  <ul className="list-decimal pl-4 text-left text-sm">
                    <li>
                      Here is news selected by AI from your timeline
                      {" ("}
                      {new Date(startDate).toLocaleTimeString("en-US", { weekday: "short", hour: "numeric", minute: "numeric" })}
                      {" "}
                      -
                      {" "}
                      {new Date(endDate + 1).toLocaleTimeString("en-US", { weekday: "short", hour: "numeric", minute: "numeric" })}
                      {") "}
                      that may be important to you.
                    </li>
                    <li>Update daily at 8 AM and 8 PM.</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea.ScrollArea
              mask={false}
              flex
              viewportClassName="max-h-[calc(100vh-500px)]"
            >
              {content.isLoading ? (
                <LoadingCircle size="large" className="text-center" />
              ) : (
                content.data && (
                  <Markdown className="prose-sm px-6 prose-p:my-1 prose-ul:my-1">{content.data}</Markdown>
                )
              )}
            </ScrollArea.ScrollArea>
            <div className="mt-4 flex items-center pl-3.5">
              <MarkAllButton
                filter={{
                  startTime: startDate,
                  endTime: endDate,
                }}
                className="text-[1.05rem]"
              />
              <span>Mark all as read</span>
            </div>
          </AccordionContent>
        </CardHeader>
      </Card>
    </AccordionItem>
  )
}

export const Daily = ({
  view,
  className,
}: {
  view: 0 | 1
  className?: string
}) => {
  const [value, setValue] = useState<string>()

  return (
    <div className={cn(className, "mx-auto w-[75ch] gap-3")}>
      <Accordion type="single" className="space-y-4" collapsible value={value} onValueChange={setValue}>
        <DailyItem value={value} index={0} view={view} />
        <DailyItem value={value} index={1} view={view} />
      </Accordion>
    </div>
  )
}
