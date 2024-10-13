import * as Dialog from "@radix-ui/react-dialog"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

import { m } from "~/components/common/Motion"
import { cn } from "~/lib/utils"

import { softSpringPreset } from "../../constants/spring"

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
    <Dialog.Overlay asChild>
      <m.div
        ref={ref}
        id="modal-overlay"
        className={cn(
          // NOTE: pointer-events-none is required, if remove this, when modal is closing, you can not click element behind the modal
          "!pointer-events-none fixed inset-0 rounded-[var(--fo-window-radius)] bg-zinc-50/80 dark:bg-neutral-900/80",
          blur && "backdrop-blur-sm",
          className,
        )}
        transition={softSpringPreset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex }}
      />
    </Dialog.Overlay>
  ),
)
