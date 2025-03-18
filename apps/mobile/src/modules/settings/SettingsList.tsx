import * as FileSystem from "expo-file-system"
import type { FC, RefObject } from "react"
import { Fragment, useMemo } from "react"
import type { ScrollView } from "react-native"
import { Alert, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useBottomTabBarHeight } from "@/src/components/layouts/tabbar/hooks"
import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
  GroupedInsetListNavigationLinkIcon,
} from "@/src/components/ui/grouped/GroupedList"
import { getDbPath } from "@/src/database"
import { BellRingingCuteFiIcon } from "@/src/icons/bell_ringing_cute_fi"
import { CertificateCuteFiIcon } from "@/src/icons/certificate_cute_fi"
import { DatabaseIcon } from "@/src/icons/database"
import { ExitCuteFiIcon } from "@/src/icons/exit_cute_fi"
import { Magic2CuteFiIcon } from "@/src/icons/magic_2_cute_fi"
import { PaletteCuteFiIcon } from "@/src/icons/palette_cute_fi"
import { RadaCuteFiIcon } from "@/src/icons/rada_cute_fi"
import { SafeLockFilledIcon } from "@/src/icons/safe_lock_filled"
import { Settings1CuteFiIcon } from "@/src/icons/settings_1_cute_fi"
import { StarCuteFiIcon } from "@/src/icons/star_cute_fi"
import { UserSettingCuteFiIcon } from "@/src/icons/user_setting_cute_fi"
import { signOut } from "@/src/lib/auth"
import { useNavigation } from "@/src/lib/navigation/hooks"
import type { Navigation } from "@/src/lib/navigation/Navigation"
import { useWhoami } from "@/src/store/user/hooks"

import { AboutScreen } from "./routes/About"
import { AccountScreen } from "./routes/Account"
import { ActionsScreen } from "./routes/Actions"
import { AppearanceScreen } from "./routes/Appearance"
import { DataScreen } from "./routes/Data"
import { FeedsScreen } from "./routes/Feeds"
import { GeneralScreen } from "./routes/General"
import { ListsScreen } from "./routes/Lists"
import { NotificationsScreen } from "./routes/Notifications"
import { PrivacyScreen } from "./routes/Privacy"

interface GroupNavigationLink {
  label: string
  icon: React.ElementType
  onPress: (navigation: Navigation, scrollRef: RefObject<ScrollView>) => void
  iconBackgroundColor: string

  anonymous?: boolean
  todo?: boolean
}
const SettingGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "General",
    icon: Settings1CuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(GeneralScreen)
    },
    iconBackgroundColor: "#F59E0B",
  },
  {
    label: "Notifications",
    icon: BellRingingCuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(NotificationsScreen)
    },
    iconBackgroundColor: "#FBBF24",
    todo: true,
    anonymous: false,
  },
  {
    label: "Appearance",
    icon: PaletteCuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(AppearanceScreen)
    },
    iconBackgroundColor: "#FCD34D",
  },
  {
    label: "Data",
    icon: DatabaseIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(DataScreen)
    },
    iconBackgroundColor: "#CBAD6D",
    anonymous: false,
  },
  {
    label: "Account",
    icon: UserSettingCuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(AccountScreen)
    },
    iconBackgroundColor: "#d08700",
    anonymous: false,
  },
]

const DataGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "Actions",
    icon: Magic2CuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(ActionsScreen)
    },
    iconBackgroundColor: "#059669",
    anonymous: false,
  },

  {
    label: "Feeds",
    icon: CertificateCuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(FeedsScreen)
    },
    iconBackgroundColor: "#10B981",
    todo: true,
    anonymous: false,
  },
  {
    label: "Lists",
    icon: RadaCuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(ListsScreen)
    },
    iconBackgroundColor: "#34D399",
    // todo: true,
    anonymous: false,
  },
]

const PrivacyGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "Privacy",
    icon: SafeLockFilledIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(PrivacyScreen)
    },
    iconBackgroundColor: "#EF4444",
  },
  {
    label: "About",
    icon: StarCuteFiIcon,
    onPress: (navigation) => {
      navigation.pushControllerView(AboutScreen)
    },
    iconBackgroundColor: "#F87181",
  },
]

const ActionGroupNavigationLinks: GroupNavigationLink[] = [
  {
    label: "Sign out",
    icon: ExitCuteFiIcon,
    onPress: () => {
      Alert.alert("Sign out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: async () => {
            // sign out
            await signOut()
            const dbPath = getDbPath()
            await FileSystem.deleteAsync(dbPath)
            await expo.reloadAppAsync("User sign out")
          },
        },
      ])
    },
    iconBackgroundColor: "#F87181",
    anonymous: false,
  },
]

const NavigationLinkGroup: FC<{
  links: GroupNavigationLink[]
  scrollRef: RefObject<ScrollView>
}> = ({ links, scrollRef }) => {
  const navigation = useNavigation()
  return (
    <GroupedInsetListCard>
      {links.map((link) => {
        if (link.todo) {
          return null
        }
        return (
          <GroupedInsetListNavigationLink
            key={link.label}
            label={link.label}
            icon={
              <GroupedInsetListNavigationLinkIcon backgroundColor={link.iconBackgroundColor}>
                <link.icon height={18} width={18} color="#fff" />
              </GroupedInsetListNavigationLinkIcon>
            }
            onPress={() => {
              link.onPress(navigation, scrollRef)
            }}
          />
        )
      })}
    </GroupedInsetListCard>
  )
}

const navigationGroups = [
  DataGroupNavigationLinks,
  SettingGroupNavigationLinks,
  PrivacyGroupNavigationLinks,
  ActionGroupNavigationLinks,
] as const

export const SettingsList: FC<{ scrollRef: RefObject<ScrollView> }> = ({ scrollRef }) => {
  const insets = useSafeAreaInsets()
  const tabBarHeight = useBottomTabBarHeight()

  const whoami = useWhoami()

  const filteredNavigationGroups = useMemo(() => {
    if (whoami) return navigationGroups

    return navigationGroups
      .map((group) => {
        const filteredGroup = group.filter((link) => link.anonymous !== false)
        if (filteredGroup.length === 0) return false
        return filteredGroup
      })
      .filter((group) => group !== false)
  }, [whoami])
  return (
    <View
      className="bg-system-grouped-background flex-1 py-4"
      style={{ paddingBottom: insets.bottom + tabBarHeight }}
    >
      {filteredNavigationGroups.map((group, index) => (
        <Fragment key={`nav-group-${index}`}>
          <NavigationLinkGroup key={`nav-group-${index}`} links={group} scrollRef={scrollRef} />
          {index < filteredNavigationGroups.length - 1 && <View className="h-8" />}
        </Fragment>
      ))}
    </View>
  )
}
