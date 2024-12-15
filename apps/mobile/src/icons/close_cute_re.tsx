import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface CloseCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const CloseCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: CloseCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M6.343 4.93a1 1 0 0 0-1.414 1.414zm11.314 14.142a1 1 0 1 0 1.414-1.415zM4.929 17.658a1 1 0 0 0 1.414 1.414zM19.07 6.344a1 1 0 0 0-1.414-1.414zm-14.142 0 12.728 12.728 1.414-1.415L6.343 4.93zm1.414 12.728L19.07 6.344 17.657 4.93 4.929 17.658z"
      />
    </Svg>
  )
}
