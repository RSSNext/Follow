import { useMemo } from "react"

import { EntryListContext, useSelectedFeed } from "@/src/modules/screen/atoms"
import { TimelineSelectorProvider } from "@/src/modules/screen/TimelineSelectorProvider"
import { SubscriptionList } from "@/src/modules/subscription/SubscriptionLists"

export default function Subscriptions() {
  const selectedFeed = useSelectedFeed()
  const view = selectedFeed?.type === "view" ? selectedFeed.viewId : undefined

  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "subscriptions" }), [])}>
      <TimelineSelectorProvider>
        <SubscriptionList view={view ?? 0} />
      </TimelineSelectorProvider>
    </EntryListContext.Provider>
  )
}
