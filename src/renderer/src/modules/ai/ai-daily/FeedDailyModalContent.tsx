import { AutoResizeHeight } from "@renderer/components/ui/auto-resize-height"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@renderer/components/ui/tabs"
import { FeedViewType } from "@renderer/lib/enum"

import { DayOf } from "./constants"
import { DailyReportContent, DailyReportTitle } from "./daily"
import { useParseDailyDate } from "./hooks"

const tabs = [DayOf.Today, DayOf.Yesterday]

export const FeedDailyModalContent = () => {
  const today = useParseDailyDate(DayOf.Today)
  const yesterday = useParseDailyDate(DayOf.Yesterday)

  return (
    <Tabs defaultValue={DayOf.Today as any}>
      <TabsList className="w-full">
        {tabs.map((tab: any) => (
          <TabsTrigger key={tab} value={tab}>
            {/* {tab} */}
            <DailyReportTitle {...(tab === DayOf.Today ? today : yesterday)} />
          </TabsTrigger>
        ))}
      </TabsList>
      <AutoResizeHeight spring>
        {tabs.map((tab: any) => (
          <TabsContent key={tab} value={tab} className="mt-8">
            <DailyReportContent
              // TODO support other view types
              view={FeedViewType.SocialMedia}
              {...(tab === DayOf.Today ? today : yesterday)}
            />
          </TabsContent>
        ))}
      </AutoResizeHeight>
    </Tabs>
  )
}
