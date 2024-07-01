import { m } from "@renderer/components/common/Motion"

import { RootPortal } from "../../portal"

export const ModalOverlay = ({
  onClick,
  zIndex,
}: {
  onClick?: () => void
  zIndex?: number
}) => (
  <RootPortal>
    <m.div
      id="modal-overlay"
      onClick={onClick}
      className="fixed inset-0 z-[11] bg-zinc-50/80 dark:bg-neutral-900/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex }}
    />
  </RootPortal>
)
