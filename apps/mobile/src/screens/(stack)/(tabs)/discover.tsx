import { Stack } from "expo-router"

import { DiscoverContentSelector } from "@/src/modules/discover/content-selector"
import {
  DiscoverPageContext,
  DiscoverPageProvider,
  useDiscoverPageContext,
} from "@/src/modules/discover/ctx"
import { SearchableHeader } from "@/src/modules/discover/search"

export default function Discover() {
  return (
    <DiscoverPageProvider>
      <SearchbarMount />

      <DiscoverContentSelector />
    </DiscoverPageProvider>
  )
}

const SearchbarMount = () => {
  const ctx = useDiscoverPageContext()
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTransparent: true,

        header: () => {
          return (
            <DiscoverPageContext.Provider value={ctx}>
              <SearchableHeader />
            </DiscoverPageContext.Provider>
          )
        },
      }}
    />
  )
}
