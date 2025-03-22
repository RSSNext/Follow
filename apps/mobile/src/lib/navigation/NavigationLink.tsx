import { forwardRef } from "react"
import type { TextProps } from "react-native"
import { Text } from "react-native"
import type { StackPresentationTypes } from "react-native-screens"

import { useNavigation } from "./hooks"
import type { NavigationControllerView } from "./types"

interface NavigationLinkProps<T> extends TextProps {
  destination: NavigationControllerView<T>
  stackPresentation?: StackPresentationTypes
  props?: T
}
function NavigationLinkImpl<T>(
  { destination, children, stackPresentation = "push", props, ...rest }: NavigationLinkProps<T>,
  ref: React.Ref<Text>,
) {
  const navigation = useNavigation()

  return (
    <Text
      onPress={() => {
        if (stackPresentation === "push") {
          navigation.pushControllerView(destination, props)
        } else {
          navigation.presentControllerView(destination, props, stackPresentation)
        }
      }}
      {...rest}
      ref={ref}
    >
      {children}
    </Text>
  )
}

export const NavigationLink = forwardRef(NavigationLinkImpl) as <T>(
  props: NavigationLinkProps<T> & { ref?: React.Ref<Text> },
) => ReturnType<typeof NavigationLinkImpl>
