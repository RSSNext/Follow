import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CompassCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const CompassCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CompassCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10M7.757 16.242c-1.06-1.06.707-4.95 2.122-6.364 1.414-1.414 5.303-3.181 6.364-2.12 1.06 1.06-.707 4.949-2.122 6.363-1.414 1.414-5.303 3.182-6.364 2.121M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
        clipRule="evenodd"
      />
    </Svg>
  )
}
