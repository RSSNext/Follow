import { Link } from "expo-router"
import { Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { List, Slider, TextField, useBinding, VStack } from "swiftui-react-native"

export default function DebugPanel() {
  const sliderValue = useBinding(0)
  const insets = useSafeAreaInsets()
  const text = useBinding("")

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <VStack alignment="leading" background="blue" padding={{ leading: 30 }}>
        <Text>Some cool text</Text>
        <TextField text={text} placeholder="Name" />
      </VStack>
      <Text>2</Text>
      <List>
        <Text>2</Text>
      </List>
      <Text>2</Text>
      <Slider value={sliderValue} range={[0, 10]} />
      <Text>2</Text>
      <VStack>
        <List style={{ backgroundColor: "red", flex: 1 }}>
          <Link asChild href={"/(stack)/feed-list"}>
            <Text>FeedList</Text>
          </Link>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          <Text>FeedList</Text>
          {/* </Link> */}
        </List>
      </VStack>
    </View>
  )
}
