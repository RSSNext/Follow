import { sleep } from "@follow/utils"
import * as Clipboard from "expo-clipboard"
import * as FileSystem from "expo-file-system"
import { Sitemap } from "expo-router/build/views/Sitemap"
import * as SecureStore from "expo-secure-store"
import type { FC } from "react"
import * as React from "react"
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
import { cookieKey, getCookie, sessionTokenKey, signOut } from "@/src/lib/auth"
import { loading } from "@/src/lib/loading"
import { toast } from "@/src/lib/toast"

interface MenuSection {
  title: string
  items: (MenuItem | FC)[]
}

interface MenuItem {
  title: string
  onPress: () => Promise<void> | void
  textClassName?: string
}

export default function DebugPanel() {
  const insets = useSafeAreaInsets()

  const menuSections: MenuSection[] = [
    {
      title: "Users",
      items: [
        UserSessionSetting,
        {
          title: "Get Current Session Token",
          onPress: async () => {
            const token = getCookie()
            Alert.alert(`Current Session Token: ${token}`)
          },
        },
        {
          title: "Clear Session Token",
          onPress: async () => {
            await signOut()
            Alert.alert("Session Token Cleared")
          },
        },
      ],
    },
    {
      title: "Data Control",
      items: [
        {
          title: "Copy Sqlite File Location",
          onPress: async () => {
            const dbPath = getDbPath()
            await Clipboard.setStringAsync(dbPath)
          },
        },
        {
          title: "Clear Sqlite Data",
          textClassName: "!text-red",
          onPress: async () => {
            Alert.alert("Clear Sqlite Data?", "This will delete all your data", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Clear",
                style: "destructive",
                async onPress() {
                  const dbPath = getDbPath()
                  await FileSystem.deleteAsync(dbPath)
                  await expo.reloadAppAsync("Clear Sqlite Data")
                },
              },
            ])
          },
        },
      ],
    },
    {
      title: "Debug",
      items: [
        {
          title: "Loading",
          onPress: () => {
            loading.start(sleep(2000))
          },
        },
        {
          title: "Toast",
          onPress: () => {
            toast.show({
              message: "Hello, world!".repeat(10),
              type: "success",
              variant: "center-replace",
            })
          },
        },
      ],
    },

    {
      title: "App",
      items: [
        {
          title: "Reload App",
          onPress: () => expo.reloadAppAsync("Reload App"),
        },
      ],
    },
  ]

  return (
    <ScrollView className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
      {menuSections.map((section) => (
        <View key={section.title}>
          <Text className="mt-4 px-8 text-2xl font-medium text-white">{section.title}</Text>
          <View style={styles.container}>
            <View style={styles.itemContainer}>
              {section.items.map((item, index) => {
                if (typeof item === "function") {
                  return React.createElement(item, { key: index })
                }

                return (
                  <TouchableOpacity
                    key={item.title}
                    style={styles.itemPressable}
                    onPress={item.onPress}
                  >
                    <Text style={styles.filename} className={item.textClassName}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        </View>
      ))}

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
          SecureStore.setItem(
            cookieKey,
            JSON.stringify({
              [sessionTokenKey]: {
                value: input,
              },
            }),
          )
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
