import { useCallback } from "react"

import { PlainModal } from "../modal/stacked/custom-modal"
import { useModalStack } from "../modal/stacked/hooks"
import type { PreviewMediaProps } from "./preview-media"
import { PreviewMediaContent } from "./preview-media"

export const usePreviewMedia = () => {
  const { present } = useModalStack()
  return useCallback(
    (media: PreviewMediaProps[], initialIndex = 0) => {
      present({
        content: () => (
          <div className="relative size-full">
            <PreviewMediaContent initialIndex={initialIndex} media={media} />
          </div>
        ),
        title: "Media Preview",
        overlay: true,
        overlayOptions: {
          blur: true,
          className: "bg-black/80",
        },
        CustomModalComponent: PlainModal,
        clickOutsideToDismiss: true,
      })
    },
    [present],
  )
}
