import { sql } from "drizzle-orm"
import { Sitemap } from "expo-router/build/views/Sitemap"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { db } from "@/src/database"

export default function DebugPanel() {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <Text className="mt-4 px-8 text-2xl font-medium text-white">Data Control</Text>
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.itemPressable}
            onPress={() => {
              const query = sql`DROP TABLE IF EXISTS feeds;`
              db.transaction((tx) => {
                tx.run(query)
              })
            }}
          >
            <Text style={styles.filename}>Clear Sqlite Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mt-4 px-8 text-2xl font-medium text-white">Sitemap</Text>
      <Sitemap />
    </View>
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
