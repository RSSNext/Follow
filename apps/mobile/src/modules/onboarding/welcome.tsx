import { Text, View } from "react-native"

import { Logo } from "@/src/components/ui/logo"

export const StepWelcome = () => (
  <View className="flex-1 items-center justify-center">
    <Logo width={80} height={80} />
    <Text className="text-text my-4 text-3xl font-bold">Welcome to Folo!</Text>
    <Text className="text-label mb-8 px-6 text-center text-lg">
      This guide will help you get started with the app.
    </Text>
  </View>
)
