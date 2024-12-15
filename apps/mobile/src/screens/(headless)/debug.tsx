import { Link } from "expo-router"
import { List, Text } from "swiftui-react-native"

export function DebugPanel() {
  return (
    <List>
      <Link asChild href={"/(stack)/feed-list"}>
        <Text>FeedList</Text>
      </Link>
    </List>
  )
}
