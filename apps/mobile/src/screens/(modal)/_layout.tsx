import { Stack } from "expo-router"

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="add"
        options={{
          title: "Add Subscription",
        }}
      />
      <Stack.Screen
        name="rsshub-form"
        options={{
          title: "RSSHub Form",
        }}
      />
      <Stack.Screen
        name="loading"
        options={{ presentation: "transparentModal", headerShown: false, animation: "fade" }}
      />
    </Stack>
  )
}
