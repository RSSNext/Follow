import { setMainContainerElement } from "@renderer/atoms"
import { preventDefault } from "@renderer/lib/dom"
import { FeedColumn } from "@renderer/modules/feed-column"
import { Outlet } from "react-router-dom"

export function Component() {
  return (
    <div className="flex h-full" onContextMenu={preventDefault}>
      <div className="w-64 shrink-0 border-r">
        <FeedColumn />
      </div>
      {/* NOTE: tabIndex for main element can get by `document.activeElement` */}
      <main
        ref={setMainContainerElement}
        className="flex min-w-0 flex-1 bg-theme-background !outline-none"
        tabIndex={-1}
      >
        <Outlet />
      </main>

    </div>
  )
}
