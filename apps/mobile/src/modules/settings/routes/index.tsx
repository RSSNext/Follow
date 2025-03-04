import type { TypedNavigator } from "@react-navigation/native"

import { AboutScreen } from "./About"
import { AccountScreen } from "./Account"
import { AchievementScreen } from "./Achievement"
import { ActionsScreen } from "./Actions"
import { AppearanceScreen } from "./Appearance"
import { DataScreen } from "./Data"
import { FeedsScreen } from "./Feeds"
import { GeneralScreen } from "./General"
import { ListsScreen } from "./Lists"
import { ManageListScreen } from "./ManageList"
import { NotificationsScreen } from "./Notifications"
import { PrivacyScreen } from "./Privacy"

export const SettingRoutes = (Stack: TypedNavigator<any, any>) => {
  return [
    // <Stack.Screen key="Profile" name="Profile" component={ProfileScreen} />,
    <Stack.Screen key="Achievement" name="Achievement" component={AchievementScreen} />,
    <Stack.Screen key="General" name="General" component={GeneralScreen} />,
    <Stack.Screen key="Notifications" name="Notifications" component={NotificationsScreen} />,
    <Stack.Screen key="Appearance" name="Appearance" component={AppearanceScreen} />,
    <Stack.Screen key="Data" name="Data" component={DataScreen} />,
    <Stack.Screen key="Account" name="Account" component={AccountScreen} />,
    <Stack.Screen key="Actions" name="Actions" component={ActionsScreen} />,
    <Stack.Screen key="Lists" name="Lists" component={ListsScreen} />,
    <Stack.Screen key="Feeds" name="Feeds" component={FeedsScreen} />,
    <Stack.Screen key="Privacy" name="Privacy" component={PrivacyScreen} />,
    <Stack.Screen key="About" name="About" component={AboutScreen} />,
    // @ts-expect-error
    <Stack.Screen key="ManageList" name="ManageList" component={ManageListScreen} />,
  ]
}
