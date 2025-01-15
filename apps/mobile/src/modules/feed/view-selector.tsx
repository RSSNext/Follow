import type { FeedViewType } from "@follow/constants"
import { cn } from "@follow/utils"
import { Text, TouchableOpacity, View } from "react-native"

import { Grid } from "@/src/components/ui/grid"
import { views } from "@/src/constants/views"
import { useColor } from "@/src/theme/colors"

interface Props {
  value: FeedViewType
  onChange?: (value: FeedViewType) => void

  className?: string
  readOnly?: boolean
}

export const FeedViewSelector = ({ value, onChange, className, readOnly }: Props) => {
  const secondaryLabelColor = useColor("secondaryLabel")
  return (
    <Grid columns={views.length} gap={5} className={className}>
      {views.map((view) => {
        const isSelected = +value === +view.view
        return (
          <TouchableOpacity
            key={view.name}
            onPress={() => onChange?.(view.view)}
            disabled={readOnly}
            className={readOnly ? "opacity-50" : undefined}
          >
            <View className="flex-1 items-center">
              <view.icon
                color={isSelected ? view.activeColor : secondaryLabelColor}
                height={18}
                width={18}
              />
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
