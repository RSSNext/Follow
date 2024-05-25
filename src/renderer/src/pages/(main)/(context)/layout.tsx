import { FeedColumn } from "@renderer/components/feed-column"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <div className="flex h-full">
      <div className="w-64 shrink-0 border-r bg-native pt-10">
        <FeedColumn />
      </div>

      <Outlet />
    </div>
  )
}
