import { FeedColumn } from "@renderer/components/feed-column"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <div className="flex h-full">
      <div className="w-64 shrink-0 border-r bg-native/80 pt-10 backdrop-blur">
        <FeedColumn />
      </div>
      <div className="flex flex-1 bg-background">
        <Outlet />
      </div>
    </div>
  )
}
