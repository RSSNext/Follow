import { requireNativeView } from "expo"
import * as React from "react"

const NativeView: React.ComponentType = requireNativeView("FOTableView")

export default function TableView() {
  return <NativeView />
}
