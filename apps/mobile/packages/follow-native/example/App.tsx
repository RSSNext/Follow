import { TableView } from "follow-native"
import { ScrollView } from "react-native"

export default function App() {
  return (
    // <ScrollView contentContainerStyle={{ flex: 1 }} contentInsetAdjustmentBehavior="automatic">
    //   <ListView
    //     items={[
    //       { id: "1", name: "Hello" },
    //       { id: "2", name: "World" },
    //     ]}
    //   />
    // </ScrollView>
    <ScrollView>
      <TableView />
    </ScrollView>
  )
}
