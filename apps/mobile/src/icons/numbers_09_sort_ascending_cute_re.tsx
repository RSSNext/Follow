import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Numbers09SortAscendingCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Numbers09SortAscendingCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Numbers09SortAscendingCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 15.01c0 3-2.5 4.99-2.5 4.99M17 5v14m2.828-2c-.691 1.251-1.577 2.137-2.828 2.828-1.251-.691-2.137-1.577-2.828-2.828M8 17a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2m0-7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2"
      />
    </Svg>
  )
}
