import { router } from "expo-router"
import { TouchableOpacity } from "react-native"

import { CloseCuteReIcon } from "@/src/icons/close_cute_re"
import { useColor } from "@/src/theme/colors"

export const ModalHeaderCloseButton = () => {
  return <ModalHeaderCloseButtonImpl />
}

const ModalHeaderCloseButtonImpl = () => {
  const label = useColor("label")
  return (
    <TouchableOpacity onPress={() => router.dismiss()}>
      <CloseCuteReIcon color={label} />
    </TouchableOpacity>
  )
}
