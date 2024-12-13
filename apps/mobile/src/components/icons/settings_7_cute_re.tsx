import * as React from "react"
import Svg, { Path } from "react-native-svg"

interface Settings7CuteReIconProps {
  width?: number
  height?: number
  color?: string
}

export const Settings7CuteReIcon = ({
  width = 24,
  height = 24,
  color = "#10161F",
}: Settings7CuteReIconProps) => {
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 24 24">
      <Path fill="#fff" fillOpacity={0.01} d="M24 0v24H0V0z" />
      <Path
        fill={color}
        d="M13 3a1 1 0 1 0-2 0zM3 11a1 1 0 1 0 0 2zm3.634 8.294a1 1 0 0 0 1.732 1zm2.732-.732a1 1 0 1 0-1.732-1zm-1-14.856a1 1 0 0 0-1.732 1zm-.732 2.732a1 1 0 0 0 1.732-1zm-2.928.196a1 1 0 0 0-1 1.732zm.732 2.732a1 1 0 0 0 1-1.732zM21 13a1 1 0 1 0 0-2zm-6.366-7.562a1 1 0 1 0 1.732 1zm2.732-.732a1 1 0 1 0-1.732-1zM11 21a1 1 0 1 0 2 0zm5.366-3.438a1 1 0 1 0-1.732 1zm-.732 2.732a1 1 0 0 0 1.732-1zm1.928-12.66a1 1 0 0 0 1 1.732zm2.732.732a1 1 0 1 0-1-1.732zm-1 9a1 1 0 1 0 1-1.732zM3.706 15.634a1 1 0 1 0 1 1.732zM18 12a6 6 0 0 1-6 6v2a8 8 0 0 0 8-8zm-6 6a6 6 0 0 1-6-6H4a8 8 0 0 0 8 8zm-6-6a6 6 0 0 1 6-6V4a8 8 0 0 0-8 8zm6-6a6 6 0 0 1 6 6h2a8 8 0 0 0-8-8zm-1-3v9h2V3zM3 13h2v-2H3zm5.366 7.294 1-1.732-1.732-1-1 1.732zM6.634 4.706l1 1.732 1.732-1-1-1.732zm-2.928 3.66 1.732 1 1-1.732-1.732-1zM19 13h2v-2h-2zm-2.634-6.562 1-1.732-1.732-1-1 1.732zM11 19v2h2v-2zm3.634-.438 1 1.732 1.732-1-1-1.732zm3.928-9.196 1.732-1-1-1.732-1.732 1zm-7.062 3.5 7.794 4.5 1-1.732-7.794-4.5zm0-1.732-7.794 4.5 1 1.732 7.794-4.5z"
      />
    </Svg>
  )
}
