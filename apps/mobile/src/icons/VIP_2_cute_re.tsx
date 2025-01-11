import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface VIP2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const VIP2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: VIP2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0M12 20c2.573 0 3.86 0 4.862-.66a4.19 4.19 0 0 0 .116-.08c.978-.696 1.443-1.896 2.372-4.295l1.65-4.26s-3.7.736-5.5-.205C13.7 9.559 12 6 12 6s-1.7 3.765-3.5 4.706c-1.8.941-5.5 0-5.5 0l1.65 4.259c.929 2.4 1.394 3.599 2.372 4.295l.116.08C8.14 20 9.427 20 12 20"
      />
      <Path
        fill={color}
        d="M4 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0M23 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"
      />
    </Svg>
  )
}
