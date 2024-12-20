import { Stack } from "expo-router"
import { Text } from "react-native"

export default function Add() {
  return (
    <Text>
      Add
      <Stack.Screen
        options={{
          headerBackTitle: "Back",
        }}
      />
    </Text>
  )
}
