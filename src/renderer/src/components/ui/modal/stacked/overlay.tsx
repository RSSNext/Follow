import { useUIStore } from "@renderer/store"
import { m } from "framer-motion"

import { RootPortal } from "../../portal"

export const ModalOverlay = ({
  onClick,
  zIndex,
}: {
  onClick?: () => void
  zIndex?: number
}) => {
  const modalSettingOverlay = useUIStore((state) => state.modalOverlay)
  if (!modalSettingOverlay) return null
  return (
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
}
