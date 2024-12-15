import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Search2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Search2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Search2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M14.5 14.5 20 20m-4-10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
      />
    </Svg>
  )
}
