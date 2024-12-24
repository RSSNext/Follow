import * as Clipboard from "expo-clipboard"
import * as FileSystem from "expo-file-system"
import { Sitemap } from "expo-router/build/views/Sitemap"
import { useRef, useState } from "react"
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { getDbPath } from "@/src/database"
import { getSessionToken, setSessionToken } from "@/src/lib/cookie"

export default function DebugPanel() {
  const insets = useSafeAreaInsets()

  return (
    <ScrollView className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      <Text className="mt-4 px-8 text-2xl font-medium text-white">Users</Text>

      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <UserSessionSetting />

          <TouchableOpacity
            style={styles.itemPressable}
            onPress={async () => {
              const token = await getSessionToken()
              Alert.alert(`Current Session Token: ${token?.value}`)
            }}
          >
            <Text style={styles.filename}>Get Current Session Token</Text>
          </TouchableOpacity>
        </View>
      </View>

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

      <Text className="mt-4 px-8 text-2xl font-medium text-white">App</Text>
      <View style={styles.container}>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            style={styles.itemPressable}
            onPress={() => {
              expo.reloadAppAsync("Reload App")
            }}
          >
            <Text style={styles.filename}>Reload App</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mt-4 px-8 text-2xl font-medium text-white">Sitemap</Text>
      <Sitemap />
    </ScrollView>
  )
}

const UserSessionSetting = () => {
  const [input, setInput] = useState("")
  const inputRef = useRef<TextInput>(null)
  return (
    <Pressable
      style={styles.itemPressable}
      className="flex-row justify-between"
      onPress={() => {
        inputRef.current?.focus()
      }}
    >
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        className="w-0 flex-1 text-white"
        ref={inputRef}
        placeholder="Session Token"
        value={input}
        onChangeText={setInput}
      />
      <TouchableOpacity
        className="ml-2"
        onPress={() => {
          setSessionToken(input)
          Alert.alert("Session Token Saved")
        }}
      >
        <Text className="font-medium text-white">Save</Text>
      </TouchableOpacity>
    </Pressable>
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
