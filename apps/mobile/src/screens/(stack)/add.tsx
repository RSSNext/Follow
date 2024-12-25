import { router, Stack } from "expo-router"
import { useState } from "react"
import { Text, TextInput, TouchableOpacity, View } from "react-native"

import { CloseCuteReIcon } from "@/src/icons/close_cute_re"
import { Search2CuteReIcon } from "@/src/icons/search_2_cute_re"
import { useColor } from "@/src/theme/colors"

export default function Add() {
  const [url, setUrl] = useState("")

  const label = useColor("label")
  const disabled = useColor("disabled")
  return (
    <View>
      <Stack.Screen
        options={{
          gestureEnabled: !url,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.dismiss()}>
              <CloseCuteReIcon color={label} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                if (!url) return

                //  TODO impl search
              }}
            >
              <Search2CuteReIcon color={!url ? disabled : label} />
            </TouchableOpacity>
          ),
        }}
      />
      <View className="mx-3 mt-6">
        <Text className="text-label mb-1 ml-3 text-base font-medium">Feed URL</Text>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Enter the URL of the feed"
          autoFocus
          className="bg-system-background text-text rounded-xl p-3"
        />
      </View>
    </View>
  )
}
