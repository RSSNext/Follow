/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-console */
import { useAtomValue, useSetAtom } from "jotai"
import { useContext, useEffect } from "react"
import { Button, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { FullWindowOverlay } from "@/src/components/common/FullWindowOverlay"
import { Grid } from "@/src/components/ui/grid"
import { BottomTabContext } from "@/src/lib/navigation/bottom-tab/BottomTabContext"
import { useTabScreenIsFocused } from "@/src/lib/navigation/bottom-tab/hooks"

import { Navigation } from "../Navigation"

export const DebugButtonGroup = () => {
  useEffect(() => {
    const disposers: (() => void)[] = []
    disposers.push(
      Navigation.rootNavigation.on("willAppear", (payload) => {
        console.log("willAppear", payload)
      }),
      Navigation.rootNavigation.on("didAppear", (payload) => {
        console.log("didAppear", payload)
      }),
      Navigation.rootNavigation.on("willDisappear", (payload) => {
        console.log("willDisappear", payload)
      }),
      Navigation.rootNavigation.on("didDisappear", (payload) => {
        console.log("didDisappear", payload)
      }),
    )
    return () => {
      disposers.forEach((disposer) => disposer())
    }
  }, [])
  return (
    <FullWindowOverlay>
      <View style={{ position: "absolute", bottom: 70, left: 0, right: 0 }}>
        <Button
          title="Push"
          onPress={() => {
            const random = Math.random()
            Navigation.rootNavigation.pushControllerView(random > 0.5 ? TestScreen : TestScreen3)
          }}
        />
        <Button
          title="formSheet"
          onPress={() => {
            const random = Math.random()
            Navigation.rootNavigation.presentControllerView(
              random > 0.5 ? TestScreen : TestScreen3,
              "formSheet",
            )
          }}
        />
        <Button
          title="Modal"
          onPress={() => {
            const random = Math.random()
            Navigation.rootNavigation.presentControllerView(random > 0.5 ? TestScreen : TestScreen3)
          }}
        />
      </View>
    </FullWindowOverlay>
  )
}

const TestScreen3 = () => {
  return (
    <View style={[{ backgroundColor: "red", flex: 1 }]}>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
      <Text className="text-white">Hello2</Text>
    </View>
  )
}

const TestTabScreen = () => {
  const isFocused = useTabScreenIsFocused()

  const insets = useSafeAreaInsets()

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ height: insets.top, backgroundColor: "red" }} />
      <ScrollView>
        {Array.from({ length: 100 }).map((_, index) => {
          return (
            <Text key={index} className="text-white">
              Hello2
            </Text>
          )
        })}
      </ScrollView>
      <Text className="text-white">
        {/* Hello {tabScreenIndex} */}

        <TouchableOpacity
          onPress={() => {
            console.log("pressed", isFocused)
          }}
        >
          <Text>Modal</Text>
        </TouchableOpacity>
      </Text>
    </View>
  )
}

const TabbarTest = () => {
  const insets = useSafeAreaInsets()
  const { currentIndexAtom, tabScreensAtom } = useContext(BottomTabContext)
  const setCurrentIndex = useSetAtom(currentIndexAtom)

  const tabScreens = useAtomValue(tabScreensAtom)
  console.log(tabScreens, "tabScreens")
  return (
    <View style={{ backgroundColor: "blue", flex: 1, paddingBottom: insets.bottom }}>
      <Grid columns={tabScreens.length} gap={10}>
        {tabScreens.map((tabScreen) => {
          return (
            <TouchableOpacity
              key={tabScreen.tabScreenIndex}
              onPress={() => {
                setCurrentIndex(tabScreen.tabScreenIndex)
              }}
            >
              <Text key={tabScreen.tabScreenIndex}>{tabScreen.title}</Text>
            </TouchableOpacity>
          )
        })}
      </Grid>
    </View>
  )
}

const TestScreen = () => {
  return (
    <ScrollView style={[{ backgroundColor: "blue", flex: 1 }]}>
      {Array.from({ length: 100 }).map((_, index) => {
        return (
          <Text key={index} className="text-white">
            Hello2
          </Text>
        )
      })}
    </ScrollView>
  )
}
