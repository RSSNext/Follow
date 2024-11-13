import { ActionButton } from "@follow/components/ui/button/index.js"
import { clsx, cn } from "@follow/utils/utils"
import { Slot } from "@radix-ui/react-slot"
import { AnimatePresence, m } from "framer-motion"
import { memo } from "react"

import { useUISettingKey } from "~/atoms/settings/ui"
import { HeaderTopReturnBackButton } from "~/components/mobile/button"
import { useEntryActions } from "~/hooks/biz/useEntryActions"
import { useRouteParamsSelector } from "~/hooks/biz/useRouteParams"
import { useEntry } from "~/store/entry/hooks"

import { useEntryContentScrollToTop, useEntryTitleMeta } from "./atoms"
import type { EntryHeaderProps } from "./header.shared"

function EntryHeaderImpl({ view, entryId, className }: EntryHeaderProps) {
  const entry = useEntry(entryId)

  const listId = useRouteParamsSelector((s) => s.listId)
  const { items } = useEntryActions({
    view,
    entry,
    type: "toolbar",
    inList: !!listId,
  })

  const entryTitleMeta = useEntryTitleMeta()
  const isAtTop = useEntryContentScrollToTop()

  const hideRecentReader = useUISettingKey("hideRecentReader")

  const shouldShowMeta = (hideRecentReader || !isAtTop) && !!entryTitleMeta?.title

  if (!entry?.entries) return null

  return (
    <div
      data-hide-in-print
      className={cn(
        "zen-mode-macos:ml-margin-macos-traffic-light-x relative flex min-w-0 items-center justify-between gap-3 overflow-hidden text-lg text-zinc-500 duration-200",
        shouldShowMeta && "border-border border-b",
        "pt-safe box-content",
        className,
      )}
    >
      {/* TODO */}
      {/* {!hideRecentReader && (
        <div
          className={cn(
            "absolute left-5 top-0 flex h-full items-center gap-2 text-[13px] leading-none text-zinc-500 zen-mode-macos:left-12",
            "visible z-[11]",
            views[view].wideMode && "static",
            shouldShowMeta && "hidden",
          )}
        >
          <EntryReadHistory entryId={entryId} />
        </div>
      )} */}
      <div
        className="relative z-10 flex size-full items-center justify-between gap-3"
        data-hide-in-print
      >
        <div className="pointer-events-none absolute inset-0 flex min-w-0 items-center">
          <AnimatePresence>
            {shouldShowMeta && (
              <m.div
                initial={{ opacity: 0.01, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.01, y: 30 }}
                className="text-theme-foreground pointer-events-auto flex min-w-0 shrink items-end gap-2 truncate px-1.5 pl-10 text-sm leading-tight"
              >
                <span className="min-w-0 shrink truncate font-bold">{entryTitleMeta.title}</span>
                <i className="i-mgc-line-cute-re size-[10px] shrink-0 translate-y-[-3px] rotate-[-25deg]" />
                <span className="shrink-0 truncate text-xs opacity-80">
                  {entryTitleMeta.description}
                </span>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <HeaderTopReturnBackButton className={"absolute left-0"} />
        <div className="flex-1" />

        <div
          className={clsx(
            "relative flex shrink-0 items-center justify-end gap-3",
            shouldShowMeta && "hidden",
          )}
        >
          {items
            .filter((item) => !item.hide)
            .map((item) => (
              <ActionButton
                disabled={item.disabled}
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

export const EntryHeader = memo(EntryHeaderImpl)
