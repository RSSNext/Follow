import { FeedColumn } from "@renderer/components/feed-column"
import {
  MainLayoutOutlet,
  useMainLayoutContext,
} from "@renderer/contexts/outlet/main-layout"

export function Component() {
  const { activeEntry, activeList, setActiveList, setActiveEntry } =
    useMainLayoutContext()
  return (
    <div className="flex h-full">
      <div className="w-64 pt-10 border-r shrink-0 bg-native">
        <FeedColumn />
      </div>
      <MainLayoutOutlet
        {...{
          activeList,
          activeEntry,
          setActiveList,
          setActiveEntry,
        }}
      />
    </div>
  )
}
