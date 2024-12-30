import { Stack } from "expo-router"

import { DiscoverContentSelector } from "@/src/modules/discover/content-selector"
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

      <DiscoverContentSelector />
    </>
  )
}
