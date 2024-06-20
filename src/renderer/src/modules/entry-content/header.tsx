import { ActionButton } from "@renderer/components/ui/button"
import { useEntryActions } from "@renderer/hooks"
import { shortcuts } from "@renderer/lib/shortcuts"
import { cn } from "@renderer/lib/utils"
import { useEntry } from "@renderer/store/entry/hooks"
import { AnimatePresence, m } from "framer-motion"
import { useHotkeys } from "react-hotkeys-hook"

import { useEntryTitleMeta } from "./atoms"

export function EntryHeader({
  view,
  entryId,
}: {
  view: number
  entryId: string
}) {
  const entry = useEntry(entryId)

  const { items } = useEntryActions({
    view,
    entry,
  })

  // useHotkeys(shortcuts.entry.toggleRead.key, () => {
  //   const key = entry?.read ? "unread" : "read"
  //   items.find((item) => item.key === key)?.onClick()
  // }, { scopes: ["home"] })

  useHotkeys(shortcuts.entry.toggleStarred.key, () => {
    const key = entry?.collections ? "unstar" : "star"
    items.find((item) => item.key === key)?.onClick()
  }, { scopes: ["home"] })

  useHotkeys(shortcuts.entry.openInBrowser.key, () => {
    items.find((item) => item.key === "openInBrowser")?.onClick()
  }, { scopes: ["home"] })

  const entryTitleMeta = useEntryTitleMeta()
  if (!entry?.entries.url) return null

  return (
    <div
      className={cn(
        "flex h-[55px] min-w-0 items-center justify-between gap-3 overflow-hidden px-5 text-lg text-zinc-500",
        entryTitleMeta && "border-b border-border",
      )}
    >
      <div className="flex min-w-0 shrink">
        <AnimatePresence>
          {entryTitleMeta && (
            <m.div
              initial={{ opacity: 0.01, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.01, y: 30 }}
              className="flex min-w-0 shrink items-end gap-2 truncate text-sm leading-tight text-theme-foreground"
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
      <div className="flex items-center gap-3">
        {items
          .filter((item) => !item.disabled)
          .map((item) => (
            <ActionButton
              icon={
                item.icon ? (
                  <img className="size-4 grayscale" src={item.icon} />
                ) : (
                  <i className={item.className} />
                )
              }
              shortcut={item.shortcut}
              onClick={item.onClick}
              tooltip={item.name}
              key={item.name}
            />
          ))}
      </div>
    </div>
  )
}
