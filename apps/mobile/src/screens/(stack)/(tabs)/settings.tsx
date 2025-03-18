import { useContext } from "react"
import type { ScrollView } from "react-native"
import { Text, TouchableOpacity, View } from "react-native"
import type { SharedValue } from "react-native-reanimated"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import { useSafeAreaFrame, useSafeAreaInsets } from "react-native-safe-area-context"

import { BlurEffect } from "@/src/components/common/BlurEffect"
import { useRegisterNavigationScrollView } from "@/src/components/layouts/tabbar/hooks"
import { getDefaultHeaderHeight } from "@/src/components/layouts/utils"
import { SafeNavigationScrollView } from "@/src/components/layouts/views/SafeNavigationScrollView"
import { Settings1CuteFiIcon } from "@/src/icons/settings_1_cute_fi"
import { Settings1CuteReIcon } from "@/src/icons/settings_1_cute_re"
import type { TabScreenComponent } from "@/src/lib/navigation/bottom-tab/types"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { ScreenItemContext } from "@/src/lib/navigation/ScreenItemContext"
import { EditProfileScreen } from "@/src/modules/settings/routes/EditProfile"
import { SettingsList } from "@/src/modules/settings/SettingsList"
import { UserHeaderBanner } from "@/src/modules/settings/UserHeaderBanner"
import { useWhoami } from "@/src/store/user/hooks"

export function Settings() {
  const insets = useSafeAreaInsets()

  const registerNavigationScrollView = useRegisterNavigationScrollView<ScrollView>()

  const screenContext = useContext(ScreenItemContext)

  const whoami = useWhoami()

  return (
    <>
      <SafeNavigationScrollView
        scrollEventThrottle={16}
        style={{ paddingTop: insets.top }}
        className="bg-system-grouped-background flex-1"
        contentViewClassName="-mt-24"
      >
        <UserHeaderBanner scrollY={screenContext.reAnimatedScrollY} userId={whoami?.id} />

        <SettingsList scrollRef={registerNavigationScrollView} />
      </SafeNavigationScrollView>
      <SettingHeader scrollY={screenContext.reAnimatedScrollY} />
    </>
  )
}
const SettingHeader = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const frame = useSafeAreaFrame()
  const insets = useSafeAreaInsets()
  const headerHeight = getDefaultHeaderHeight(frame, false, insets.top)
  const styles = useAnimatedStyle(() => {
    return {
      opacity: scrollY.value / 100,
      height: headerHeight,
      paddingTop: insets.top,
    }
  })

  const whoami = useWhoami()
  return (
    <View className="pt-safe absolute inset-x-0 top-0" style={{ height: headerHeight }}>
      <Animated.View
        pointerEvents="none"
        className="border-b-hairline border-opaque-separator absolute inset-x-0 top-0 flex-row items-center px-4 pb-2"
        style={styles}
      >
        <BlurEffect />
        <Text className="text-label flex-1 text-center text-[17px] font-semibold">Settings</Text>
      </Animated.View>
      {!!whoami?.id && <EditProfileButton />}
    </View>
  )
}

const EditProfileButton = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="absolute bottom-2 right-4 overflow-hidden rounded-full px-3 py-1.5"
      onPress={() => navigation.pushControllerView(EditProfileScreen)}
    >
      <BlurEffect />
      <Text className="text-label text-sm font-medium">Edit</Text>
    </TouchableOpacity>
  )
}

export const SettingsTabScreen: TabScreenComponent = Settings
SettingsTabScreen.tabBarIcon = ({ focused, color }) => {
  const Icon = !focused ? Settings1CuteReIcon : Settings1CuteFiIcon
  return <Icon color={color} width={24} height={24} />
}

SettingsTabScreen.title = "Settings"
