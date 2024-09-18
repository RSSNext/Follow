import { Skeleton } from "~/components/ui/skeleton"
import { ListItem } from "~/modules/entry-column/templates/list-item-template"

import type { UniversalItemProps } from "../types"

export function ArticleItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  return (
    <ListItem entryId={entryId} entryPreview={entryPreview} translation={translation} withDetails />
  )
}

export const ArticleItemSkeleton = (
  <div className="relative h-[120px] rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative">
      <div className="group relative flex py-4 pl-3 pr-2">
        <Skeleton className="mr-2 size-5 rounded-sm" />
        <div className="-mt-0.5 flex-1 text-sm leading-tight">
          <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
            <Skeleton className="h-3 w-24" />
            <span>·</span>
            <Skeleton className="h-3 w-12 shrink-0" />
          </div>
          <div className="relative my-1 break-words font-medium">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="mt-1 h-3.5 w-3/4" />
          </div>
          <div className="mt-1.5 text-[13px] text-zinc-400 dark:text-neutral-500">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-4/5" />
          </div>
        </div>
        <Skeleton className="ml-2 size-20 overflow-hidden rounded" />
      </div>
    </div>
  </div>
)
