import { createContext } from "react"
import type { OpenPreviewParams } from "./PreviewPageProvider"

interface PreviewImageContextType {
  openPreview: (params: OpenPreviewParams) => void
}
export const PreviewImageContext = createContext<PreviewImageContextType | null>(null)
