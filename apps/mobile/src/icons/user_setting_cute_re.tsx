import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface UserSettingCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const UserSettingCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: UserSettingCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12.21 14.064A11.468 11.468 0 0 0 11 14c-4.418 0-8 2.567-8 4.5 0 1.933 3.582 2.5 8 2.5.226 0 .45-.002.672-.005M19 19.732a2 2 0 1 0-2-3.464m2 3.464a2 2 0 1 1-2-3.464m2 3.464.75 1.299M17 16.268l-.75-1.3M16 18h-1.5m7 0H20m-1-1.732.75-1.3m-3.5 6.063.75-1.3M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0"
      />
    </Svg>
  )
}
