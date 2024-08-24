import { m } from "@renderer/components/common/Motion"
import { cn } from "@renderer/lib/utils"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

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
          "pointer-events-none fixed inset-0 z-[11] rounded-[var(--fo-window-radius)] bg-zinc-50/80 dark:bg-neutral-900/80",
          blur && "backdrop-blur-sm",
          className,
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0 } }}
        style={{ zIndex }}
      />
    </RootPortal>
  ),
)
