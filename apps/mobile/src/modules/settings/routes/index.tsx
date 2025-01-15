import type { createNativeStackNavigator } from "@react-navigation/native-stack"

import { AccountScreen } from "./Account"

export const SettingRoutes = (Stack: ReturnType<typeof createNativeStackNavigator>) => {
  return [<Stack.Screen key="Account" name="Account" component={AccountScreen} />]
}
