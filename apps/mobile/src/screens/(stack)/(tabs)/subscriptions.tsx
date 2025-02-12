import { requireNativeView } from "expo"

const TimelineList = requireNativeView("TimelineList")
export default function Subscriptions() {
  return <TimelineList style={{ flex: 1 }} />
}
