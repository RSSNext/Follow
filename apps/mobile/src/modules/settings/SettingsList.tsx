import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs"
import { useIsFocused } from "@react-navigation/native"
import type { FC, RefObject } from "react"
import { useContext, useEffect } from "react"
import type { ScrollView } from "react-native"
import { View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
} from "@/src/components/ui/grouped/GroupedList"
import { SetBottomTabBarVisibleContext } from "@/src/contexts/BottomTabBarVisibleContext"
import { BellRingingCuteFiIcon } from "@/src/icons/bell_ringing_cute_fi"
import { CertificateCuteFiIcon } from "@/src/icons/certificate_cute_fi"
import { DatabaseIcon } from "@/src/icons/database"
import { Magic2CuteFiIcon } from "@/src/icons/magic_2_cute_fi"
import { PaletteCuteFiIcon } from "@/src/icons/palette_cute_fi"
import { RadaCuteFiIcon } from "@/src/icons/rada_cute_fi"
import { SafeLockFilledIcon } from "@/src/icons/safe_lock_filled"
import { Settings7CuteFiIcon } from "@/src/icons/settings_7_cute_fi"
import { StarCuteFiIcon } from "@/src/icons/star_cute_fi"
import { TrophyCuteFiIcon } from "@/src/icons/trophy_cute_fi"
import { User3CuteFiIcon } from "@/src/icons/user_3_cute_fi"

import { useSettingsNavigation } from "./hooks"
import { SettingNavigationLinkIcon } from "./SettingNavigationLink"

interface GroupNavigationLink {
  label: string
  icon: React.ElementType
  onPress: (
    navigation: ReturnType<typeof useSettingsNavigation>,
    scrollRef: RefObject<ScrollView>,
  ) => void
  iconBackgroundColor: string
}
const UserGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "Profile",
    icon: User3CuteFiIcon,
    onPress: (navigation, scrollRef) => {
      scrollRef.current?.scrollTo({ y: 0, animated: true })
      setTimeout(() => {
        navigation.navigate("Profile")
      }, 100)
    },
    iconBackgroundColor: "#4F46E5",
  },
  {
    label: "Achievement",
    icon: TrophyCuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("Achievement")
    },
    iconBackgroundColor: "#6366F1",
  },
]

const SettingGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "General",
    icon: Settings7CuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("General")
    },
    iconBackgroundColor: "#F59E0B",
  },
  {
    label: "Notifications",
    icon: BellRingingCuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("Notifications")
    },
    iconBackgroundColor: "#FBBF24",
  },
  {
    label: "Appearance",
    icon: PaletteCuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("Appearance")
    },
    iconBackgroundColor: "#FCD34D",
  },
  {
    label: "Data",
    icon: DatabaseIcon,
    onPress: (navigation) => {
      navigation.navigate("Data")
    },
    iconBackgroundColor: "#F59E0B",
  },
]

const DataGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "Actions",
    icon: Magic2CuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("Actions")
    },
    iconBackgroundColor: "#059669",
  },
  {
    label: "Lists",
    icon: RadaCuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("Lists")
    },
    iconBackgroundColor: "#10B981",
  },
  {
    label: "Feeds",
    icon: CertificateCuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("Feeds")
    },
    iconBackgroundColor: "#34D399",
  },
]

const PrivacyGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "Privacy",
    icon: SafeLockFilledIcon,
    onPress: (navigation) => {
      navigation.navigate("Privacy")
    },
    iconBackgroundColor: "#EF4444",
  },
  {
    label: "About",
    icon: StarCuteFiIcon,
    onPress: (navigation) => {
      navigation.navigate("About")
    },
    iconBackgroundColor: "#F87181",
  },
]

export const SettingsList: FC<{ scrollRef: RefObject<ScrollView> }> = ({ scrollRef }) => {
  const navigation = useSettingsNavigation()

  const setTabBarVisible = useContext(SetBottomTabBarVisibleContext)
  const isVisible = useIsFocused()
  useEffect(() => {
    if (isVisible) {
      setTabBarVisible(true)
    }
  }, [isVisible, setTabBarVisible])

  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()
  return (
    <View
      className="bg-system-grouped-background flex-1 py-4"
      style={{ paddingBottom: insets.bottom + tabBarHeight }}
    >
      <GroupedInsetListCard>
        {UserGroupNavigationLinks.map((link) => (
          <GroupedInsetListNavigationLink
            key={link.label}
            label={link.label}
            icon={
              <SettingNavigationLinkIcon backgroundColor={link.iconBackgroundColor}>
                <link.icon height={18} width={18} color="#fff" />
              </SettingNavigationLinkIcon>
            }
            onPress={() => link.onPress(navigation, scrollRef)}
          />
        ))}
      </GroupedInsetListCard>

      <View className="h-8" />
      <GroupedInsetListCard>
        {DataGroupNavigationLinks.map((link) => (
          <GroupedInsetListNavigationLink
            key={link.label}
            label={link.label}
            icon={
              <SettingNavigationLinkIcon backgroundColor={link.iconBackgroundColor}>
                <link.icon height={18} width={18} color="#fff" />
              </SettingNavigationLinkIcon>
            }
            onPress={() => link.onPress(navigation, scrollRef)}
          />
        ))}
      </GroupedInsetListCard>
      <View className="h-8" />

      <GroupedInsetListCard>
        {SettingGroupNavigationLinks.map((link) => (
          <GroupedInsetListNavigationLink
            key={link.label}
            label={link.label}
            icon={
              <SettingNavigationLinkIcon backgroundColor={link.iconBackgroundColor}>
                <link.icon height={18} width={18} color="#fff" />
              </SettingNavigationLinkIcon>
            }
            onPress={() => link.onPress(navigation, scrollRef)}
          />
        ))}
      </GroupedInsetListCard>

      <View className="h-8" />
      <GroupedInsetListCard>
        {PrivacyGroupNavigationLinks.map((link) => (
          <GroupedInsetListNavigationLink
            key={link.label}
            label={link.label}
            icon={
              <SettingNavigationLinkIcon backgroundColor={link.iconBackgroundColor}>
                <link.icon height={18} width={18} color="#fff" />
              </SettingNavigationLinkIcon>
            }
            onPress={() => link.onPress(navigation, scrollRef)}
          />
        ))}
      </GroupedInsetListCard>
    </View>
  )
}
