import { useSelectedFeed } from "@/src/modules/screen/atoms"
import { TimelineSelectorHeader } from "@/src/modules/screen/TimelineSelectorHeader"
import { SubscriptionList } from "@/src/modules/subscription/SubscriptionLists"

export default function Subscriptions() {
  const selectedFeed = useSelectedFeed()
  const view = selectedFeed?.type === "view" ? selectedFeed.viewId : undefined

  return (
    <TimelineSelectorHeader>
      <SubscriptionList view={view ?? 0} />
    </TimelineSelectorHeader>
  )
}
