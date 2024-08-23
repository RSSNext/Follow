import { Slot } from "@radix-ui/react-slot"
import { ActionButton } from "@renderer/components/ui/button"
import { views } from "@renderer/constants"
import { useEntryActions } from "@renderer/hooks/biz/useEntryActions"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry/hooks"
import { AnimatePresence, m } from "framer-motion"

import { useEntryContentScrollToTop, useEntryTitleMeta } from "./atoms"
import { EntryReadHistory } from "./components/EntryReadHistory"

export function EntryHeader({
  view,
  entryId,
  className,
}: {
  view: number
  entryId: string
  className?: string
}) {
  const entry = useEntry(entryId)

  const { items } = useEntryActions({
    view,
    entry,
    type: "toolbar",
  })

  const entryTitleMeta = useEntryTitleMeta()
  const isAtTop = useEntryContentScrollToTop()

  const shouldShowMeta = !isAtTop && !!entryTitleMeta?.title

  if (!entry?.entries) return null

  return (
    <div
      className={cn(
        "relative flex min-w-0 items-center justify-between gap-3 overflow-hidden text-lg text-zinc-500",
        shouldShowMeta && "border-b border-border",
        className,
      )}
    >
      <div
        className={cn(
          "invisible absolute left-5 top-0 z-0 flex h-full items-center gap-2 text-[13px] leading-none text-zinc-500",
          isAtTop && "visible z-[11]",
          views[view].wideMode && "static",
        )}
      >
        <EntryReadHistory entryId={entryId} />
      </div>
      <div className="relative z-10 flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 shrink grow">
          <AnimatePresence>
            {shouldShowMeta && (
              <m.div
                initial={{ opacity: 0.01, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.01, y: 30 }}
                className="flex min-w-0 shrink items-end gap-2 truncate text-sm leading-tight text-theme-foreground"
              >
                <span className="min-w-0 shrink truncate font-bold">
                  {entryTitleMeta.title}
                </span>
                <i className="i-mgc-line-cute-re size-[10px] shrink-0 translate-y-[-3px] rotate-[-25deg]" />
                <span className="shrink-0 truncate text-xs opacity-80">
                  {entryTitleMeta.description}
                </span>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative flex shrink-0 items-center justify-end gap-3">
          {items
            .filter((item) => !item.hide)
            .map((item) => (
              <ActionButton
                icon={
                  item.icon ? (
                    <Slot className="size-4">{item.icon}</Slot>
                  ) : (
                    <i className={item.className} />
                  )
                }
                active={item.active}
                shortcut={item.shortcut}
                onClick={item.onClick}
                tooltip={item.name}
                key={item.name}
              />
            ))}
        </div>
      </div>
    </div>
  )
}
