import { Link } from "expo-router"
import { TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { useWhoami } from "@/src/store/user/hooks"
import { accentColor } from "@/src/theme/colors"

const useActionPadding = () => {
  const insets = useSafeAreaInsets()
  return { paddingLeft: insets.left + 12, paddingRight: insets.right + 12 }
}

export function HomeLeftAction() {
  const insets = useActionPadding()
  const user = useWhoami()
  if (!user) return null
  return (
    <TouchableOpacity className="flex-row items-center" style={{ paddingLeft: insets.paddingLeft }}>
      <UserAvatar image={user.image} name={user.name!} size={28} />
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
