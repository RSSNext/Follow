import { useAtomValue } from "jotai"
import { createContext } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import {
  SafeAreaInsetsContext,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context"

import { jotaiStore, testAtom } from "~/atoms"
import ParallaxScrollView from "~/components/ParallaxScrollView"
import { ThemedText } from "~/components/ThemedText"
import { ThemedView } from "~/components/ThemedView"
import WebContainer from "~/web/Container"

export const context = createContext({ a: 2 })
export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const a = useAtomValue(testAtom, { store: jotaiStore })
  return (
    <context.Provider value={{}}>
      {/* <TouchableOpacity
        onPress={() => {
          jotaiStore.set(testAtom, 2)
        }}
      >
        <View
          style={{
            marginTop: insets.top,
          }}
        >
          <Text>123 {a}</Text>
        </View>
      </TouchableOpacity> */}
      <WebContainer />
    </context.Provider>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
})
