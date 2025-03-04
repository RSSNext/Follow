import { useMemo } from "react"

import { NoLoginInfo } from "@/src/components/common/NoLoginInfo"
import { EntryListContext, useSelectedFeed } from "@/src/modules/screen/atoms"
import { TimelineSelectorProvider } from "@/src/modules/screen/TimelineSelectorProvider"
import { SubscriptionList } from "@/src/modules/subscription/SubscriptionLists"
import { useWhoami } from "@/src/store/user/hooks"

export default function Subscriptions() {
  const whoami = useWhoami()
  const selectedFeed = useSelectedFeed()
  const view = selectedFeed?.type === "view" ? selectedFeed.viewId : undefined

  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "subscriptions" }), [])}>
      <TimelineSelectorProvider>
        {whoami ? <SubscriptionList view={view ?? 0} /> : <NoLoginInfo target="subscriptions" />}
      </TimelineSelectorProvider>
    </EntryListContext.Provider>
  )
}
