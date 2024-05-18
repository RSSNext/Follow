import { useSubscriptions } from "@renderer/lib/queries/subscriptions"
import { useState } from "react"
import { views } from "@renderer/lib/constants"
import { ActivedList } from "@renderer/lib/types"
import { cn } from "@renderer/lib/utils"
import { FeedCategory } from "./category"

export function FeedList({
  className,
  view,
  activedList,
  setActivedList,
  hideTitle,
}: {
  className?: string
  view?: number
  activedList?: ActivedList
  setActivedList?: (value: ActivedList) => void
  hideTitle?: boolean
}) {
  const subscriptions = useSubscriptions(view)
  const [expansion, setExpansion] = useState(false)

  return (
    <div className={className}>
      {!hideTitle && (
        <div
          className={cn("flex items-center justify-between mb-2 px-2.5 py-1")}
        >
          <div className="font-bold">
            {view !== undefined && views[view].name}
          </div>
          <div className="text-sm text-zinc-500 ml-2 flex items-center gap-3">
            {expansion ? (
              <i
                className="i-mingcute-list-collapse-fill"
                onClick={() => setExpansion(false)}
              />
            ) : (
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
          activedList={activedList}
          setActivedList={setActivedList}
          view={view}
          expansion={expansion}
        />
      ))}
    </div>
  )
}
