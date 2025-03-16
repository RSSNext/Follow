import { jotaiStore } from "@follow/utils"
import { NavigationContainer, useNavigation } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { registerRootComponent, requireNativeModule, requireNativeView } from "expo"
import { Image } from "expo-image"
import { Provider } from "jotai"
import { cssInterop } from "nativewind"
import type { ReactNode } from "react"
import { useRef, useState } from "react"
import { Button, findNodeHandle, ScrollView, StyleSheet, Text, View } from "react-native"
import {
  enableFreeze,
  FullWindowOverlay,
  Screen,
  ScreenStack,
  ScreenStackHeaderLeftView,
  ScreenStackItem,
} from "react-native-screens"

import { initializeApp } from "./initialize"
import { Navigation } from "./lib/navigation/Navigation"
import { RootStackNavigation } from "./lib/navigation/StackNavigation"

enableFreeze(true)
cssInterop(Image, { className: "style" })

initializeApp()

registerRootComponent(() => <App4 />)

const TabBarRoot = requireNativeView("TabBarRoot")
const TabScreen = requireNativeView("TabScreen")
const TabModule = requireNativeModule("TabBarRoot")
const App4 = () => {
  const tabBarRootRef = useRef<any>(null)

  const [tabIndex, setTabIndex] = useState(0)
  return (
    <Provider store={jotaiStore}>
      <View style={{ flex: 1 }}>
        <RootStackNavigation>
          <TabBarRoot
            style={StyleSheet.absoluteFill}
            ref={tabBarRootRef}
            onTabIndexChange={(e) => {
              setTabIndex(e.nativeEvent.index)
            }}
            selectedIndex={tabIndex}
          >
            <TabScreen style={StyleSheet.absoluteFill}>
              {/* <View style={{ flex: 1, backgroundColor: "blue" }}>
                <Text>Root View</Text>
              </View> */}
            </TabScreen>

            <TabScreen style={StyleSheet.absoluteFill}>
              <View style={{ flex: 1, backgroundColor: "red" }}>
                <Text>Root View 2</Text>
              </View>
            </TabScreen>
          </TabBarRoot>
        </RootStackNavigation>
        <FullWindowOverlay>
          <View style={{ position: "absolute", bottom: 70, left: 0, right: 0 }}>
            <Button
              title="Switch Tab"
              onPress={() => {
                // const handle = findNodeHandle(tabBarRootRef.current)
                // TabModule.switchTab(handle, tabIndex === 0 ? 1 : 0)

                setTabIndex(tabIndex === 0 ? 1 : 0)
              }}
            />
            <Button
              title="Push"
              onPress={() => {
                const random = Math.random()
                Navigation.getRootShared().pushControllerView(
                  random > 0.5 ? TestScreen : TestScreen3,
                )
              }}
            />
            <Button
              title="formSheet"
              onPress={() => {
                const random = Math.random()
                Navigation.getRootShared().presentControllerView(
                  random > 0.5 ? TestScreen : TestScreen3,
                  "formSheet",
                )
              }}
            />
            <Button
              title="Modal"
              onPress={() => {
                const random = Math.random()
                Navigation.getRootShared().presentControllerView(
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
