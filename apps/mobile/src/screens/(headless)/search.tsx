import { Stack } from "expo-router"
import { Text, View } from "react-native"

import {
  DiscoverPageContext,
  DiscoverPageProvider,
  useDiscoverPageContext,
} from "@/src/modules/discover/ctx"
import { SearchHeader } from "@/src/modules/discover/search"

const Search = () => {
  return (
    <View>
      <DiscoverPageProvider>
        <SearchbarMount />
        <Text>Search</Text>
      </DiscoverPageProvider>
    </View>
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
              <SearchHeader />
            </DiscoverPageContext.Provider>
          )
        },
      }}
    />
  )
}

export default Search
