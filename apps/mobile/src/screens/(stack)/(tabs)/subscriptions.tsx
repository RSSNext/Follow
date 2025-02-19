import { useSelectedFeed } from "@/src/modules/screen/atoms"
import { TimelineSelectorProvider } from "@/src/modules/screen/TimelineSelectorProvider"
import { SubscriptionList } from "@/src/modules/subscription/SubscriptionLists"

export default function Subscriptions() {
  const selectedFeed = useSelectedFeed()
  const view = selectedFeed?.type === "view" ? selectedFeed.viewId : undefined

  return (
    <TimelineSelectorProvider>
      <SubscriptionList view={view ?? 0} />
    </TimelineSelectorProvider>
  )
}
