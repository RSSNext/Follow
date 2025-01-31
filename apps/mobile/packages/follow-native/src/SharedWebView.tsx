import { requireNativeView } from "expo"
import type * as React from "react"

const NativeView: React.ComponentType<{
  onContentHeightChange?: (e: { nativeEvent: { height: number } }) => void
}> = requireNativeView("FOSharedWebView")

export default NativeView
