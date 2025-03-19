import { useMemo } from "react"

import { NoLoginInfo } from "@/src/components/common/NoLoginInfo"
import { EntryListContext } from "@/src/modules/screen/atoms"
import { PagerList } from "@/src/modules/screen/PageList"
import { TimelineSelectorProvider } from "@/src/modules/screen/TimelineSelectorProvider"
import { SubscriptionList } from "@/src/modules/subscription/SubscriptionLists"
import { useWhoami } from "@/src/store/user/hooks"

export default function Subscriptions() {
  const whoami = useWhoami()

  return (
    <EntryListContext.Provider value={useMemo(() => ({ type: "subscriptions" }), [])}>
      <TimelineSelectorProvider>
        {whoami ? (
          <PagerList renderItem={(view) => <SubscriptionList key={view} view={view} />} />
        ) : (
          <NoLoginInfo target="subscriptions" />
        )}
      </TimelineSelectorProvider>
    </EntryListContext.Provider>
  )
}
