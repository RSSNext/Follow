import { useGeneralSettingKey } from "~/atoms/settings/general"
import { ROUTE_FEED_PENDING } from "~/constants/app"
import { LOGO_MOBILE_ID } from "~/constants/dom"
import { navigateEntry } from "~/hooks/biz/useNavigateEntry"
import { EntryColumn } from "~/modules/entry-column"

import { MobileFloatBar } from "../feed-column/float-bar.mobile"

export const EntryColumnMobile = () => {
  const isStartupTimeline = useGeneralSettingKey("startupScreen") === "timeline"
  return (
    <div className="flex h-screen min-w-0 grow">
      <EntryColumn />

      {isStartupTimeline && (
        <MobileFloatBar
          scrollContainer={null}
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
