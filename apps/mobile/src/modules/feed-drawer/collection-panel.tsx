import { SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native"

import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useColor } from "@/src/theme/colors"

import { setCurrentView, useCurrentView } from "../subscription/atoms"

export const CollectionPanel = () => {
  const winDim = useWindowDimensions()
  const bg = useColor("secondarySystemBackground")

  return (
    <SafeAreaView style={{ width: Math.max(50, winDim.width * 0.15), backgroundColor: bg }}>
      <ScrollView contentContainerClassName="flex py-3 gap-3">
        {views.map((view) => (
          <CollectionButton key={view.name} view={view} />
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const CollectionButton = ({ view }: { view: ViewDefinition }) => {
  const selectedView = useCurrentView()

  const isActive = selectedView === view.view
  const defaultBg = useColor("systemBackground")
  const activeBg = useColor("systemFill")
  const bg = isActive ? activeBg : defaultBg

  return (
    <TouchableOpacity
      className="mx-3 flex aspect-square items-center justify-center rounded-lg p-3"
      style={{ backgroundColor: bg }}
      onPress={() => setCurrentView(view.view)}
    >
      <view.icon key={view.name} color={view.activeColor} />
    </TouchableOpacity>
  )
}
