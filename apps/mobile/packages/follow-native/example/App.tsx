import { SharedWebView, SharedWebViewModule } from "follow-native"
import { ScrollView, View } from "react-native"

SharedWebViewModule.preload("https://follow.is")
export default function App() {
  return (
    <ScrollView>
      <SharedWebView />

      <View style={{ height: 1000, backgroundColor: "red" }} />
    </ScrollView>
  )
}
