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
      <div className="w-64 shrink-0 border-r bg-native pt-10">
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
