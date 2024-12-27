import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CheckFilledIconProps {
  width?: number
  height?: number
  color?: string
}

export const CheckFilledIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CheckFilledIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        fillRule="evenodd"
        d="M21.546 5.112a1.5 1.5 0 0 1 0 2.121L10.232 18.547a1.5 1.5 0 0 1-2.121 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.112a1.5 1.5 0 0 1 2.122 0"
        clipRule="evenodd"
      />
    </Svg>
  )
}
