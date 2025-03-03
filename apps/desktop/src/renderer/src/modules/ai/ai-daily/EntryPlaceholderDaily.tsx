import { cn } from "@follow/utils/utils"
import { useEffect } from "react"

import { CollapseGroup } from "~/components/ui/collapse"
import { useCollapseGroupItemState } from "~/components/ui/collapse/hooks"
import { setEntryContentPlaceholderLogoShow } from "~/modules/entry-content/atoms"

import { DayOf } from "./constants"
import { DailyItem } from "./daily"
import type { DailyView } from "./types"

export const EntryPlaceholderDaily = ({
  view,
  className,
}: {
  view: DailyView
  className?: string
}) => (
  <div className={cn(className, "mx-auto flex w-full max-w-[75ch] flex-col gap-6")}>
    <CollapseGroup>
      <CtxConsumer />
      <DailyItem day={DayOf.Today} view={view} />
      <DailyItem day={DayOf.Yesterday} view={view} />
    </CollapseGroup>
  </div>
)
const CtxConsumer = () => {
  const status = useCollapseGroupItemState()
  const isAllCollapsed = Object.values(status).every((v) => !v)
  useEffect(() => {
    setEntryContentPlaceholderLogoShow(isAllCollapsed)
  }, [isAllCollapsed])
  return null
}
