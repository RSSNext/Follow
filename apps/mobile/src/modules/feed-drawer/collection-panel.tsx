import { cn } from "@follow/utils"
import { SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions } from "react-native"

import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"

import { setCurrentView, useCurrentView } from "../subscription/atoms"

export const CollectionPanel = () => {
  const winDim = useWindowDimensions()

  return (
    <SafeAreaView
      className="bg-secondary-system-background"
      style={{ width: Math.max(50, winDim.width * 0.15) }}
    >
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

  return (
    <TouchableOpacity
      className={cn(
        "mx-3 flex aspect-square items-center justify-center rounded-lg p-3",
        isActive ? "bg-system-fill" : "bg-system-background",
      )}
      onPress={() => setCurrentView(view.view)}
    >
      <view.icon key={view.name} color={view.activeColor} />
    </TouchableOpacity>
  )
}
