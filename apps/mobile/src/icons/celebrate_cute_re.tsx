import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CelebrateCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const CelebrateCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CelebrateCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="m14.182 9.818 1.06-1.06m-3.535-.708s1.414-2.828.707-4.95m3.182 9.546s2.475-.353 4.243.707m-2.475-6.717.707-.707m.354 3.889h.707M9.236 19.844l1.394-.477c2.723-.932 4.085-1.398 4.336-2.48.25-1.08-.767-2.098-2.802-4.133l-.918-.918C9.211 9.801 8.193 8.783 7.112 9.034c-1.081.25-1.547 1.612-2.479 4.336l-.477 1.394c-1.15 3.36-1.724 5.04-.842 5.922.881.882 2.561.307 5.922-.842"
      />
    </Svg>
  )
}
