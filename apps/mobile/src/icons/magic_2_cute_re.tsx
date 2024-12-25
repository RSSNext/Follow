import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Magic2CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Magic2CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Magic2CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m6.05 6.05 1.413 1.413M12.006 12l8.186 8.192M15.95 6.05l-1.411 1.412m-7.072 7.07L6.05 15.95M18 11h-2.05m-9.9 0H4m7 7v-2.05m0-9.9V4"
      />
    </Svg>
  )
}
