import { FeedColumn } from "@renderer/components/feed-column"
import { cn } from "@renderer/lib/utils"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <div className="flex h-full">
      <div className={cn("w-64 shrink-0 border-r pt-2.5 backdrop-blur")}>
        <FeedColumn />
      </div>
      <div className="flex flex-1 bg-background">
        <Outlet />
      </div>
    </div>
  )
}
