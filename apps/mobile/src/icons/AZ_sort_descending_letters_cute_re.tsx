import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface AZSortDescendingLettersCuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const AZSortDescendingLettersCuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: AZSortDescendingLettersCuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.714 9h4.572M5 11a35.518 35.518 0 0 1 2.365-6.715.496.496 0 0 1 .45-.285h.37c.192 0 .368.11.45.285A35.52 35.52 0 0 1 11 11m-6 3h5.5a.5.5 0 0 1 .3.9l-5.6 4.2a.5.5 0 0 0 .3.9H11m6 0V6m2.828 2C19.138 6.75 18.252 5.863 17 5.172 15.75 5.863 14.863 6.749 14.172 8"
      />
    </Svg>
  )
}
