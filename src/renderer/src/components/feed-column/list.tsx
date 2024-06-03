import { useBizQuery } from "@renderer/hooks/useBizQuery"
import { levels, views } from "@renderer/lib/constants"
import { cn } from "@renderer/lib/utils"
import { Queries } from "@renderer/queries"
import { feedActions } from "@renderer/store"
import { useState } from "react"

import { FeedCategory } from "./category"

export function FeedList({
  className,
  view,
  hideTitle,
}: {
  className?: string
  view?: number
  hideTitle?: boolean
}) {
  const subscriptions = useBizQuery(Queries.subscription.byView(view))
  const [expansion, setExpansion] = useState(false)
  const { setActiveList } = feedActions

  return (
    <div className={className}>
      {!hideTitle && (
        <div
          className={cn("mb-2 flex items-center justify-between px-2.5 py-1")}
        >
          <div
            className="font-bold"
            onClick={(e) => {
              e.stopPropagation()
              view !== undefined &&
              setActiveList?.({
                level: levels.view,
                id: view,
                name: views[view].name,
                view,
              })
            }}
          >
            {view !== undefined && views[view].name}
          </div>
          <div className="ml-2 flex items-center gap-3 text-sm text-theme-vibrancyFg">
            {expansion ?
                (
                  <i
                    className="i-mingcute-list-collapse-fill"
                    onClick={() => setExpansion(false)}
                  />
                ) :
                (
                  <i
                    className="i-mingcute-list-expansion-fill"
                    onClick={() => setExpansion(true)}
                  />
                )}
            <span>{subscriptions.data?.unread}</span>
          </div>
        </div>
      )}
      {subscriptions.data?.list.map((category) => (
        <FeedCategory
          key={category.name}
          data={category}
          view={view}
          expansion={expansion}
        />
      ))}
    </div>
  )
}
