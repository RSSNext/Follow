import { Stack } from "expo-router"

import { ModalHeaderCloseButton } from "@/src/components/common/ModalSharedComponents"

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="add"
        options={{
          title: "Add Subscription",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="rsshub-form"
        options={{
          title: "RSSHub Form",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="follow"
        options={{
          title: "Folo",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="list"
        options={{
          title: "List",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profile",
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="forget-password"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          presentation: "modal",
          headerLeft: ModalHeaderCloseButton,
        }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          presentation: "modal",
          headerLeft: ModalHeaderCloseButton,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerLeft: ModalHeaderCloseButton,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="2fa"
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerLeft: ModalHeaderCloseButton,
          presentation: "modal",
        }}
      />
    </Stack>
  )
}
