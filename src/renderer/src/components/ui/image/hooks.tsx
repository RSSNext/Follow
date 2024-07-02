import { useCallback } from "react"

import { useModalStack } from "../modal/stacked/hooks"
import { NoopChildren } from "../modal/stacked/utils"
import { PreviewImageContent } from "./preview-image"

export const usePreviewImages = () => {
  const { present } = useModalStack()
  return useCallback(
    (images: string[], initialIndex = 0) => {
      present({
        content: () => (
          <div className="relative size-full">
            <PreviewImageContent initialIndex={initialIndex} images={images} />
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
