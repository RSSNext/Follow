import { useContext } from "react"

import { PreviewImageContext } from "./PreviewImageContext"

export const usePreviewImage = () => {
  const context = useContext(PreviewImageContext)
  if (!context) {
    throw new Error("usePreviewImage must be used within PreviewImageProvider")
  }
  return context
}
