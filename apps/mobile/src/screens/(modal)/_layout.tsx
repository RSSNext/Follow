import { Stack } from "expo-router"

import { ModalHeaderCloseButton } from "@/src/components/common/ModalSharedComponents"

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
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
        name="follow"
        options={{
          title: "Follow",
        }}
      />
      <Stack.Screen
        name="list"
        options={{
          title: "List",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forget-password"
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: ModalHeaderCloseButton,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          title: "",
          headerTransparent: true,
          headerLeft: ModalHeaderCloseButton,
        }}
      />
    </Stack>
  )
}
