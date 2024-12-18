import * as Clipboard from "expo-clipboard"
import * as FileSystem from "expo-file-system"
import { Sitemap } from "expo-router/build/views/Sitemap"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { getDbPath } from "@/src/database"

export default function DebugPanel() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <Text className="mt-4 px-8 text-2xl font-medium text-white">Data Control</Text>
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.itemPressable}
            onPress={async () => {
              const dbPath = getDbPath()
              await FileSystem.deleteAsync(dbPath)
              // Reload the app
              await expo.reloadAppAsync("Clear Sqlite Data")
            }}
          >
            <Text style={styles.filename}>Clear Sqlite Data</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.itemPressable}
            onPress={async () => {
              const dbPath = getDbPath()
              await Clipboard.setStringAsync(dbPath)
            }}
          >
            <Text style={styles.filename}>Copy Sqlite File Location</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mt-4 px-8 text-2xl font-medium text-white">Sitemap</Text>
      <Sitemap />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: "5%", paddingVertical: 16 },
  itemContainer: {
    borderWidth: 1,
    borderColor: "#313538",
    backgroundColor: "#151718",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  itemPressable: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filename: { color: "white", fontSize: 20, marginLeft: 12 },
})
