import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface PauseCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const PauseCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: PauseCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M14 5a2 2 0 1 1 4 0v14a2 2 0 1 1-4 0zM6 5a2 2 0 1 1 4 0v14a2 2 0 1 1-4 0z"
      />
    </Svg>
  )
}
