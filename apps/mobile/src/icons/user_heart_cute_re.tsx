import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface UserHeartCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const UserHeartCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: UserHeartCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12.21 14.064A11.468 11.468 0 0 0 11 14c-4.418 0-8 2.567-8 4.5 0 1.933 3.582 2.5 8 2.5.226 0 .45-.002.672-.005M15 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0m0 10.453c-.038-1.714 1.77-2.87 3-1.554 1.23-1.316 3.038-.16 3 1.554-.023 1.02-.822 1.998-2.397 2.934-.092.054-.236.136-.36.206a.494.494 0 0 1-.486 0c-.124-.07-.268-.152-.36-.206-1.575-.936-2.373-1.913-2.396-2.934"
      />
    </Svg>
  )
}
