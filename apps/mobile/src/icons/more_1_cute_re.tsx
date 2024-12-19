import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface More1CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const More1CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: More1CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M12.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M18.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M6.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
      />
      <Path
        stroke={color}
        strokeWidth={2}
        d="M12.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM18.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM6.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
    </Svg>
  )
}
