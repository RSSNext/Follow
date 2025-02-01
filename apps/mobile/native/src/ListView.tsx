import { requireNativeView } from "expo"
import * as React from "react"

export type ListProps = {
  items: {
    id: string
    name: string
  }[]
}
const NativeView: React.ComponentType<ListProps> = requireNativeView("FOListView")

export default function ListView(props: ListProps) {
  return <NativeView {...props} />
}
