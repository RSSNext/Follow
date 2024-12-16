import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation"
import { withLayoutContext } from "expo-router"

export const Tabs = withLayoutContext(createNativeBottomTabNavigator().Navigator)
