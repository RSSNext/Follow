import { useEffect, useState } from "react"

import { useGeneralSettingKey } from "~/atoms/settings/general"
import { ROUTE_FEED_PENDING } from "~/constants/app"
import { ENTRY_COLUMN_LIST_SCROLLER_ID, LOGO_MOBILE_ID } from "~/constants/dom"
import { navigateEntry } from "~/hooks/biz/useNavigateEntry"
import { usePreventOverscrollBounce } from "~/hooks/common"
import { EntryColumn } from "~/modules/entry-column"

import { MobileFloatBar } from "../feed-column/float-bar.mobile"

export const EntryColumnMobile = () => {
  const isStartupTimeline = useGeneralSettingKey("startupScreen") === "timeline"

  const [scrollContainer, setScrollContainer] = useState<null | HTMLDivElement>(null)
  useEffect(() => {
    const timer = setTimeout(() => {
      setScrollContainer(
        document.querySelector(`#${ENTRY_COLUMN_LIST_SCROLLER_ID}`) as HTMLDivElement,
      )
    }, 1000)
    return () => clearTimeout(timer)
  }, [])
  usePreventOverscrollBounce()
  return (
    <div className="flex h-screen min-w-0 grow">
      <EntryColumn />

      {isStartupTimeline && (
        <MobileFloatBar
          className="!bottom-10"
          scrollContainer={scrollContainer}
          onLogoClick={() => {
            ;(document.querySelector(`#${LOGO_MOBILE_ID}`) as HTMLElement)?.click()
          }}
          onViewChange={(view) => {
            navigateEntry({
              entryId: null,
              feedId: ROUTE_FEED_PENDING,
              view,
            })
          }}
        />
      )}
    </div>
  )
}
