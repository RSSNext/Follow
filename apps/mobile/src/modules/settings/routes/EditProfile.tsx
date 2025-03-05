import { View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { UIBarButton } from "@/src/components/ui/button/UIBarButton"
import { CheckLineIcon } from "@/src/icons/check_line"
import { useWhoami } from "@/src/store/user/hooks"

export const EditProfileScreen = () => {
  const whoami = useWhoami()

  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader headerRight={() => <RightButton />} title="Edit Profile" />

      <View className="mt-6 items-center justify-center">
        <UserAvatar
          image={whoami?.image}
          name={whoami?.name}
          size={60}
          className={!whoami?.name || !whoami.image ? "bg-system-background" : ""}
        />
      </View>
    </SafeNavigationScrollView>
  )
}

const RightButton = () => {
  return <UIBarButton label="Save" normalIcon={<CheckLineIcon />} />
}
