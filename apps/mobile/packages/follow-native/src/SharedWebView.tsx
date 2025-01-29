import { requireNativeView } from "expo"
import * as React from "react"

const NativeView: React.ComponentType = requireNativeView("FOSharedWebView")

export default function SharedWebView() {
  return <NativeView />
}
