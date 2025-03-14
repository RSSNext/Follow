// @see https://github.com/expo/expo/blob/main/packages/expo-router/src/layouts/TabsClient.tsx
import type {
  BottomTabNavigationEventMap,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import type { ParamListBase, TabNavigationState } from "@react-navigation/native"
import type { Href } from "expo-router"
import { Link, withLayoutContext } from "expo-router"
import * as React from "react"

// This is the only way to access the navigator.
const BottomTabNavigator = createBottomTabNavigator().Navigator

type TabsProps = BottomTabNavigationOptions & { href?: Href | null }

export const Tabs = withLayoutContext<
  TabsProps,
  typeof BottomTabNavigator,
  TabNavigationState<ParamListBase>,
  BottomTabNavigationEventMap
>(BottomTabNavigator, (screens) => {
  // Support the `href` shortcut prop.
  return screens.map((screen) => {
    if (typeof screen.options !== "function" && screen.options?.href !== undefined) {
      const { href, ...options } = screen.options

      return {
        ...screen,
        options: {
          ...options,
          tabBarItemStyle: options.tabBarItemStyle,
          tabBarButton: (props) => {
            if (href == null) {
              return null
            }

            // TODO: React Navigation types these props as Animated.WithAnimatedValue<StyleProp<ViewStyle>>
            //       While Link expects a TextStyle. We need to reconcile these types.
            return (
              <Link
                {...(props as any)}
                className="flex"
                href={href}
                asChild
                children={props.children}
              />
            )
          },
        },
      }
    }
    return screen
  })
})
