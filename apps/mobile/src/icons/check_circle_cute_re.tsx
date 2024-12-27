import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CheckCircleCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const CheckCircleCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CheckCircleCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M8.332 11.099a1 1 0 1 0-1.15 1.636zm2.254 3.646-.818.575a1 1 0 0 0 1.695-.095zm6.136-4.78a1 1 0 1 0-.96-1.754zM20 12a8 8 0 0 1-8 8v2c5.523 0 10-4.477 10-10zm-8 8a8 8 0 0 1-8-8H2c0 5.523 4.477 10 10 10zm-8-8a8 8 0 0 1 8-8V2C6.477 2 2 6.477 2 12zm8-8a8 8 0 0 1 8 8h2c0-5.523-4.477-10-10-10zm-4.818 8.735a10.387 10.387 0 0 1 2.586 2.585l1.636-1.15a12.385 12.385 0 0 0-3.072-3.071zm4.281 2.49c1.282-2.346 2.913-3.977 5.26-5.26l-.96-1.754c-2.682 1.466-4.59 3.372-6.055 6.054z"
      />
    </Svg>
  )
}
