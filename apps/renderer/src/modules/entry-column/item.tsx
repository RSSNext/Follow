import { LoadingCircle } from "@follow/components/ui/loading/index.jsx"
import type { FeedViewType } from "@follow/constants"
import { views } from "@follow/constants"
import { cn } from "@follow/utils/utils"
import type { FC } from "react"
import { memo } from "react"

import { useAuthQuery } from "~/hooks/common"
import { Queries } from "~/queries"
import type { FlatEntryModel } from "~/store/entry"
import { useEntry } from "~/store/entry/hooks"

import { ReactVirtuosoItemPlaceholder } from "../../components/ui/placeholder"
import {
  getItemComponentByView,
  getSkeletonItemComponentByView,
  getStatelessItemComponentByView,
} from "./Items"
import { EntryItemWrapper } from "./layouts/EntryItemWrapper"
import { girdClassNames } from "./styles"
import type { EntryItemStatelessProps, EntryListItemFC } from "./types"

interface EntryItemProps {
  entryId: string
  view?: number
}
function EntryItemImpl({ entry, view }: { entry: FlatEntryModel; view?: number }) {
  const translation = useAuthQuery(
    Queries.ai.translation({
      entry,
      view,
      language: entry.settings?.translation,
    }),
    {
      enabled: !!entry.settings?.translation,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      meta: {
        persist: true,
      },
    },
  )

  const Item: EntryListItemFC = getItemComponentByView(view as FeedViewType)

  return (
    <EntryItemWrapper itemClassName={Item.wrapperClassName} entry={entry} view={view}>
      <Item entryId={entry.entries.id} translation={translation.data} />
    </EntryItemWrapper>
  )
}

export const EntryItem: FC<EntryItemProps> = memo(({ entryId, view }) => {
  const entry = useEntry(entryId)
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return <EntryItemImpl entry={entry} view={view} />
})

export const EntryItemStateless: FC<EntryItemStatelessProps> = memo((props) => {
  const Item = getStatelessItemComponentByView(props.view as FeedViewType)

  return <Item {...props} />
})

const LoadingCircleFallback = (
  <div className="center mt-2">
    <LoadingCircle size="medium" />
  </div>
)

export const EntryItemSkeleton: FC<{
  view: FeedViewType
  count?: number
}> = memo(({ view, count }) => {
  const SkeletonItem = getSkeletonItemComponentByView(view)
  if (count === 1) {
    return SkeletonItem
  }

  return SkeletonItem ? (
    <div className={cn(views[view].gridMode ? girdClassNames : "flex flex-col")}>
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
      {SkeletonItem}
    </div>
  ) : (
    LoadingCircleFallback
  )
})
