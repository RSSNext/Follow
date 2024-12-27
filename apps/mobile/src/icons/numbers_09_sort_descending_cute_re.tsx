import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Numbers09SortDescendingCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Numbers09SortDescendingCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Numbers09SortDescendingCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 15.01c0 3-2.5 4.99-2.5 4.99m9.5 0V6m2.828 2C19.138 6.75 18.252 5.863 17 5.172 15.75 5.863 14.863 6.749 14.172 8M8 17a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2m0-7a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2"
      />
    </Svg>
  )
}
