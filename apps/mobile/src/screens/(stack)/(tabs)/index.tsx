import { useEffect } from "react"

import { prepareEntryRenderWebView } from "@/src/components/native/webview"
import { Home5CuteFiIcon } from "@/src/icons/home_5_cute_fi"
import { Home5CuteReIcon } from "@/src/icons/home_5_cute_re"
import type { TabScreenComponent } from "@/src/lib/navigation/bottom-tab/types"
import { EntryList } from "@/src/modules/entry-list"

export const IndexTabScreen: TabScreenComponent = () => {
  useEffect(() => {
    prepareEntryRenderWebView()
  }, [])

  return <EntryList />
}

IndexTabScreen.tabBarIcon = ({ focused, color }) => {
  const Icon = !focused ? Home5CuteReIcon : Home5CuteFiIcon
  return <Icon color={color} width={24} height={24} />
}

IndexTabScreen.title = "Home"
