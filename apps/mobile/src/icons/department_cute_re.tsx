import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface DepartmentCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const DepartmentCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: DepartmentCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 0v4m-6 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      />
    </Svg>
  )
}
