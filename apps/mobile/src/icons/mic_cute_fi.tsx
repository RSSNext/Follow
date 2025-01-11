import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface MicCuteFiIconProps {
  width?: number
  height?: number
  color?: string
}

export const MicCuteFiIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: MicCuteFiIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M7 7a5 5 0 0 1 10 0v5a5 5 0 0 1-10 0zm6 12.938V21a1 1 0 1 1-2 0v-1.062a8.005 8.005 0 0 1-6.919-6.796 1 1 0 0 1 1.98-.284 6.001 6.001 0 0 0 11.878 0 1 1 0 0 1 1.98.284A8.004 8.004 0 0 1 13 19.938"
        clipRule="evenodd"
      />
    </Svg>
  )
}
