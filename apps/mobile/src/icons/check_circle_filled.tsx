import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CheckCircleFilledIconProps {
  width?: number
  height?: number
  color?: string
}

export const CheckCircleFilledIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CheckCircleFilledIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2m4.95 7.795a1 1 0 0 0-1.415-1.414l-4.95 4.95-2.12-2.121a1 1 0 0 0-1.415 1.414l2.829 2.828a1 1 0 0 0 1.414 0z"
        clipRule="evenodd"
      />
    </Svg>
  )
}
