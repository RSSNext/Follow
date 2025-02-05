import { requireNativeView } from "expo"
import * as React from "react"
import { View } from "react-native"

const NativeView: React.ComponentType<{
  onContentHeightChange?: (e: { nativeEvent: { height: number } }) => void
  url: string
}> = requireNativeView("FOSharedWebView")

export function SharedWebView({ url }: { url: string }) {
  const [contentHeight, setContentHeight] = React.useState(0)

  return (
    <View style={{ height: contentHeight }}>
      <NativeView
        onContentHeightChange={(e) => {
          setContentHeight(e.nativeEvent.height)
        }}
        url={url}
      />
    </View>
  )
}
