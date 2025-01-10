import { Stack } from "expo-router"

import { Recommendations } from "@/src/modules/discover/Recommendations"
import { DiscoverHeader } from "@/src/modules/discover/search"

export default function Discover() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,

          header: DiscoverHeader,
        }}
      />

      <Recommendations />
    </>
  )
}
