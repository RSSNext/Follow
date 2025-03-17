import { requireNativeView } from "expo"
import type { ViewProps } from "react-native"
import { StyleSheet } from "react-native"

const TabBarPortalNative = requireNativeView<ViewProps>("TabBarPortal")

export const TabBarPortal = ({ children }: { children: React.ReactNode }) => {
  return <TabBarPortalNative style={styles.container}>{children}</TabBarPortalNative>
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
})
