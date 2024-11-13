import { ActionButton, MotionButtonBase } from "@follow/components/ui/button/index.js"
import { RootPortal } from "@follow/components/ui/portal/index.js"
import { clsx, cn } from "@follow/utils/utils"
import { DismissableLayer } from "@radix-ui/react-dismissable-layer"
import { Slot } from "@radix-ui/react-slot"
import { AnimatePresence, m } from "framer-motion"
import { memo, useState } from "react"
import { RemoveScroll } from "react-remove-scroll"

import { useUISettingKey } from "~/atoms/settings/ui"
import { HeaderTopReturnBackButton } from "~/components/mobile/button"
import type { EntryActionItem } from "~/hooks/biz/useEntryActions"
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
        "relative flex min-w-0 items-center justify-between gap-3 overflow-hidden text-lg text-zinc-500 duration-200 zen-mode-macos:ml-margin-macos-traffic-light-x",
        shouldShowMeta && "border-b border-border",
        "box-content h-14 pt-safe",
        className,
      )}
    >
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
                className="pointer-events-auto flex min-w-0 shrink items-end gap-2 truncate px-1.5 pl-10 text-sm leading-tight text-theme-foreground"
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
        <HeaderRightActions actions={items} className={!shouldShowMeta ? "hidden" : ""} />
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

const HeaderRightActions = ({
  className,
  actions,
}: {
  className?: string
  actions: EntryActionItem[]
}) => {
  const [open, setOpen] = useState(true)
  return (
    <div className={clsx(className, "absolute right-0")}>
      <MotionButtonBase className="center size-8" onClick={() => setOpen((v) => !v)}>
        <i className="i-mingcute-more-1-fill size-6" />
      </MotionButtonBase>

      <RootPortal>
        <AnimatePresence>
          {open && (
            <RemoveScroll>
              <DismissableLayer disableOutsidePointerEvents onDismiss={() => setOpen(false)}>
                <m.div
                  initial={{
                    scale: 0.8,
                    opacity: 0,
                    transformOrigin: "top right",
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: 0.8,
                    opacity: 0,
                    transformOrigin: "top right",
                  }}
                  transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 300,
                    mass: 0.8,
                  }}
                  className="shadow-modal fixed right-1 top-1 z-[1] mt-14 max-w-full rounded-lg border bg-theme-modal-background-opaque"
                >
                  <div className="flex flex-col items-center py-2">
                    {actions
                      .filter((item) => !item.hide)
                      .map((item) => (
                        <MotionButtonBase
                          onClick={(e) => {
                            setOpen(false)
                            item.onClick?.(e)
                          }}
                          key={item.name}
                          layout={false}
                          className="flex w-full items-center gap-2 px-4 py-2"
                        >
                          {item.icon || <i className={item.className} />}
                          {item.name}
                        </MotionButtonBase>
                      ))}
                  </div>
                </m.div>
              </DismissableLayer>
            </RemoveScroll>
          )}
        </AnimatePresence>
      </RootPortal>
    </div>
  )
}
