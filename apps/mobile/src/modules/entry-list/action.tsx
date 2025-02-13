import { Text, TouchableOpacity, View } from "react-native"

import {
  setIsLoadingArchivedEntries,
  useIsLoadingArchivedEntries,
} from "@/src/modules/screen/atoms"

export function LoadArchiveButton() {
  const isLoadingArchivedEntries = useIsLoadingArchivedEntries()
  if (isLoadingArchivedEntries) return null
  return (
    <View className="items-center pt-2">
      <TouchableOpacity
        onPress={() => {
          setIsLoadingArchivedEntries(true)
        }}
      >
        <Text className="text-label">Load archived entries</Text>
      </TouchableOpacity>
    </View>
  )
}
