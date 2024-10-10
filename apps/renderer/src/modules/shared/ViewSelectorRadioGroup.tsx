import { forwardRef } from "react"

import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { LoadingCircle } from "~/components/ui/loading"
import { views } from "~/constants"
import { useI18n } from "~/hooks/common"
import { FeedViewType } from "~/lib/enum"
import { cn } from "~/lib/utils"
import type { FeedModel, ListModel } from "~/models"
import { useEntriesPreview } from "~/queries/entries"

import { EntryItem } from "../entry-column/item"

export const ViewSelectorRadioGroup = forwardRef<
  HTMLInputElement,
  { feed?: FeedModel } & React.InputHTMLAttributes<HTMLInputElement>
>(({ feed: feedOrList, className, value, ...rest }, ref) => {
  const t = useI18n()

  return (
    <Card>
      <CardHeader className={cn("grid grid-cols-6 space-y-0 px-2 py-3", className)}>
        {views.map((view) => (
          <div key={view.name}>
            <input
              className="peer hidden"
              type="radio"
              id={view.name}
              value={view.view}
              ref={ref}
              {...rest}
            />
            <label
              htmlFor={view.name}
              className={cn(
                "hover:text-theme-foreground dark:hover:text-white",
                view.peerClassName,
                "center flex h-10 flex-col text-xs leading-none opacity-80 duration-200",
                "text-neutral-800 dark:text-zinc-200",
                "peer-checked:opacity-100",
                "whitespace-nowrap",
              )}
            >
              <span className="text-lg">{view.icon}</span>
              {t(view.name)}
            </label>
          </div>
        ))}
      </CardHeader>
      <CardContent>
        <ViewPreview feedOrList={feedOrList} view={+(value ?? FeedViewType.Articles)} />
      </CardContent>
    </Card>
  )
})

const ViewPreview = ({
  feedOrList,
  view,
}: {
  feedOrList?: FeedModel | ListModel
  view: FeedViewType
}) => {
  const id = feedOrList?.id
  const entries = useEntriesPreview({
    id,
  })
  const { isLoading } = entries

  if (isLoading) {
    return <LoadingCircle size="large" className="center" />
  }

  return (
    <div>
      {entries.data
        ?.slice(0, 3)
        .map((entry) => <EntryItem key={entry.id} entryId={entry.id} view={view} />)}
    </div>
  )
}
