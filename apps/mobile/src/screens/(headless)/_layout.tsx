import { Stack } from "expo-router"

export default function HeadlessLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#000" },
        headerShown: false,
      }}
    />
  )
}
