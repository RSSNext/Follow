import { SharedWebView, SharedWebViewModule } from "follow-native"
import { useState } from "react"
import { ScrollView, View } from "react-native"

SharedWebViewModule.preload("https://follow.is")
export default function App() {
  const [contentHeight, setContentHeight] = useState(0)

  return (
    <ScrollView>
      <View style={{ height: contentHeight }}>
        <SharedWebView
          onContentHeightChange={(e) => {
            setContentHeight(e.nativeEvent.height)
          }}
        />
      </View>

      <View style={{ height: 1000, backgroundColor: "red" }} />
    </ScrollView>
  )
}
