import type { FeedViewType } from "@follow/constants"
import { cn } from "@follow/utils"
import { Text, TouchableOpacity, View } from "react-native"

import { Grid } from "@/src/components/ui/grid"
import { views } from "@/src/constants/views"

interface Props {
  value: FeedViewType
  onChange: (value: FeedViewType) => void

  className?: string
}

export const FeedViewSelector = ({ value, onChange, className }: Props) => {
  return (
    <Grid columns={views.length} gap={5} className={className}>
      {views.map((view) => {
        const isSelected = +value === +view.view
        return (
          <TouchableOpacity key={view.name} onPress={() => onChange(view.view)}>
            <View className="flex-1 items-center">
              <view.icon color={isSelected ? view.activeColor : "gray"} height={18} width={18} />
              <Text
                className={cn(
                  "mt-1 whitespace-nowrap text-[8px] font-medium",
                  isSelected ? "text-accent" : "text-secondary-label",
                )}
              >
                {view.name}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </Grid>
  )
}
