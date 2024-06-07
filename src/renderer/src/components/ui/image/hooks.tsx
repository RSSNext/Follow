import { m } from "framer-motion"
import { useCallback } from "react"

import { useModalStack } from "../modal/stacked/hooks"
import { PreviewImageContent } from "./preview-image"

export const usePreviewImages = () => {
  const { present } = useModalStack()
  return useCallback(
    (images: string[], initialIndex = 0) => {
      present({
        content: () => (
          <m.div
            className="relative size-full"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PreviewImageContent initialIndex={initialIndex} images={images} />
          </m.div>
        ),
        title: "Image",

        CustomModalComponent: ({ children }) => children,
        clickOutsideToDismiss: true,
      })
    },
    [present],
  )
}
