import { setMainContainerElement } from "@renderer/atoms"
import { FeedColumn } from "@renderer/components/feed-column"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <div className="flex h-full">
      <div className="w-64 shrink-0 border-r">
        <FeedColumn />
      </div>
      <div ref={setMainContainerElement} className="flex flex-1 bg-background" tabIndex={-1}>
        <Outlet />
      </div>
    </div>
  )
}
