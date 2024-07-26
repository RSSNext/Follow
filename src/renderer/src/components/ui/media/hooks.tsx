import { useCallback } from "react"
import type { MediaModel } from "src/hono"

import { useModalStack } from "../modal/stacked/hooks"
import { NoopChildren } from "../modal/stacked/utils"
import { PreviewMediaContent } from "./preview-media"

export const usePreviewMedia = () => {
  const { present } = useModalStack()
  return useCallback(
    (media: MediaModel[], initialIndex = 0) => {
      present({
        content: () => (
          <div className="relative size-full">
            <PreviewMediaContent initialIndex={initialIndex} media={media} />
          </div>
        ),
        title: "Image",
        overlay: true,
        CustomModalComponent: NoopChildren,
        clickOutsideToDismiss: true,
      })
    },
    [present],
  )
}
