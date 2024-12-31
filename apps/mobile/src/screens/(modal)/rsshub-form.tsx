import { Stack } from "expo-router"
import { View } from "react-native"

import { ModalHeaderCloseButton } from "@/src/components/common/ModalSharedComponents"

export default function RsshubForm() {
  return (
    <View>
      <Stack.Screen options={{ headerLeft: ModalHeaderCloseButton }} />
    </View>
  )
}
