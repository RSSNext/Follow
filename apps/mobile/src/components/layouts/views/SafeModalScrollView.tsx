/**
 * @description only for iOS modal
 *
 * ```
 * Set screen options:
 *   +  headerTransparent: true,
 *   +  headerBackground: BlurEffectWithBottomBorder,
 * ```
 */
import { useHeaderHeight } from "@react-navigation/elements"
import type { ScrollViewProps } from "react-native"
import { ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface SafeModalScrollViewProps extends ScrollViewProps {}
export const SafeModalScrollView = (props: SafeModalScrollViewProps) => {
  const headerHeight = useHeaderHeight()
  const insets = useSafeAreaInsets()
  return (
    <ScrollView
      {...props}
      scrollIndicatorInsets={{ top: headerHeight, bottom: insets.bottom }}
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: insets.bottom }}
    >
      {props.children}
    </ScrollView>
  )
}
