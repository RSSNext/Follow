import type { ForwardedRef } from "react"
import { forwardRef } from "react"

import { m } from "~/components/common/Motion"
import { stopPropagation } from "~/lib/dom"
import { cn } from "~/lib/utils"

import { RootPortal } from "../../portal"

export const ModalOverlay = forwardRef(
  (
    {
      zIndex,
      blur,
      className,
    }: {
      zIndex?: number
      blur?: boolean
      className?: string
    },
    ref: ForwardedRef<HTMLDivElement>,
  ) => (
    <RootPortal>
      <m.div
        ref={ref}
        id="modal-overlay"
        className={cn(
          "fixed inset-0 z-[11] rounded-[var(--fo-window-radius)] bg-zinc-50/80 dark:bg-neutral-900/80",
          blur && "backdrop-blur-sm",
          className,
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex }}
        onClick={stopPropagation}
      />
    </RootPortal>
  ),
)
