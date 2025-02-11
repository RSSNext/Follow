import { Link } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { LayoutLeftbarOpenCuteReIcon } from "@/src/icons/layout_leftbar_open_cute_re"
import { accentColor } from "@/src/theme/colors"

import {
  setIsLoadingArchivedEntries,
  useFeedDrawer,
  useIsLoadingArchivedEntries,
} from "../feed-drawer/atoms"

const useActionPadding = () => {
  const insets = useSafeAreaInsets()
  return { paddingLeft: insets.left + 12, paddingRight: insets.right + 12 }
}

export function HomeLeftAction() {
  const { openDrawer } = useFeedDrawer()

  const insets = useActionPadding()

  return (
    <TouchableOpacity
      onPress={openDrawer}
      className="flex-row items-center"
      style={{ paddingLeft: insets.paddingLeft }}
    >
      <LayoutLeftbarOpenCuteReIcon color={accentColor} />
    </TouchableOpacity>
  )
}

export function HomeRightAction() {
  const insets = useActionPadding()

  return (
    <View className="flex-row items-center" style={{ paddingRight: insets.paddingRight }}>
      <Link asChild href="/add">
        <TouchableOpacity className="size-6">
          <AddCuteReIcon color={accentColor} />
        </TouchableOpacity>
      </Link>
    </View>
  )
}

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
