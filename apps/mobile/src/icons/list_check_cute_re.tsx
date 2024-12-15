import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface ListCheckCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const ListCheckCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: ListCheckCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M5 19a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M9 5h11M9 12h11M9 19h11M5 5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 7a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
    </Svg>
  )
}
