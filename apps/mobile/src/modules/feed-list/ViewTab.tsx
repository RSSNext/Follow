import { useHeaderHeight } from "@react-navigation/elements"
import { useAtom } from "jotai"
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native"

import { ThemedBlurView } from "@/src/components/common/ThemedBlurView"
import { bottomViewTabHeight } from "@/src/constants/ui"
import { views } from "@/src/constants/views"

import { viewAtom } from "./atoms"

export const ViewTab = () => {
  const headerHeight = useHeaderHeight()
  const paddingHorizontal = 6
  const [currentView, setCurrentView] = useAtom(viewAtom)

  return (
    <ThemedBlurView
      style={[
        styles.tabContainer,
        {
          backgroundColor: "transparent",
          top: headerHeight - StyleSheet.hairlineWidth,
        },
      ]}
      className="border-system-fill/60 border-b"
    >
      <ScrollView
        className="border-tertiary-system-background"
        horizontal
        contentContainerStyle={styles.tabScroller}
        style={{ paddingHorizontal, borderTopWidth: StyleSheet.hairlineWidth }}
      >
        {views.map((view) => {
          const isSelected = currentView === view.view
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setCurrentView(view.view)}
              key={view.name}
              className="mr-4 flex-row items-center justify-center"
            >
              <view.icon color={isSelected ? view.activeColor : "gray"} height={18} width={18} />
              <Text
                style={{
                  color: isSelected ? view.activeColor : "gray",
                  fontWeight: isSelected ? "medium" : "normal",
                }}
                className="ml-2"
              >
                {view.name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </ThemedBlurView>
  )
}

const styles = StyleSheet.create({
  tabContainer: {
    bottom: 0,
    left: 0,
    position: "absolute",
    width: "100%",
    borderTopColor: "rgba(0,0,0,0.2)",
    borderTopWidth: StyleSheet.hairlineWidth,
    height: bottomViewTabHeight,
  },
  tabScroller: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
  },
})
