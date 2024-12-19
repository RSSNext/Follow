import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface SortAscendingCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const SortAscendingCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: SortAscendingCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M4 12h9m-9 7h9M4 5h7m7 14V5m2.828 2c-.646-1.17-1.462-2.02-2.588-2.69a.468.468 0 0 0-.48 0c-1.126.67-1.942 1.52-2.588 2.69"
      />
    </Svg>
  )
}
