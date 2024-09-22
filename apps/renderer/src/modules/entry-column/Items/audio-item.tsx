import { Skeleton } from "~/components/ui/skeleton"
import { ListItem } from "~/modules/entry-column/templates/list-item-template"

import type { UniversalItemProps } from "../types"

export function AudioItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  return (
    <ListItem entryId={entryId} entryPreview={entryPreview} translation={translation} withAudio />
  )
}

export const AudioItemSkeleton = (
  <div className="relative mx-auto w-full max-w-lg rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative">
      <div className="group relative flex py-4 pl-3 pr-2">
        <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
          <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
            <Skeleton className="h-3 w-20" />
            <span>·</span>
            <Skeleton className="h-3 w-10 " />
          </div>
          <div className="relative my-0.5 break-words font-medium">
            <Skeleton className="h-4 w-full " />
            <Skeleton className="mt-2 h-4 w-3/4 " />
          </div>
        </div>
        <div className="relative ml-2 size-20 shrink-0">
          <Skeleton className="mr-2 size-20 shrink-0 overflow-hidden rounded-sm " />
        </div>
      </div>
    </div>
  </div>
)
