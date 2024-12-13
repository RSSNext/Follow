import { StyleSheet, View } from "react-native"

import { AppleCuteFiIcon } from "@/src/components/icons/apple_cute_fi"

export default function Tab() {
  return (
    <View style={styles.container}>
      <AppleCuteFiIcon />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
