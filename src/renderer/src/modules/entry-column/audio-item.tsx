import { ListItem } from "@renderer/modules/entry-column/list-item-template"

import type { UniversalItemProps } from "./types"

export function AudioItem({
  entryId,
  entryPreview,
  translation,
}: UniversalItemProps) {
  return (
    <ListItem
      entryId={entryId}
      entryPreview={entryPreview}
      translation={translation}
      withAudio
    />
  )
}

export const AudioItemSkeleton = (
  <div className="relative mx-auto w-full max-w-lg rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative z-[1]">
      <div className="group relative flex py-4 pl-3 pr-2">
        <div className="-mt-0.5 line-clamp-4 flex-1 text-sm leading-tight">
          <div className="flex gap-1 text-[10px] font-bold text-zinc-400 dark:text-neutral-500">
            <div className="h-3 w-20 bg-gray-200 dark:bg-neutral-800" />
            <span>·</span>
            <div className="h-3 w-10 bg-gray-200 dark:bg-neutral-800" />
          </div>
          <div className="relative my-0.5 break-words font-medium">
            <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800" />
            <div className="mt-2 h-4 w-3/4 bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="relative ml-2 size-20 shrink-0">
          <div className="mr-2 size-20 shrink-0 overflow-hidden rounded-sm bg-gray-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  </div>
)
