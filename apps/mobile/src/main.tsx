import { jotaiStore } from "@follow/utils"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { registerRootComponent, requireNativeModule, requireNativeView } from "expo"
import { Image } from "expo-image"
import { Provider, useAtomValue, useSetAtom } from "jotai"
import { cssInterop } from "nativewind"
import type { ReactNode } from "react"
import { useContext, useEffect, useRef, useState } from "react"
import {
  Button,
  findNodeHandle,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import {
  enableFreeze,
  FullWindowOverlay,
  Screen,
  ScreenStack,
  ScreenStackHeaderLeftView,
  ScreenStackItem,
} from "react-native-screens"

import { BottomTabs } from "./components/layouts/tabbar/BottomTabs"
import { Grid } from "./components/ui/grid"
import { CheckCircleCuteReIcon } from "./icons/check_circle_cute_re"
import { initializeApp } from "./initialize"
import { BottomTabContext } from "./lib/navigation/bottom-tab/BottomTabContext"
import { useTabScreenIsFocused } from "./lib/navigation/bottom-tab/hooks"
import { TabBarPortal } from "./lib/navigation/bottom-tab/TabBarPortal"
import { TabRoot } from "./lib/navigation/bottom-tab/TabRoot"
import { TabScreen } from "./lib/navigation/bottom-tab/TabScreen"
import { TabScreenContext } from "./lib/navigation/bottom-tab/TabScreenContext"
import { Navigation } from "./lib/navigation/Navigation"
import { RootStackNavigation } from "./lib/navigation/StackNavigation"
import { DebugButton, EnvProfileIndicator } from "./modules/debug"
import { RootProviders } from "./providers"
import { IndexTabScreen } from "./screens/(stack)/(tabs)"
import { usePrefetchSessionUser } from "./store/user/hooks"

enableFreeze(true)
cssInterop(Image, { className: "style" })

initializeApp()

registerRootComponent(() => <App4 />)

const TabModule = requireNativeModule("TabBarRoot")

const Session = () => {
  usePrefetchSessionUser()
  return null
}

const App5 = () => {
  const [tabIndex, setTabIndex] = useState(0)
  return (
    <View className="flex-1 bg-black">
      <RootProviders>
        <Session />
        <RootStackNavigation>
          <TabBarRoot
            style={StyleSheet.absoluteFill}
            onTabIndexChange={(e) => {
              setTabIndex(e.nativeEvent.index)
            }}
            selectedIndex={tabIndex}
          >
            <TabScreen style={StyleSheet.absoluteFill}>
              <IndexTabScreen />
            </TabScreen>

            <TabScreen style={StyleSheet.absoluteFill}></TabScreen>
          </TabBarRoot>
        </RootStackNavigation>
        {__DEV__ && <DebugButton />}
        <FullWindowOverlay>
          <EnvProfileIndicator />
        </FullWindowOverlay>
      </RootProviders>
    </View>
  )
}
const App4 = () => {
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
    <Provider store={jotaiStore}>
      <View style={{ flex: 1 }}>
        <RootStackNavigation
          headerConfig={{
            hidden: true,
          }}
        >
          <TabRoot>
            <TabScreen title="Test">
              <TestTabScreen />
            </TabScreen>

            <TabScreen title="Test2">
              <View style={{ flex: 1, backgroundColor: "red" }}>
                <Text>Root View 2</Text>
                <TestTabScreen />
              </View>
            </TabScreen>

            <TabBarPortal>
              <TabbarTest />
            </TabBarPortal>
          </TabRoot>
        </RootStackNavigation>
        <FullWindowOverlay>
          <View style={{ position: "absolute", bottom: 70, left: 0, right: 0 }}>
            <Button
              title="Switch Tab"
              onPress={() => {
                // const handle = findNodeHandle(tabBarRootRef.current)
                // TabModule.switchTab(handle, tabIndex === 0 ? 1 : 0)
              }}
            />
            <Button
              title="Push"
              onPress={() => {
                const random = Math.random()
                Navigation.rootNavigation.pushControllerView(
                  random > 0.5 ? TestScreen : TestScreen3,
                )
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
                Navigation.rootNavigation.presentControllerView(
                  random > 0.5 ? TestScreen : TestScreen3,
                )
              }}
            />
          </View>
        </FullWindowOverlay>
      </View>
    </Provider>
  )
}

const Stack = createNativeStackNavigator()
const App3 = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={() => {
            const navigation = useNavigation()
            return (
              <View>
                <Button
                  title="Push"
                  onPress={() => {
                    navigation.navigate("Screen2")
                  }}
                />
              </View>
            )
          }}
        />
        <Stack.Screen
          name="Screen2"
          component={TestScreen}
          options={{
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
const App2 = () => {
  const [routes, setRoutes] = useState<ReactNode[]>([])

  return (
    <>
      <ScreenStack style={StyleSheet.absoluteFill}>
        <ScreenStackItem
          headerConfig={{
            title: "Screen 1",
            children: (
              <ScreenStackHeaderLeftView>
                {/* <Text className="text-white">Back</Text> */}
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "red",
                  }}
                />
              </ScreenStackHeaderLeftView>
            ),
          }}
          screenId="screen1"
        >
          <Screen style={StyleSheet.absoluteFill}>
            <View style={{ flex: 1, backgroundColor: "gray" }}>
              <Text className="text-white">Hello</Text>
            </View>
          </Screen>
        </ScreenStackItem>

        {routes}
      </ScreenStack>

      <View style={{ position: "absolute", bottom: 40, left: 0, right: 0 }}>
        <Button
          title="Push"
          onPress={() => {
            setRoutes([
              <ScreenStackItem
                headerConfig={{
                  disableBackButtonMenu: true,
                  // children: (
                  //   <ScreenStackHeaderLeftView>
                  //     {/* <Text className="text-white">Back</Text> */}
                  //     <View
                  //       style={{
                  //         width: 40,
                  //         height: 40,
                  //         backgroundColor: "red",
                  //       }}
                  //     />
                  //   </ScreenStackHeaderLeftView>
                  // ),
                }}
                freezeOnBlur
                sheetAllowedDetents={[0.5, 0.75, 1]}
                stackPresentation="formSheet"
                sheetGrabberVisible={true}
                sheetLargestUndimmedDetentIndex={-1}
                sheetCornerRadius={-1}
                sheetExpandsWhenScrolledToEdge={true}
                sheetInitialDetentIndex={0}
                // stackPresentation="modal"
                onDisappear={() => {
                  setRoutes(routes.slice(0, -1))
                }}
                screenId="screen2"
                key={routes.length}
                style={StyleSheet.absoluteFill}
              >
                {/* <ScreenStack style={StyleSheet.absoluteFill}>
                  <ScreenStackItem screenId="screen3" style={StyleSheet.absoluteFill}>
                    <Screen style={StyleSheet.absoluteFill}>
                      <TestScreen />
                    </Screen>
                  </ScreenStackItem>
                </ScreenStack> */}
                <TestScreen />
              </ScreenStackItem>,
            ])
          }}
        />
      </View>
    </>
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

  const { tabScreenIndex } = useContext(TabScreenContext)

  console.log(tabScreenIndex, "isFocused", isFocused)
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
