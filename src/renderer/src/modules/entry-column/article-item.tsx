import { ListItem } from "@renderer/modules/entry-column/list-item-template"

import type { UniversalItemProps } from "./types"

export function ArticleItem({
  entryId,
  entryPreview,
  translation,
}: UniversalItemProps) {
  return (
    <ListItem
      entryId={entryId}
      entryPreview={entryPreview}
      translation={translation}
      withDetails
    />
  )
}

export const ArticleItemSkeleton = (
  <div className="relative h-[120px] rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative z-[1]">
      <div className="group relative flex py-4 pl-3 pr-2">
        <div className="mr-2 size-5 rounded-sm bg-gray-200 dark:bg-neutral-800" />
        <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
          <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
            <div className="h-3 w-24 bg-gray-200 dark:bg-neutral-800" />
            <span>·</span>
            <div className="h-3 w-12 shrink-0 bg-gray-200 dark:bg-neutral-800" />
          </div>
          <div className="relative my-1 break-words font-medium">
            <div className="h-3.5 w-full bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-1 h-3.5 w-3/4 bg-gray-200 dark:bg-neutral-800" />
          </div>
          <div className="mt-1.5 text-[13px] text-zinc-400 dark:text-neutral-500">
            <div className="h-3 w-full bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-1 h-3 w-4/5 bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="ml-2 size-20 overflow-hidden rounded bg-gray-200 dark:bg-neutral-800" />
      </div>
    </div>
  </div>
)
